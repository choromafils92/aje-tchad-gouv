-- Créer le bucket actualites-media s'il n'existe pas et le rendre public
-- Ce script doit être exécuté une seule fois

-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('actualites-media', 'actualites-media', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Créer les politiques RLS pour le bucket
-- Permettre à tout le monde de lire les fichiers
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'actualites-media');

-- Permettre aux admins de télécharger des fichiers
CREATE POLICY IF NOT EXISTS "Admins can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'actualites-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Permettre aux admins de supprimer des fichiers
CREATE POLICY IF NOT EXISTS "Admins can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'actualites-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Permettre aux admins de mettre à jour des fichiers
CREATE POLICY IF NOT EXISTS "Admins can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'actualites-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'actualites-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);
