# AI Code Review Backend

This is the backend for the AI-powered Code Review web application. It parses code snippets and GitHub repositories and analyzes them using the Google Gemini API.

## Project Structure
```text
backend/
├── main.py                   # FastAPI application entry point
├── routes/
│   └── review.py             # API endpoints (/api/review and /api/review-repo)
├── services/
│   └── ai_reviewer.py        # Gemini API interaction logic
├── utils/
│   └── github_fetcher.py     # GitHub API retrieval logic
├── requirements.txt          # Python dependencies
└── .env                      # Environment variables map
```

## How to Run Locally

### 1. Prerequisites
- Python 3.9+
- A Google Gemini API Key: You can get one from [Google AI Studio](https://aistudio.google.com/).
- (Optional) A GitHub Personal Access Token if you intend to review a lot of GitHub repos and want to increase rate limits.

### 2. Setup environment
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment (recommended):
```bash
python -m venv venv
```

Activate the virtual environment:
- On Windows:
  ```bash
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Requirements
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Open the `.env` file in the `backend` directory and insert your Gemini API key:
```dotenv
GEMINI_API_KEY=your_actual_gemini_api_key_here
GITHUB_TOKEN=your_optional_github_token_here
```

### 5. Run the Server
Run the FastAPI application via Uvicorn:
```bash
uvicorn main:app --reload
```

The server will start locally at: `http://127.0.0.1:8000`
You can view the interactive Swagger API documentation at: `http://127.0.0.1:8000/docs`

## API Endpoints

### 1. Code Review (`POST /api/review`)
Provide a code snippet and language to get it reviewed.
**Request Body (JSON):**
```json
{
  "code": "def hello(): print('world')",
  "language": "python"
}
```

### 2. Repository Review (`POST /api/review-repo`)
Provide a GitHub repo URL to load and review files.
**Request Body (JSON):**
```json
{
  "github_url": "https://github.com/user/repository"
}
```

## AI Response Output format
```json
{
  "bugs": [],
  "security_issues": [],
  "suggestions": [],
  "code_quality_score": "8/10"
}
```
