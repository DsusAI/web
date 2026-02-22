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
                response_format: { type: "json_object" }, 
                messages: [
                    {
                        role: "system",
                        content: `You are an elite AI Language Expert and Executive Assistant for 'Vishwakarma Cyber Technologies'. You have TWO main jobs based on what the user types:

JOB 1 (Vocabulary/Synonyms): If the user types just a single word or a very short phrase (e.g., "teacher", "good", "happy"), you must provide 3 highly professional, advanced, or impressive alternative words/synonyms for it.

JOB 2 (Message Drafting): If the user types a sentence or asks you to write/draft a message (e.g., "draft a msg to my clint", "hii im founed of xyz"), act as an expert copywriter. CRITICAL: The user will make spelling mistakes (e.g., 'founed' -> 'founder', 'clint' -> 'client', 'mag' -> 'message'). IGNORE the typos, figure out their true intent, and write 3 highly professional, ready-to-send messages. Add emojis only if requested.

STRICT RULE: You MUST ALWAYS output ONLY a valid JSON object. No conversational text.
Format:
{
  "option1": "...",
  "option2": "...",
  "option3": "..."
}`
                    },
                    {
                        role: "user",
                        content: `Input: "${userInput}"\n\nProvide the 3 options in the exact JSON format requested.`
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
