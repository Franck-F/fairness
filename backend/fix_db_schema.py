import asyncio
import os
import sys
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def fix_schema():
    # Load .env from parent directory if needed
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))
    
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL not found in .env")
        return

    print(f"🔗 Connecting to database...")
    try:
        # engine should be created with the URL from .env (already has +asyncpg)
        engine = create_async_engine(db_url)
        
        async with engine.begin() as conn:
            print("🛠️ Adding missing column: llm_insights (JSONB)...")
            await conn.execute(text("ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS llm_insights JSONB;"))
            
            print("🛠️ Adding missing column: error_message (TEXT)...")
            await conn.execute(text("ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS error_message TEXT;"))
            
            print("✅ Columns added or verified successfully!")
        
        await engine.dispose()
    except Exception as e:
        print(f"❌ Error during schema update: {e}")

if __name__ == "__main__":
    asyncio.run(fix_schema())
