// 🔐 Paste your NEW Groq API key inside quotes below
const API_KEY = "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";

// 🔁 Main Function
async function generateResponses() {
    const input = document.getElementById('userPrompt').value.trim();
    const btn = document.getElementById('generateBtn');
    const loader = document.getElementById('loadingBar'); // <--- Get Loader

    if (!input) {
        alert("Please enter a message!");
        return;
    }

    // 1. Show Loading
    btn.innerText = "Processing...";
    btn.disabled = true;
    loader.style.display = "block"; // <--- Show Bar
    
    // Clear old text
    document.getElementById('resp1').innerText = "Generating...";
    document.getElementById('resp2').innerText = "Generating...";
    document.getElementById('resp3').innerText = "Generating...";

    const prompt = `
    Write 3 professional variations of the following message:
    "${input}"
    Return ONLY valid JSON in this format:
    { "option1": "...", "option2": "...", "option3": "..." }
    Do not include markdown or explanations.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error("Invalid API response");
        }

        const rawText = data.choices[0].message.content;

        const cleanJson = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const responses = JSON.parse(cleanJson);

        document.getElementById('resp1').innerText = responses.option1 || "No response";
        document.getElementById('resp2').innerText = responses.option2 || "No response";
        document.getElementById('resp3').innerText = responses.option3 || "No response";

    } catch (error) {
        console.error("FULL ERROR:", error);
        document.getElementById('resp1').innerText = "Error connecting to DSUS AI.";
        document.getElementById('resp2').innerText = "";
        document.getElementById('resp3').innerText = "";
    } finally {
        // 2. Hide Loading (Always runs)
        btn.innerText = "Generate";
        btn.disabled = false;
        loader.style.display = "none"; // <--- Hide Bar
    }
}

// 📋 Copy Function
function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text)
        .then(() => alert("Copied to clipboard!"))
        .catch(() => alert("Copy failed."));
}