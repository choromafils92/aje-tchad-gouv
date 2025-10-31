-- Script pour vérifier et configurer le bucket actualites-media
-- Exécutez ce script pour résoudre les problèmes d'upload de vidéos

-- 1. Vérifier si le bucket existe
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'actualites-media';

-- 2. Créer ou mettre à jour le bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'actualites-media', 
  'actualites-media', 
  true,
  52428800, -- 50MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'application/pdf'];

-- 3. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public Access actualites media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload actualites files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete actualites files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update actualites files" ON storage.objects;

-- 4. Créer les politiques RLS pour le bucket
-- Permettre à tout le monde de lire les fichiers
CREATE POLICY "Public Access actualites media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'actualites-media');

-- Permettre aux utilisateurs authentifiés de télécharger des fichiers
CREATE POLICY "Admins can upload actualites files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'actualites-media');

-- Permettre aux utilisateurs authentifiés de supprimer leurs fichiers
CREATE POLICY "Admins can delete actualites files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'actualites-media');

-- Permettre aux utilisateurs authentifiés de mettre à jour leurs fichiers
CREATE POLICY "Admins can update actualites files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'actualites-media')
WITH CHECK (bucket_id = 'actualites-media');

-- 5. Vérifier les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%actualites%';

-- 6. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Configuration du bucket actualites-media terminée avec succès!';
  RAISE NOTICE 'Vous pouvez maintenant uploader des vidéos jusqu''à 50MB.';
END $$;
