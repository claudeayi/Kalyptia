from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import re

app = FastAPI()

# Chargeurs IA
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class TextRequest(BaseModel):
    text: str

@app.post("/clean")
def clean_text(data: TextRequest):
    text = data.text
    # Exemple simple : supprimer les caractères spéciaux et espaces multiples
    cleaned = re.sub(r'\s+', ' ', re.sub(r'[^a-zA-Z0-9À-ÿ .,!?]', '', text)).strip()
    return {"original": text, "cleaned": cleaned}

@app.post("/summarize")
def summarize(data: TextRequest):
    text = data.text
    summary = summarizer(text, max_length=80, min_length=20, do_sample=False)
    return {"summary": summary[0]["summary_text"]}
