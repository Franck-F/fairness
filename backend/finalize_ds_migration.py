import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Load from the parent directory where .env is located
load_dotenv(dotenv_path="../.env")

async def run_final_migration():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL not found in environment")
        return

    print(f"Connecting to database using SQLAlchemy...")
    
    # Ensure the URL is in the correct format for SQLAlchemy + asyncpg
    if database_url.startswith("postgresql://"):
        engine_url = database_url.replace("postgresql://", "postgresql+asyncpg://")
    else:
        engine_url = database_url

    try:
        # Create engine
        engine = create_async_engine(engine_url)
        
        migration_sql = """
        -- Create ds_projects table if not exists
        CREATE TABLE IF NOT EXISTS public.ds_projects (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
            project_name TEXT NOT NULL,
            target_column TEXT,
            problem_type TEXT,
            eda_results JSONB,
            modeling_results JSONB,
            interpretability_results JSONB,
            status TEXT DEFAULT 'pending',
            intelligence_suggestions JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE public.ds_projects ENABLE ROW LEVEL SECURITY;

        -- Create RLS Policies (using IF NOT EXISTS logic via DO block)
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ds_projects' AND policyname = 'Users can view own ds_projects') THEN
                CREATE POLICY "Users can view own ds_projects" ON public.ds_projects FOR SELECT USING (auth.uid() = user_id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ds_projects' AND policyname = 'Users can insert own ds_projects') THEN
                CREATE POLICY "Users can insert own ds_projects" ON public.ds_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ds_projects' AND policyname = 'Users can update own ds_projects') THEN
                CREATE POLICY "Users can update own ds_projects" ON public.ds_projects FOR UPDATE USING (auth.uid() = user_id);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ds_projects' AND policyname = 'Users can delete own ds_projects') THEN
                CREATE POLICY "Users can delete own ds_projects" ON public.ds_projects FOR DELETE USING (auth.uid() = user_id);
            END IF;
        END $$;

        -- Updated_at trigger (handle_updated_at function is assumed to exist from supabase_schema.sql)
        DROP TRIGGER IF EXISTS set_updated_at ON public.ds_projects;
        CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ds_projects
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        """

        async with engine.begin() as conn:
            await conn.execute(text(migration_sql))
            print("Successfully executed DDL for ds_projects table.")
        
        await engine.dispose()
        print("Migration complete and engine disposed.")

    except Exception as e:
        print(f"Migration failed with error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_final_migration())
