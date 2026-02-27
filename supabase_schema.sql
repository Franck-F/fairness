-- AuditIQ Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor
-- Version 2.0 - Enhanced with indexes, constraints, soft-delete, and full-text search

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- TABLES
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'enterprise')),
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Datasets table
CREATE TABLE IF NOT EXISTS public.datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER CHECK (file_size > 0),
    rows_count INTEGER CHECK (rows_count >= 0),
    columns_count INTEGER CHECK (columns_count > 0),
    column_names JSONB,
    column_types JSONB,
    has_predictions BOOLEAN DEFAULT FALSE,
    prediction_column TEXT,
    probability_column TEXT,
    model_type TEXT,
    model_algorithm TEXT,
    model_metrics JSONB,
    missing_values_analysis JSONB,
    fastapi_dataset_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Audits table
CREATE TABLE IF NOT EXISTS public.audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
    audit_name TEXT NOT NULL,
    use_case TEXT,
    target_column TEXT,
    sensitive_attributes JSONB,
    fairness_metrics JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    overall_score NUMERIC CHECK (overall_score >= 0 AND overall_score <= 100),
    risk_level TEXT CHECK (risk_level IS NULL OR risk_level IN ('Low', 'Medium', 'High')),
    bias_detected BOOLEAN DEFAULT FALSE,
    critical_bias_count INTEGER DEFAULT 0 CHECK (critical_bias_count >= 0),
    metrics_results JSONB,
    recommendations JSONB,
    llm_insights JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    report_name TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('pdf', 'txt', 'csv')),
    file_path TEXT,
    file_size INTEGER CHECK (file_size IS NULL OR file_size > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'auditor' CHECK (role IN ('admin', 'auditor', 'viewer')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'deactivated')),
    invited_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (organization_id, email)
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'auditor' CHECK (role IN ('admin', 'auditor', 'viewer')),
    invite_token TEXT UNIQUE NOT NULL,
    invited_by UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Science Projects table
CREATE TABLE IF NOT EXISTS public.ds_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE SET NULL,
    project_name TEXT NOT NULL,
    target_column TEXT,
    problem_type TEXT CHECK (problem_type IS NULL OR problem_type IN ('Classification', 'Regression', 'Time Series', 'Clustering', 'General')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'eda_completed', 'modeled', 'interpreted', 'archived')),
    intelligence_suggestions JSONB,
    eda_results JSONB,
    modeling_results JSONB,
    interpretability_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Single-column indexes
CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON public.datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON public.audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_dataset_id ON public.audits(dataset_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON public.audits(status);
CREATE INDEX IF NOT EXISTS idx_reports_audit_id ON public.reports(audit_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_org_id ON public.team_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_org_id ON public.team_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON public.team_invitations(invite_token);
CREATE INDEX IF NOT EXISTS idx_ds_projects_user_id ON public.ds_projects(user_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_datasets_user_created ON public.datasets(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_user_created ON public.audits(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_user_status ON public.audits(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reports_user_created ON public.reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ds_projects_user_created ON public.ds_projects(user_id, created_at DESC);

-- Soft-delete partial indexes (exclude deleted records from common queries)
CREATE INDEX IF NOT EXISTS idx_datasets_active ON public.datasets(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audits_active ON public.audits(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ds_projects_active ON public.ds_projects(user_id, created_at DESC) WHERE deleted_at IS NULL;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_audits_name_trgm ON public.audits USING gin(audit_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_datasets_filename_trgm ON public.datasets USING gin(filename gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ds_projects_name_trgm ON public.ds_projects USING gin(project_name gin_trgm_ops);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ds_projects ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Datasets policies
CREATE POLICY "Users can view own datasets" ON public.datasets
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own datasets" ON public.datasets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own datasets" ON public.datasets
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own datasets" ON public.datasets
    FOR DELETE USING (auth.uid() = user_id);

-- Audits policies
CREATE POLICY "Users can view own audits" ON public.audits
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own audits" ON public.audits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audits" ON public.audits
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own audits" ON public.audits
    FOR DELETE USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can view own reports" ON public.reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON public.reports
    FOR DELETE USING (auth.uid() = user_id);

-- Team members policies
CREATE POLICY "Users can view own team members" ON public.team_members
    FOR SELECT USING (auth.uid() = organization_id);

CREATE POLICY "Users can invite team members" ON public.team_members
    FOR INSERT WITH CHECK (auth.uid() = organization_id);

CREATE POLICY "Users can update own team members" ON public.team_members
    FOR UPDATE USING (auth.uid() = organization_id)
    WITH CHECK (auth.uid() = organization_id);

CREATE POLICY "Users can delete own team invitations" ON public.team_members
    FOR DELETE USING (auth.uid() = organization_id);

-- Team invitations policies
CREATE POLICY "Users can view own team invitations" ON public.team_invitations
    FOR SELECT USING (auth.uid() = organization_id);

CREATE POLICY "Users can create team invitations" ON public.team_invitations
    FOR INSERT WITH CHECK (auth.uid() = organization_id);

CREATE POLICY "Users can delete own team invitations" ON public.team_invitations
    FOR DELETE USING (auth.uid() = organization_id);

-- DS Projects policies
CREATE POLICY "Users can view own ds projects" ON public.ds_projects
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own ds projects" ON public.ds_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ds projects" ON public.ds_projects
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ds projects" ON public.ds_projects
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.users;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.datasets;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.datasets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.audits;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.audits
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.ds_projects;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ds_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('datasets', 'datasets', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for datasets bucket
CREATE POLICY "Users can upload own datasets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'datasets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own datasets" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'datasets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own datasets" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'datasets' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for reports bucket
CREATE POLICY "Users can upload own reports" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'reports' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own reports" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'reports' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own reports" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'reports' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
