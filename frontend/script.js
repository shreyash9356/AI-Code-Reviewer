/**
 * JavaScript functionality for AI Code Review Tool
 */

const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const analyzeBtn = document.getElementById("analyze-btn");
    const codeInput = document.getElementById("code-input");
    const lineNumbers = document.getElementById("line-numbers");
    
    // Line number synchronization
    // 6. Line-number style textarea logic
    codeInput.addEventListener("scroll", () => {
        lineNumbers.scrollTop = codeInput.scrollTop;
    });

    codeInput.addEventListener("input", () => {
        updateLineNumbers(codeInput, lineNumbers);
    });

    // Handle "Tab" key in textarea to insert spaces instead of changing focus
    codeInput.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = codeInput.selectionStart;
            const end = codeInput.selectionEnd;
            // Insert 4 spaces
            codeInput.value = codeInput.value.substring(0, start) + "    " + codeInput.value.substring(end);
            codeInput.selectionStart = codeInput.selectionEnd = start + 4;
            updateLineNumbers(codeInput, lineNumbers);
        }
    });

    // Init lines
    updateLineNumbers(codeInput, lineNumbers);

    // Analyze click handler
    analyzeBtn.addEventListener("click", analyzeCode);
});

/**
 * Updates the line numbers UI based on textarea content
 */
function updateLineNumbers(textarea, lineNumbersEl) {
    const linesCount = textarea.value.split('\n').length;
    // For performance on huge files, we could virtualize, but simple mapping works for moderate code
    lineNumbersEl.innerHTML = Array(linesCount).fill(0).map((_, i) => i + 1).join('<br/>');
}

/**
 * Main Analyze Function (7. JavaScript Functionality)
 */
async function analyzeCode() {
    const languageSelect = document.getElementById("language-select");
    const codeInput = document.getElementById("code-input");
    const resultsContent = document.getElementById("results-content");
    const statusMessage = document.getElementById("status-message");
    const analyzeBtn = document.getElementById("analyze-btn");
    
    const scoreHeader = document.getElementById("score-header");

    const language = languageSelect.value;
    const code = codeInput.value.trim();

    if (!code) {
        showStatus("Please paste some code to analyze.", "error");
        return;
    }

    // Update UI for Loading State
    showStatus("Analyzing code... Please wait.", "loading");
    analyzeBtn.disabled = true;
    
    // Clear old results
    resultsContent.innerHTML = "";
    scoreHeader.classList.add("hidden");

    try {
        // Send POST request to backend API (9. Fetch API)
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ language, code }), // Request format
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();
        
        showStatus("Analysis complete.", "success");
        analyzeBtn.disabled = false;

        // Render sections and score
        renderResults(data);
        renderScore(data);

    } catch (error) {
        console.error("Analysis Error:", error);
        showStatus("Error connecting to analyze API. Ensure backend is running.", "error");
        analyzeBtn.disabled = false;
        
        // Show empty state error
        resultsContent.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-bug)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <p style="color: var(--color-bug)">Connection Failed</p>
                <p class="sub-text">Could not reach the FastAPI backend at ${API_BASE_URL}</p>
            </div>
        `;
    }
}

/**
 * Display status message helper
 */
function showStatus(message, type) {
    const statusMessage = document.getElementById("status-message");
    statusMessage.textContent = message;
    statusMessage.className = `status-text ${type}`;
    statusMessage.classList.remove("hidden");
}

/**
 * Render the Results UI logic inside Output Panel
 */
function renderResults(data) {
    const container = document.getElementById("results-content");
    container.innerHTML = "";

    let hasResults = false;

    // Mapping icons for different categories (SVG inner paths)
    const icons = {
        bug: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>', // Alert
        perf: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>', // Zap
        sec: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>', // Lock
        sug: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>' // Info
    };

    // Helper: Create individual cards
    const renderCard = (type, titleClass, titleLabel, item) => {
        hasResults = true;
        
        // The backend model might have dicts like {"description": "...", "line": 5, "suggestion": "..."}
        // Fallback checks incase backend returns string
        let line = null;
        let desc = typeof item === 'string' ? item : "";
        let fix = "";

        if (typeof item === 'object') {
            line = item.line;
            desc = item.description || item.issue || item.message || desc;
            fix = item.suggestion || item.fix || item.recommendation || "";
        }

        const iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-${type}">${icons[type]}</svg>`;

        // Card Template
        const template = `
            <div class="result-card ${type}">
                <div class="card-header">
                    <div class="card-title-group">
                        ${iconSvg}
                        <span>${titleLabel}</span>
                    </div>
                    ${line ? `<div class="card-line-number">Line ${line}</div>` : ""}
                </div>
                <div class="card-desc">${desc}</div>
                ${fix ? `<div class="card-fix"><div style="color:var(--text-main);font-weight:600;margin-bottom:0.25rem;">Suggested Fix:</div>${fix}</div>` : ""}
            </div>
        `;
        container.innerHTML += template;
    };

    // 1. Bugs (logical_issues) -> Red warning card
    if (data.logical_issues && data.logical_issues.length > 0) {
        data.logical_issues.forEach(issue => renderCard('bug', 'bug', 'Bug / Error', issue));
    }

    // 2. Performance Issues -> Yellow card
    if (data.performance_issues && data.performance_issues.length > 0) {
        data.performance_issues.forEach(issue => renderCard('perf', 'perf', 'Performance Issue', issue));
    }

    // 3. Security Vulnerabilities -> Purple card
    if (data.security_issues && data.security_issues.length > 0) {
        data.security_issues.forEach(issue => renderCard('sec', 'sec', 'Security Risk', issue));
    }

    // 4. Code Quality Suggestions -> Blue card
    if (data.ai_suggestions && data.ai_suggestions.length > 0) {
        data.ai_suggestions.forEach(issue => renderCard('sug', 'sug', 'Improvement Suggestion', issue));
    }

    // If no results returned
    if (!hasResults) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <p style="color: #10b981; font-weight: 500;">No Issues Found</p>
                <p class="sub-text">Your code looks clean and optimal!</p>
            </div>
        `;
    }
}

/**
 * 4. Code Quality Score indicator
 */
function renderScore(data) {
    const scoreHeader = document.getElementById("score-header");
    const scoreBar = document.getElementById("score-bar");
    const scoreValue = document.getElementById("score-value");

    // Dynamic scoring since API doesn't specify a score field in response model
    let deductions = 0;
    
    // Assign weights to different issues
    if (data.logical_issues) deductions += data.logical_issues.length * 2.5;     // High impact
    if (data.security_issues) deductions += data.security_issues.length * 3.0;   // Critical
    if (data.performance_issues) deductions += data.performance_issues.length * 1.5; // Med impact
    if (data.ai_suggestions) deductions += data.ai_suggestions.length * 0.5;     // Low impact
    
    // Calculate final score base 10
    let finalScore = Math.max(1, 10 - deductions);

    // If perfectly clean code
    if (deductions === 0 && (data.logical_issues || data.ai_suggestions)) {
        finalScore = 10;
    }

    // Rounding to integers since UI requests "8/10" format
    finalScore = Math.round(finalScore);

    // Show panel
    scoreHeader.classList.remove("hidden");
    scoreValue.textContent = `${finalScore}/10`;

    // Visual Meter Color change based on score
    scoreBar.style.width = `${finalScore * 10}%`;
    if (finalScore >= 8) {
        scoreBar.style.backgroundColor = "var(--color-sug)"; // Blue-ish or Green-ish
    } else if (finalScore >= 5) {
        scoreBar.style.backgroundColor = "var(--color-perf)"; // Yellow/Orange
    } else {
        scoreBar.style.backgroundColor = "var(--color-bug)"; // Red
    }
}
