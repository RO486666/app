import express from "express";
import cors from "cors";
import { ChatOpenAI } from "@langchain/openai"; // GPT4o / 4 nutzen
import { RunnableSequence } from "@langchain/core/runnables";

const app = express();
app.use(cors());
app.use(express.json());

const chat = new ChatOpenAI({
  temperature: 0.3,
  modelName: "gpt-4o", // oder gpt-4-turbo
  apiKey: "DEIN_API_KEY"
});

const systemPrompt = `
Du bekommst rohen Text von Screenshots aus Trading-Plattformen (cTrader, MetaTrader, TradingView).
Extrahiere daraus nur folgende Infos:
- Symbol (z.B. XAUUSD, NZDUSD)
- Richtung (Long oder Short)
- Einstieg (Einstiegspreis)
- Lotgröße (Volumen, Menge)

Antworte **nur** als JSON-Objekt mit diesen Keys: symbol, direction, entry, lot. Kein Fließtext.
`;

app.post("/gpt-analyse", async (req, res) => {
  const rawText = req.body.rawText || "";

  const result = await chat.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: rawText }
  ]);

  try {
    const json = JSON.parse(result.content);
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "❌ JSON-Parsing fehlgeschlagen", raw: result.content });
  }
});

app.listen(3069, () => console.log("✅ GPT-Analyse läuft auf http://localhost:3069"));
