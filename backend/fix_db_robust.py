import asyncio
import os
import asyncpg
from dotenv import load_dotenv

async def fix():
    load_dotenv()
    # Remove the sqlalchemy prefix if present
    db_url = os.environ.get("DATABASE_URL").replace("postgresql+asyncpg://", "postgresql://")
    
    print(f"🔗 Connecting to DB...")
    try:
        conn = await asyncpg.connect(db_url)
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
