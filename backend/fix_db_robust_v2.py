import asyncio
import os
import asyncpg
from dotenv import load_dotenv
from urllib.parse import unquote, urlparse

async def fix():
    load_dotenv()
    raw_url = os.environ.get("DATABASE_URL")
    if not raw_url:
        print("❌ DATABASE_URL not found!")
        return
        
    # Clean up the URL for asyncpg
    if raw_url.startswith("postgresql+asyncpg://"):
        raw_url = raw_url.replace("postgresql+asyncpg://", "postgresql://")
    
    # Manually decode the password if needed
    parsed = urlparse(raw_url)
    user = parsed.username
    password = unquote(parsed.password) if parsed.password else None
    host = parsed.hostname
    port = parsed.port
    database = parsed.path.lstrip('/')
    
    print(f"🔗 Connecting to {host}:{port}/{database} as {user}...")
    try:
        conn = await asyncpg.connect(
            user=user,
            password=password,
            host=host,
            port=port,
            database=database
        )
        print("✅ Connected!")
        
        print("🛠️ Adding llm_insights...")
        try:
            await conn.execute("ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS llm_insights JSONB;")
            print("✅ llm_insights added.")
        except Exception as e:
            print(f"❌ Error adding llm_insights: {e}")
            
        print("🛠️ Adding error_message...")
        try:
            await conn.execute("ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS error_message TEXT;")
            print("✅ error_message added.")
        except Exception as e:
            print(f"❌ Error adding error_message: {e}")
            
        await conn.close()
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    asyncio.run(fix())
