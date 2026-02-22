async function generateResponses() {
    const input = document.getElementById('userPrompt').value.trim();
    const btn = document.getElementById('generateBtn');
    const loader = document.getElementById('loadingBar');

    if (!input) {
        alert("Please enter a message!");
        return;
    }

    btn.innerText = "Processing...";
    btn.disabled = true;
    loader.style.display = "block";

    document.getElementById('resp1').innerText = "Generating...";
    document.getElementById('resp2').innerText = "Generating...";
    document.getElementById('resp3').innerText = "Generating...";

    try {
        // यह सीधे आपके लाइव क्लाउड सर्वर से बात करेगा
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: input })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;

        if (!rawText) throw new Error("Empty response from AI");

        const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        document.getElementById('resp1').innerText = parsed.option1 || "No response";
        document.getElementById('resp2').innerText = parsed.option2 || "No response";
        document.getElementById('resp3').innerText = parsed.option3 || "No response";

    } catch (error) {
        console.error("FULL ERROR:", error);
        document.getElementById('resp1').innerText = "Error: Our AI engine is currently experiencing high traffic. Please try again.";
        document.getElementById('resp2').innerText = "";
        document.getElementById('resp3').innerText = "";
    } finally {
        btn.innerText = "Generate";
        btn.disabled = false;
        loader.style.display = "none";
    }
}

function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => alert("Copied!")).catch(() => alert("Failed."));
}