import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "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";
const PROJECT_ID = "proj_70VulXoamT5tAtb0tSV80nS6";

app.post("/gpt", async (req, res) => {
  console.log("📥 Anfrage erhalten:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "OpenAI-Project": PROJECT_ID
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    console.log("📤 Antwort von OpenAI:");
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.log("❌ Fehlercode:", response.status);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Proxy Exception:", err.message);
    res.status(500).json({ error: "Proxy crashed", detail: err.message });
  }
});

app.listen(4000, () => {
  console.log("🚀 GPT Proxy läuft unter: http://localhost:4000/gpt");
});
