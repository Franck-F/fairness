import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    with open("models_debug.txt", "w") as f:
        f.write("❌ GEMINI_API_KEY not found")
else:
    genai.configure(api_key=api_key)
    try:
        print(f"Testing generation with models/gemini-2.0-flash...")
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Hello")
        print(f"Test Response: {response.text}")
        print("✅ Generation successful!")
    except Exception as e:
        print(f"❌ Error during generation test: {e}")

    try:
        models = []
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                models.append(m.name)
        with open("models_debug.txt", "w") as f:
            f.write(f"SDK Version: {genai.__version__}\n")
            f.write("\n".join(models))
        print("✅ Models saved to models_debug.txt")
    except Exception as e:
        with open("models_debug.txt", "w") as f:
            f.write(f"❌ Error listing models: {e}")
