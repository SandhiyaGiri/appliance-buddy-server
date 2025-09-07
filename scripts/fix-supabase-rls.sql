-- Fix Supabase RLS (Row Level Security) Configuration
-- Run this script in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linked_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (true);

-- Create policies for appliances table
CREATE POLICY "Users can view all appliances" ON public.appliances
    FOR SELECT USING (true);

CREATE POLICY "Users can insert appliances" ON public.appliances
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update appliances" ON public.appliances
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete appliances" ON public.appliances
    FOR DELETE USING (true);

-- Create policies for support_contacts table
CREATE POLICY "Users can view all support contacts" ON public.support_contacts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert support contacts" ON public.support_contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update support contacts" ON public.support_contacts
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete support contacts" ON public.support_contacts
    FOR DELETE USING (true);

-- Create policies for maintenance_tasks table
CREATE POLICY "Users can view all maintenance tasks" ON public.maintenance_tasks
    FOR SELECT USING (true);

CREATE POLICY "Users can insert maintenance tasks" ON public.maintenance_tasks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update maintenance tasks" ON public.maintenance_tasks
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete maintenance tasks" ON public.maintenance_tasks
    FOR DELETE USING (true);

-- Create policies for linked_documents table
CREATE POLICY "Users can view all linked documents" ON public.linked_documents
    FOR SELECT USING (true);

CREATE POLICY "Users can insert linked documents" ON public.linked_documents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update linked documents" ON public.linked_documents
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete linked documents" ON public.linked_documents
    FOR DELETE USING (true);

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.appliances TO authenticated;
GRANT ALL ON public.support_contacts TO authenticated;
GRANT ALL ON public.maintenance_tasks TO authenticated;
GRANT ALL ON public.linked_documents TO authenticated;

-- Grant permissions to anon users (for development)
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.appliances TO anon;
GRANT ALL ON public.support_contacts TO anon;
GRANT ALL ON public.maintenance_tasks TO anon;
GRANT ALL ON public.linked_documents TO anon;