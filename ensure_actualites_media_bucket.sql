-- Créer le bucket actualites-media s'il n'existe pas et le rendre public
-- Ce script doit être exécuté une seule fois

-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('actualites-media', 'actualites-media', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public Access actualites media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload actualites files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete actualites files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update actualites files" ON storage.objects;

-- Créer les politiques RLS pour le bucket
-- Permettre à tout le monde de lire les fichiers
CREATE POLICY "Public Access actualites media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'actualites-media');

-- Permettre aux admins authentifiés de télécharger des fichiers
CREATE POLICY "Admins can upload actualites files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'actualites-media');

-- Permettre aux admins authentifiés de supprimer des fichiers
CREATE POLICY "Admins can delete actualites files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'actualites-media');

-- Permettre aux admins authentifiés de mettre à jour des fichiers
CREATE POLICY "Admins can update actualites files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'actualites-media')
WITH CHECK (bucket_id = 'actualites-media');
