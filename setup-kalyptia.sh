#!/bin/bash

echo "🚀 Installation de Kalyptia Core AI (DeepSeek R1 + V3 + LoRA/PEFT)"

# --- Préparation environnement ---
sudo apt update && sudo apt upgrade -y
sudo apt install -y git-lfs python3 python3-pip

# Installer Git LFS
git lfs install

# --- Télécharger DeepSeek R1 ---
if [ ! -d "kalyptia-r1" ]; then
  echo "⬇️ Téléchargement de DeepSeek R1..."
  git clone https://huggingface.co/deepseek-ai/deepseek-r1
  mv deepseek-r1 kalyptia-r1
fi

# --- Télécharger DeepSeek V3 ---
if [ ! -d "kalyptia-v3" ]; then
  echo "⬇️ Téléchargement de DeepSeek V3..."
  git clone https://huggingface.co/deepseek-ai/deepseek-v3
  mv deepseek-v3 kalyptia-v3
fi

# --- Installer dépendances IA ---
pip install --upgrade pip
pip install vllm torch transformers peft accelerate datasets

# --- Préparer script LoRA/PEFT pour chaque modèle ---
for model_dir in kalyptia-r1 kalyptia-v3; do
  echo "⚙️ Configuration LoRA/PEFT pour $model_dir..."
  cat << 'EOF' > $model_dir/init_lora.py
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model

print("🚀 Initialisation LoRA/PEFT pour le modèle...")

model_name = "./"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Config LoRA (lightweight, gratuit, adapté à ton serveur)
peft_config = LoraConfig(
    task_type="CAUSAL_LM",
    r=8,
    lora_alpha=16,
    lora_dropout=0.1
)

model = get_peft_model(model, peft_config)
print("✅ Modèle prêt avec LoRA/PEFT (spécialisable).")
EOF
done

# --- Lancer le serveur API (par défaut sur DeepSeek V3) ---
echo "🚀 Lancement de l'API vLLM sur le port 8000 avec Kalyptia-V3..."
cd kalyptia-v3
python3 -m vllm.entrypoints.api_server \
  --model ./ \
  --host 0.0.0.0 \
  --port 8000
