"""
Generic MCP client.

Connects to every "enabled" server listed in mcp_servers.json (stdio
transport), collects their tool lists, and exposes:

  - get_tool_specs()       -> tool definitions formatted for the LLM provider
  - call_tool(name, args)  -> executes a tool call and returns its result

This is intentionally provider-agnostic: add or remove servers in
mcp_servers.json and nothing else in the app needs to change.
"""
from __future__ import annotations

import asyncio
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from . import config


class MCPManager:
    def __init__(self):
        self.sessions: dict[str, ClientSession] = {}
        self._stack: AsyncExitStack | None = None
        self._tool_to_server: dict[str, str] = {}

    async def connect_all(self):
        self._stack = AsyncExitStack()
        for server in config.load_mcp_servers():
            if not server.get("enabled", False):
                continue
            name = server["name"]
            try:
                params = StdioServerParameters(
                    command=server["command"],
                    args=server.get("args", []),
                    env=server.get("env") or None,
                )
                read, write = await self._stack.enter_async_context(stdio_client(params))
                session = await self._stack.enter_async_context(ClientSession(read, write))
                await session.initialize()
                self.sessions[name] = session

                tools = await session.list_tools()
                for tool in tools.tools:
                    self._tool_to_server[tool.name] = name
            except Exception as exc:
                # A single misconfigured/unreachable MCP server (missing
                # binary, bad OAuth creds, no network for npx, etc.)
                # should not take the whole backend down.
                print(f"[mcp] failed to connect to server '{name}': {exc}")

    async def close(self):
        if self._stack:
            await self._stack.aclose()

    async def get_tool_specs(self) -> list[dict]:
        """Anthropic-style tool specs: {name, description, input_schema}."""
        specs = []
        for name, session in self.sessions.items():
            tools = await session.list_tools()
            for tool in tools.tools:
                specs.append(
                    {
                        "name": tool.name,
                        "description": tool.description or "",
                        "input_schema": tool.inputSchema,
                    }
                )
        return specs

    async def call_tool(self, name: str, arguments: dict) -> str:
        server_name = self._tool_to_server.get(name)
        if not server_name:
            return f"Error: no MCP server exposes a tool named '{name}'"
        session = self.sessions[server_name]
        result = await session.call_tool(name, arguments)
        parts = []
        for block in result.content:
            if hasattr(block, "text"):
                parts.append(block.text)
        return "\n".join(parts) if parts else str(result)


# Single shared instance, connected once at app startup (see main.py lifespan).
mcp_manager = MCPManager()
