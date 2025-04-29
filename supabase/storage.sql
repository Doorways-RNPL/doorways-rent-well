
-- Create a storage bucket for tenant documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant_documents', 'tenant_documents', false);

-- Add RLS policies for tenant_documents bucket
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'tenant_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'tenant_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'tenant_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'tenant_documents' AND auth.uid()::text = (storage.foldername(name))[1]);
