import { Router } from "express";
import { sendMessage, processAudio } from "../services/gemini.js";

export const chatRouter = Router();

chatRouter.post("/chat", async (req, res, next) => {
  try {
    const { message, session_id = "default" } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const result = await sendMessage(session_id, message);
    res.json({
      response: result.response,
      session_id,
      structured_data: result.structuredData || undefined,
    });
  } catch (err) {
    next(err);
  }
});

chatRouter.post("/voice", async (req, res, next) => {
  try {
    const { audio_base64, session_id = "default" } = req.body;
    if (!audio_base64) {
      res.status(400).json({ error: "audio_base64 is required" });
      return;
    }

    const result = await processAudio(session_id, audio_base64);
    res.json({
      transcribed_text: result.transcribed,
      response: result.response,
      session_id,
      structured_data: result.structuredData || undefined,
    });
  } catch (err) {
    next(err);
  }
});
