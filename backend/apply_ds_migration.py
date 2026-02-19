import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def run_migration():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL not found in environment")
        return

    # SUPABASE_URL: https://qpgwotsodziznwigpjey.supabase.co
    project_ref = "qpgwotsodziznwigpjey"
    user = f"postgres.{project_ref}"
    password = "postgresql@2025" # From .env
    host = f"db.{project_ref}.supabase.co"
    port = 5432
    dbname = "postgres"
    
    try:
        print(f"Connecting to {host}...")
        conn = await asyncpg.connect(
            user=user,
            password=password,
            host=host,
            port=port,
            database=dbname
        )
        print("Connected to Supabase PostgreSQL")

        migration_sql = """
        -- Dedicated table for Data Science Projects
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

        -- RLS Policies
        ALTER TABLE public.ds_projects ENABLE ROW LEVEL SECURITY;

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

        -- Updated_at trigger
        DROP TRIGGER IF EXISTS set_updated_at ON public.ds_projects;
        CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ds_projects
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
        """

        await conn.execute(migration_sql)
        print("Migration applied successfully: ds_projects table created.")
        await conn.close()

    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    asyncio.run(run_migration())
