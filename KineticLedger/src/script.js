/**
 * KINETIC LEDGER - Neural Evolution Interface
 * Main Application Logic (Modular Version)
 */

import { stats, API_KEY, initChart } from './core/engine.js';

// Initialize the Radar Chart from the core engine
const ctx = document.getElementById('impactChart').getContext('2d');
const impactChart = initChart(ctx);

/**
 * 4. Primary AI Analysis Logic
 * Extracts growth scores from natural language input.
 */
window.analyzeImpact = async function() {
    const userInput = document.getElementById('ai-input').value;
    const btn = document.getElementById('exec-btn');
    const status = document.getElementById('status-text');

    if (!userInput.trim()) {
        alert("Input stream empty. Please describe your activity flux.");
        return;
    }

    // UI Feedback
    btn.disabled = true;
    btn.innerText = "THINKING...";
    status.innerText = "AGENT PARSING FLUX DATA...";
    status.classList.add('animate-pulse');

    const prompt = `Analyze: "${userInput}". 
    Rate its impact on 5 categories: Technical, Creative, Social, Logic, Empathy. 
    Return ONLY a JSON object like this: {"technical": 15, "creative": 5, "social": 20, "logic": 10, "empathy": 5}. 
    Values must be between 5 and 30. No other text.`;

    try {
        // Attempting stable v1 endpoint
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error("API_OFFLINE");

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const jsonString = rawText.match(/\{.*\}/s)[0]; 
        const scores = JSON.parse(jsonString);

        applyScores(scores, userInput);
        status.innerText = "EVOLUTION SYNCHRONIZED.";

    } catch (error) {
        console.error("Switching to Heuristic Engine:", error);
        
        // HEURISTIC FALLBACK: Keyword-based analysis if API fails
        const fallbackScores = {
            technical: userInput.match(/code|debug|api|build|tech|programming/i) ? 20 : 5,
            creative: userInput.match(/bake|design|art|create|travel/i) ? 20 : 5,
            social: userInput.match(/team|lead|talk|event|manage|organized/i) ? 20 : 5,
            logic: userInput.match(/plan|solve|fix|math|logic/i) ? 20 : 5,
            empathy: userInput.match(/help|mentor|support|user|friend/i) ? 20 : 5
        };
        
        applyScores(fallbackScores, userInput);
        status.innerText = "EVOLUTION SYNCHRONIZED (LOCAL ENGINE).";
    } finally {
        btn.disabled = false;
        btn.innerText = "Sync Growth Flux";
        setTimeout(() => {
            status.classList.remove('animate-pulse');
        }, 2000);
    }
}

/**
 * Helper to update global state, chart, and trigger agent.
 */
function applyScores(scores, input) {
    // Update global stats exported from engine.js
    for (let key in scores) {
        stats[key] = Math.min(stats[key] + scores[key], 100);
    }
    
    // Refresh Visualization
    impactChart.data.datasets[0].data = [
        stats.technical, stats.creative, stats.social, stats.logic, stats.empathy
    ];
    impactChart.update();
    
    updateFluxLog(input);
    document.getElementById('ai-input').value = "";

    // TRIGGER THE SECONDARY AGENT
    triggerGrowthAgent(stats);
}

/**
 * 5. Agentic Layer: Proactive Growth Strategist
 * Analyzes current profile gaps to provide actionable advice.
 */
async function triggerGrowthAgent(currentStats) {
    const status = document.getElementById('status-text');
    status.innerText = "AGENT: ANALYZING PROFILE EQUILIBRIUM...";

    const agentPrompt = `You are a Growth Strategist Agent. Current stats: ${JSON.stringify(currentStats)}. 
    Identify the weakest vector and suggest ONE highly specific, 
    actionable 'Evolution Task' for today. Format: {"vector": "Empathy", "task": "Mentor a peer for 30 mins"}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: agentPrompt }] }] })
        });
        
        const data = await response.json();
        const rawResponse = data.candidates[0].content.parts[0].text;
        const agentAdvice = JSON.parse(rawResponse.match(/\{.*\}/s)[0]);

        showAgentDirective(agentAdvice);
        
    } catch (e) {
        // Heuristic fallback if API fails
        const vectors = Object.keys(currentStats);
        const weakest = vectors.reduce((a, b) => currentStats[a] < currentStats[b] ? a : b);
        showAgentDirective({vector: weakest, task: `Initiate a 15-minute high-focus session in ${weakest} to restore balance.`});
    }
}

/**
 * UI Helper for Agent Directive
 */
function showAgentDirective(advice) {
    const box = document.getElementById('agent-box');
    const vectorSpan = document.getElementById('agent-vector');
    const taskP = document.getElementById('agent-task');

    if(box) {
        box.classList.remove('hidden');
        vectorSpan.innerText = advice.vector.toUpperCase();
        taskP.innerText = `"${advice.task}"`;
    }
}

/**
 * UI Helper: Updates the Flux Log
 */
function updateFluxLog(input) {
    const logList = document.getElementById('log-list');
    const entry = document.createElement('li');
    const shortText = input.length > 30 ? input.substring(0, 30) + "..." : input;
    
    entry.className = "border-l-2 border-cyan-500 pl-3 py-1 text-[11px] mb-2 bg-white/5";
    entry.innerHTML = `<span class="text-fuchsia-400 font-bold">[FLUX_LOG]</span> <span class="text-white opacity-80">${shortText} processed.</span>`;
    
    logList.prepend(entry);
    if (logList.children.length > 5) logList.removeChild(logList.lastChild);
}