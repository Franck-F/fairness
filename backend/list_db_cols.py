import httpx
import os
from dotenv import load_dotenv

load_dotenv()

url = f"{os.environ.get('NEXT_PUBLIC_SUPABASE_URL')}/rest/v1/"
headers = {
    "apikey": os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    "Authorization": f"Bearer {os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')}"
}

def list_cols():
    try:
        # Get OpenAPI spec again but carefully print all columns
        response = httpx.get(url, headers=headers)
        if response.status_code == 200:
            spec = response.json()
            audits_def = spec.get("definitions", {}).get("audits", {})
            properties = audits_def.get("properties", {})
            
            print("Current columns in 'audits' (according to API):")
            for col in sorted(properties.keys()):
                print(f" - {col}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    list_cols()
