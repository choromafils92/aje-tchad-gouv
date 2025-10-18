-- ====================================
-- SCRIPT SQL: Création des buckets storage
-- À EXÉCUTER dans Supabase SQL Editor
-- ====================================

-- Create storage bucket for documents files
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents-files', 'documents-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for textes juridiques files
INSERT INTO storage.buckets (id, name, public)
VALUES ('textes-juridiques-files', 'textes-juridiques-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for documents files
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view documents files'
  ) THEN
    CREATE POLICY "Anyone can view documents files"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'documents-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload documents files'
  ) THEN
    CREATE POLICY "Admins can upload documents files"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'documents-files' AND
        has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete documents files'
  ) THEN
    CREATE POLICY "Admins can delete documents files"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'documents-files' AND
        has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;
END $$;

-- Storage RLS policies for textes juridiques files
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view textes juridiques files'
  ) THEN
    CREATE POLICY "Anyone can view textes juridiques files"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'textes-juridiques-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload textes juridiques files'
  ) THEN
    CREATE POLICY "Admins can upload textes juridiques files"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'textes-juridiques-files' AND
        has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete textes juridiques files'
  ) THEN
    CREATE POLICY "Admins can delete textes juridiques files"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'textes-juridiques-files' AND
        has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;
END $$;
