const API_BASE_URL = "http://127.0.0.1:8000";

async function analyzeCode() {
  const languageEl = document.getElementById("language");
  const codeEl = document.getElementById("code");
  const resultsEl = document.getElementById("results");
  const statusEl = document.getElementById("status");

  const language = languageEl.value;
  const code = codeEl.value.trim();

  if (!code) {
    statusEl.textContent = "Please paste some code first.";
    return;
  }

  statusEl.textContent = "Analyzing code with AI...";
  resultsEl.textContent = "";

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language, code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    resultsEl.textContent = JSON.stringify(data, null, 2);
    statusEl.textContent = "Analysis complete.";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to analyze code. See console for details.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze-btn");
  analyzeBtn.addEventListener("click", analyzeCode);
});

