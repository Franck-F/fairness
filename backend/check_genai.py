try:
    import google.genai
    print("google.genai is available")
except ImportError:
    print("google.genai is NOT available")

try:
    import google.generativeai
    print("google.generativeai is available")
    print(f"Version: {google.generativeai.__version__}")
except ImportError:
    print("google.generativeai is NOT available")
