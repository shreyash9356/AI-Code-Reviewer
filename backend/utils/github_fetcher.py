import httpx
import os
import re

async def fetch_github_repo_files(github_url: str) -> dict:
    """
    Fetches the source code files from the given GitHub repository URL.
    Returns a dictionary mapping file paths to their contents.
    """
    # Regex to match Github URLs
    pattern = r"https://github\.com/([^/]+)/([^/]+)"
    match = re.match(pattern, github_url)
    
    if not match:
        raise ValueError("Invalid GitHub repository URL format. Expected: https://github.com/username/repo")
        
    owner, repo = match.groups()
    repo = repo.removesuffix(".git")
    
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token and github_token != "your_github_token_here_optional":
        headers["Authorization"] = f"token {github_token}"
        
    api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url, headers=headers)
        
        # Fallback for older repositories using 'master' branch
        if response.status_code == 404:
            api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"
            response = await client.get(api_url, headers=headers)
            
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch repository metadata. Please check the URL or your API limits. Status: {response.status_code}")
            
        data = response.json()
        tree = data.get("tree", [])
        
        # Valid extensions we want to analyze
        valid_extensions = {".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".cpp", ".c", ".h", ".go", ".rs", ".php", ".rb"}
        
        files_to_fetch = []
        for item in tree:
            if item["type"] == "blob":
                path = item["path"]
                ext = os.path.splitext(path)[1].lower()
                if ext in valid_extensions:
                    files_to_fetch.append(path)
                    
        # Limit to 10 files to avoid massive prompts (and API limits)
        files_to_fetch = files_to_fetch[:10]
        
        fetched_content = {}
        for path in files_to_fetch:
            # Use raw content endpoint
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{path}"
            file_resp = await client.get(raw_url, headers=headers)
            
            if file_resp.status_code == 404:
                # Try master if main failed
                raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/master/{path}"
                file_resp = await client.get(raw_url, headers=headers)
                
            if file_resp.status_code == 200:
                fetched_content[path] = file_resp.text
                
        return fetched_content
