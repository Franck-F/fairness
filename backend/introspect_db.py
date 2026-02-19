import httpx
import os
from dotenv import load_dotenv
import json

load_dotenv()

url = f"{os.environ.get('NEXT_PUBLIC_SUPABASE_URL')}/rest/v1/"
headers = {
    "apikey": os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    "Authorization": f"Bearer {os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')}"
}

def introspect():
    try:
        # PostgREST returns OpenAPI spec at the root
        response = httpx.get(url, headers=headers)
        if response.status_code == 200:
            spec = response.json()
            audits_def = spec.get("definitions", {}).get("audits", {})
            properties = audits_def.get("properties", {})
            
            print("Columns found in 'audits' table API:")
            for col in sorted(properties.keys()):
                print(f" - {col}: {properties[col].get('type')}")
                
            if "llm_insights" in properties:
                print("\n✅ 'llm_insights' column is VISIBLE to the API.")
            else:
                print("\n❌ 'llm_insights' column is MISSING from the API.")
                
            if "error_message" in properties:
                print("✅ 'error_message' column is VISIBLE to the API.")
            else:
                print("❌ 'error_message' column is MISSING from the API.")
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    introspect()
