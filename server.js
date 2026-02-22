import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ES Modules सेटअप
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// क्लाइंट्स को public फोल्डर की वेबसाइट दिखाना
app.use(express.static(path.join(__dirname, "public")));

// Render क्लाउड सर्वर से API Key लेना
const API_KEY = process.env.GROQ_API_KEY;

app.post("/generate", async (req, res) => {
    try {
        const userInput = req.body.message;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: `Write 3 professional variations of this message:\n\n"${userInput}"\n\nReturn ONLY valid JSON:\n{\n  "option1": "...",\n  "option2": "...",\n  "option3": "..."\n}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 400
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error connecting to Groq" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DSUS AI Live on port ${PORT}`));