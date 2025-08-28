import axios from "axios";

// URL du microservice Python
const AI_CORE_URL = process.env.AI_CORE_URL || "http://localhost:8000";

export const cleanData = async (req, res) => {
  try {
    const { rawText } = req.body;
    const response = await axios.post(`${AI_CORE_URL}/clean`, { text: rawText });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "AI cleaning failed", details: error.message });
  }
};

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(`${AI_CORE_URL}/summarize`, { text });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "AI summarization failed", details: error.message });
  }
};
