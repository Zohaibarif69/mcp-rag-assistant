"""
LLM provider abstraction — now streaming.

stream_response() is an async generator yielding events as they happen:
  {"type": "text", "delta": str}   -> a chunk of assistant text to append
  {"type": "tool_call", "name": str}  -> informational, model is using a tool
  {"type": "done"}                 -> generation finished

Swap providers via LLM_PROVIDER in .env; nothing else in the app changes.
"""
from __future__ import annotations

from typing import AsyncGenerator

from . import config
from .mcp_client import mcp_manager

SYSTEM_PROMPT = """You are a helpful AI assistant with two extra capabilities:

1. Retrieval-augmented context: relevant excerpts from the user's uploaded
   documents (numbered [1], [2], ...) may be included below under
   "Retrieved context". Cite them inline like [1] when you use them. If
   they don't contain the answer, say so and answer from general
   knowledge instead.
2. Tools (via MCP): you may call the provided tools when they would help
   answer the question (e.g. reading files, searching Google Drive,
   fetching a web page).

Be concise and accurate."""


def _build_system_prompt(retrieved: list[dict]) -> str:
    if not retrieved:
        return SYSTEM_PROMPT
    context_block = "\n\n".join(
        f"[{i + 1}] (Source: {r['source']})\n{r['text']}" for i, r in enumerate(retrieved)
    )
    return f"{SYSTEM_PROMPT}\n\n---\nRetrieved context:\n{context_block}\n---"


async def stream_response(
    history: list[dict], retrieved: list[dict]
) -> AsyncGenerator[dict, None]:
    """
    history: list of {"role": "user"|"assistant", "content": str}
    retrieved: RAG hits from rag.retrieve()
    """
    system_prompt = _build_system_prompt(retrieved)

    if config.LLM_PROVIDER == "anthropic":
        async for event in _stream_anthropic(system_prompt, history):
            yield event
    elif config.LLM_PROVIDER == "openai":
        async for event in _stream_openai(system_prompt, history):
            yield event
    elif config.LLM_PROVIDER == "gemini":
        async for event in _stream_gemini(system_prompt, history):
            yield event
    elif config.LLM_PROVIDER == "ollama":
        async for event in _stream_ollama(system_prompt, history):
            yield event
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {config.LLM_PROVIDER}")


async def _stream_anthropic(system_prompt: str, history: list[dict]) -> AsyncGenerator[dict, None]:
    import anthropic

    client = anthropic.AsyncAnthropic(api_key=config.ANTHROPIC_API_KEY)
    tool_specs = await mcp_manager.get_tool_specs()
    messages = [{"role": m["role"], "content": m["content"]} for m in history]

    for _ in range(6):
        async with client.messages.stream(
            model=config.ANTHROPIC_MODEL,
            max_tokens=1500,
            system=system_prompt,
            messages=messages,
            tools=tool_specs or None,
        ) as stream:
            async for text in stream.text_stream:
                yield {"type": "text", "delta": text}
            final = await stream.get_final_message()

        if final.stop_reason != "tool_use":
            yield {"type": "done"}
            return

        messages.append({"role": "assistant", "content": final.content})
        tool_results = []
        for block in final.content:
            if block.type == "tool_use":
                yield {"type": "tool_call", "name": block.name}
                result_text = await mcp_manager.call_tool(block.name, block.input)
                tool_results.append(
                    {"type": "tool_result", "tool_use_id": block.id, "content": result_text}
                )
        messages.append({"role": "user", "content": tool_results})

    yield {"type": "text", "delta": "\n\n(Stopped after too many tool calls.)"}
    yield {"type": "done"}


async def _stream_openai(system_prompt: str, history: list[dict]) -> AsyncGenerator[dict, None]:
    import json

    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=config.OPENAI_API_KEY)
    tool_specs = await mcp_manager.get_tool_specs()
    openai_tools = [
        {
            "type": "function",
            "function": {
                "name": t["name"],
                "description": t["description"],
                "parameters": t["input_schema"],
            },
        }
        for t in tool_specs
    ]

    messages = [{"role": "system", "content": system_prompt}] + history

    for _ in range(6):
        stream = await client.chat.completions.create(
            model=config.OPENAI_MODEL,
            messages=messages,
            tools=openai_tools or None,
            stream=True,
        )

        text_parts: list[str] = []
        tool_call_chunks: dict[int, dict] = {}
        finish_reason = None

        async for chunk in stream:
            choice = chunk.choices[0]
            finish_reason = choice.finish_reason or finish_reason
            delta = choice.delta

            if delta.content:
                text_parts.append(delta.content)
                yield {"type": "text", "delta": delta.content}

            if delta.tool_calls:
                for tc in delta.tool_calls:
                    slot = tool_call_chunks.setdefault(
                        tc.index, {"id": None, "name": "", "arguments": ""}
                    )
                    if tc.id:
                        slot["id"] = tc.id
                    if tc.function and tc.function.name:
                        slot["name"] += tc.function.name
                    if tc.function and tc.function.arguments:
                        slot["arguments"] += tc.function.arguments

        if finish_reason != "tool_calls" or not tool_call_chunks:
            yield {"type": "done"}
            return

        assistant_msg = {
            "role": "assistant",
            "content": "".join(text_parts) or None,
            "tool_calls": [
                {
                    "id": slot["id"],
                    "type": "function",
                    "function": {"name": slot["name"], "arguments": slot["arguments"]},
                }
                for slot in tool_call_chunks.values()
            ],
        }
        messages.append(assistant_msg)

        for slot in tool_call_chunks.values():
            yield {"type": "tool_call", "name": slot["name"]}
            args = json.loads(slot["arguments"] or "{}")
            result_text = await mcp_manager.call_tool(slot["name"], args)
            messages.append({"role": "tool", "tool_call_id": slot["id"], "content": result_text})

    yield {"type": "text", "delta": "\n\n(Stopped after too many tool calls.)"}
    yield {"type": "done"}


async def _stream_gemini(system_prompt: str, history: list[dict]) -> AsyncGenerator[dict, None]:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=config.GEMINI_API_KEY)
    tool_specs = await mcp_manager.get_tool_specs()

    # Gemini uses role "model" instead of "assistant", and a Content/Part
    # structure instead of plain strings.
    contents: list[types.Content] = [
        types.Content(
            role="model" if m["role"] == "assistant" else "user",
            parts=[types.Part.from_text(text=m["content"])],
        )
        for m in history
    ]

    gemini_tools = None
    if tool_specs:
        function_declarations = [
            types.FunctionDeclaration(
                name=t["name"],
                description=t["description"],
                parameters=t["input_schema"],
            )
            for t in tool_specs
        ]
        gemini_tools = [types.Tool(function_declarations=function_declarations)]

    gen_config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        tools=gemini_tools,
        # We drive the tool-call loop ourselves (to route calls through
        # MCP), so disable Gemini's own automatic function execution.
        automatic_function_calling=(
            types.AutomaticFunctionCallingConfig(disable=True) if gemini_tools else None
        ),
    )

    for _ in range(6):
        stream = await client.aio.models.generate_content_stream(
            model=config.GEMINI_MODEL,
            contents=contents,
            config=gen_config,
        )

        function_calls = []
        async for chunk in stream:
            if chunk.text:
                yield {"type": "text", "delta": chunk.text}
            if chunk.function_calls:
                function_calls.extend(chunk.function_calls)

        if not function_calls:
            yield {"type": "done"}
            return

        contents.append(
            types.Content(
                role="model",
                parts=[
                    types.Part.from_function_call(name=fc.name, args=fc.args)
                    for fc in function_calls
                ],
            )
        )

        response_parts = []
        for fc in function_calls:
            yield {"type": "tool_call", "name": fc.name}
            result_text = await mcp_manager.call_tool(fc.name, dict(fc.args or {}))
            response_parts.append(
                types.Part.from_function_response(name=fc.name, response={"result": result_text})
            )
        contents.append(types.Content(role="user", parts=response_parts))

    yield {"type": "text", "delta": "\n\n(Stopped after too many tool calls.)"}
    yield {"type": "done"}


async def _stream_ollama(system_prompt: str, history: list[dict]) -> AsyncGenerator[dict, None]:
    # Local models here are treated as RAG-only (no tool calling), since
    # function-calling support varies a lot across local models.
    import json

    import httpx

    messages = [{"role": "system", "content": system_prompt}] + history
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream(
            "POST",
            f"{config.OLLAMA_HOST}/api/chat",
            json={"model": config.OLLAMA_MODEL, "messages": messages, "stream": True},
        ) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line.strip():
                    continue
                data = json.loads(line)
                content = data.get("message", {}).get("content", "")
                if content:
                    yield {"type": "text", "delta": content}
                if data.get("done"):
                    yield {"type": "done"}
                    return
