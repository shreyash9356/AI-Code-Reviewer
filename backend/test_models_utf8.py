import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

with open('output_models_utf8.txt', 'w', encoding='utf-8') as f:
    try:
        models = genai.list_models()
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                f.write(m.name + '\n')
    except Exception as e:
        f.write(f"Error: {e}\n")
