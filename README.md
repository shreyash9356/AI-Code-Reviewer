## AI Code Review Tool

Minimal starter project for an AI-powered code review system built for hackathon-style experimentation.

### Tech Stack

- **Frontend**: HTML, CSS, JavaScript (static)
- **Backend**: Python, FastAPI
- **AI Integration**: pluggable LLM (e.g., Gemini, OpenAI) through `backend/services/ai_reviewer.py`

### Project Structure

- `frontend/` – Static UI to paste code and display analysis
- `backend/` – FastAPI app, routes, services, parsers, models, and utilities
- `datasets/` – JSON with basic bug patterns
- `tests/` – Simple API tests
- `docker/` – Containerization setup

### Running Locally

1. **Install dependencies**

```bash
pip install -r requirements.txt
```

2. **Start the backend**

```bash
uvicorn backend.main:app --reload
```

3. **Open the frontend**

Serve `frontend/` with any static file server (e.g., VS Code Live Server, `python -m http.server`) and open `index.html` in your browser.

### Extending

- Implement real parsing in `backend/parsers/`
- Add richer static analysis in `backend/services/`
- Connect an LLM in `backend/services/ai_reviewer.py` using your provider’s SDK and API key (configured via environment variables).

