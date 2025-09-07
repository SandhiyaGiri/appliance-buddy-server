-- Simple RLS enablement for development
-- This allows all operations on all tables for development purposes

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linked_documents ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (allows all operations)
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on appliances" ON public.appliances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on support_contacts" ON public.support_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on maintenance_tasks" ON public.maintenance_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on linked_documents" ON public.linked_documents FOR ALL USING (true) WITH CHECK (true);