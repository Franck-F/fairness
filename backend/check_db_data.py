import httpx
import os
from dotenv import load_dotenv

load_dotenv()

url = f"{os.environ.get('NEXT_PUBLIC_SUPABASE_URL')}/rest/v1/audits"
headers = {
    "apikey": os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    "Authorization": f"Bearer {os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')}",
    "Range": "0-0"
}

def check_data():
    try:
        # Try to select the specific columns
        params = {
            "select": "id,status,overall_score,llm_insights,error_message",
            "limit": 1
        }
        response = httpx.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            print("✅ Successfully queried audits table.")
            if data:
                print("Columns received in data:")
                for k in data[0].keys():
                    print(f" - {k}")
            else:
                print("No audits found to check.")
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    check_data()
