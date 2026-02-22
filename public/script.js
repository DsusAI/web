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
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: input })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `HTTP Error ${response.status}`);
        }

        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;

        if (!rawText) throw new Error("Empty response from AI");

        // Safely parse JSON
        const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        document.getElementById('resp1').innerText = parsed.option1 || "No response generated.";
        document.getElementById('resp2').innerText = parsed.option2 || "No response generated.";
        document.getElementById('resp3').innerText = parsed.option3 || "No response generated.";

    } catch (error) {
        console.error("FULL ERROR:", error);
        // अब असली एरर दिखेगा!
        document.getElementById('resp1').innerText = "Error: " + error.message;
        document.getElementById('resp2').innerText = "Please try again or check your prompt.";
        document.getElementById('resp3').innerText = "";
    } finally {
        btn.innerText = "Generate";
        btn.disabled = false;
        loader.style.display = "none";
    }
}

function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text)
        .then(() => alert("Message Copied Successfully!"))
        .catch(() => alert("Failed to copy."));
}
