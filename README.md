# MCP-Powered RAG Knowledge Assistant

An enterprise-ready knowledge assistant built around the Model Context Protocol (MCP) and retrieval-augmented generation (RAG).

Users can upload business documents, ask questions in natural language, receive answers grounded in those documents, and use approved MCP tools from the same conversation. MCP enables the assistant to connect with external systems such as files, websites, GitHub, and Google Drive without tightly coupling those integrations to the application.

## Key Capabilities

- Retrieval-augmented answers from PDF, TXT, Markdown, and DOCX files
- Conversation-specific document collections and source citations
- MCP-based access to approved external tools and business systems
- Persistent local storage with Chroma and SQLite
- Streaming responses through a React and Vite interface
- Support for Anthropic, OpenAI, Gemini, and Ollama
- Extensible MCP integrations for file access, web content, GitHub, Google Drive, and other services

## Requirements

- Python 3.10 or later
- Node.js 18 or later
- npm or pnpm
- An API key for the selected hosted LLM provider, or a local Ollama installation
- `npx` and `uvx` when using the enabled MCP servers

## Setup

### 1. Start the backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the environment and install dependencies:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env` and configure one LLM provider. Example:

```dotenv
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_MODEL=claude-sonnet-4-6
```

Start the API:

```bash
uvicorn app.main:app --reload
```

The backend is available at `http://localhost:8000`.

### 2. Start the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## LLM Providers

Set `LLM_PROVIDER` to one of the following values:

| Provider | Required configuration | Default model |
| --- | --- | --- |
| `anthropic` | `ANTHROPIC_API_KEY` | `claude-sonnet-4-6` |
| `openai` | `OPENAI_API_KEY` | `gpt-4o-mini` |
| `gemini` | `GEMINI_API_KEY` | `gemini-2.5-flash` |
| `ollama` | A running Ollama server | `llama3` |

For Ollama, configure the optional connection settings when needed:

```dotenv
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3
```

Document embedding and reranking run locally and do not require an additional API key.

## MCP Integrations

The assistant connects to MCP servers at backend startup and can discover and call the tools they provide during a chat. MCP servers are managed in `backend/mcp_servers.json`. Set `enabled` to `true` for the integrations required by your organization, then restart the backend.

The configuration includes examples for:

- Filesystem access to `backend/data`
- Web page retrieval through Fetch
- GitHub repositories, issues, and pull requests
- Google Drive search and document access

GitHub and Google Drive require additional credentials and setup. Do not commit API keys, access tokens, or OAuth secrets to the repository.

