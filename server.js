import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// क्लाइंट्स को public फोल्डर की वेबसाइट दिखाना
app.use(express.static(path.join(__dirname, "public")));

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
                // यह लाइन AI को मजबूर करेगी कि वह हमेशा सिर्फ JSON ही दे, कभी क्रैश न हो!
                response_format: { type: "json_object" }, 
                messages: [
                    {
                        role: "system",
                        content: `You are an elite AI Copywriter for Vishwakarma Cyber Technologies. Your ONLY job is to write professional messages for clients.

CRITICAL RULES:
1. Users make spelling mistakes (e.g., 'mag' means 'message', 'clinte' means 'client'). Ignore typos, understand the intent, and write the professional message they actually meant.
2. If the user just says "hi", "hello", or introduces themselves (e.g. "hii im yash"), give 3 professional greeting variations.
3. YOU MUST OUTPUT ONLY VALID JSON. No conversational text.

JSON Format must be exactly:
{
  "option1": "Text...",
  "option2": "Text...",
  "option3": "Text..."
}`
                    },
                    {
                        role: "user",
                        content: `Write 3 professional message variations for this request: "${userInput}"`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
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
