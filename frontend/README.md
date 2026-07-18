
  # ChatGPT Inspired 

  ## Running the code

## 1. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:
- `LLM_PROVIDER` — `anthropic`, `openai`, or `ollama`
- Fill in the matching API key / model for whichever you pick. You only
  need one provider's credentials.

Run it:
```bash
uvicorn app.main:app --reload
```
Starts on `http://localhost:8000`. Check `http://localhost:8000/api/health`.
A `data/app.db` SQLite file and `data/chroma/` vector store are created
automatically on first run.

## 2. Frontend

```bash
npm i
npm run dev
```
`vite.config.ts` proxies `/api/*` to `http://localhost:8000`, so no CORS
config is needed in dev. On load, the sidebar fetches your saved
conversations from the backend — refreshing the page no longer loses
anything.

  