-- =====================================================
-- MIGRATION COMPLÈTE POUR L'AJE TCHAD
-- À exécuter dans le SQL Editor de Supabase
-- =====================================================

-- 1. Créer la table site_settings pour le contenu dynamique
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Activer RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour site_settings
DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;
CREATE POLICY "Anyone can view settings"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Insérer les données par défaut
INSERT INTO public.site_settings (key, value, category, label, description) VALUES
  ('director_name', '"MAHAMAT TADJADINE"', 'director', 'Nom du Directeur', 'Nom complet du directeur'),
  ('director_title', '"Agent Judiciaire de l''État"', 'director', 'Titre du Directeur', 'Titre officiel'),
  ('director_photo', '""', 'director', 'Photo du Directeur', 'URL de la photo'),
  ('director_message', '"L''Agence Judiciaire de l''État du Tchad s''engage résolument dans sa mission de défense des intérêts de notre nation avec la plus grande rigueur et le plus haut niveau de professionnalisme.\n\nDepuis notre création, nous œuvrons sans relâche pour garantir que l''État du Tchad soit représenté avec excellence dans toutes les procédures juridiques, tout en accompagnant nos administrations publiques par des conseils juridiques de qualité.\n\nNotre équipe de juristes expérimentés met son expertise au service de la protection du patrimoine public et de la défense de la souveraineté nationale. Nous restons déterminés à servir notre pays avec Conseiller-Défendre-Protéger.\n\nEnsemble, construisons un système juridique fort au service du développement du Tchad."', 'director', 'Message du Directeur', 'Message officiel du directeur'),
  
  ('services_intro', '"L''AJE met à disposition des administrations une gamme complète de services juridiques pour sécuriser leur action et prévenir les contentieux."', 'services', 'Introduction Services', 'Texte d''introduction des services'),
  
  ('contact_address', '"Avenue Félix Éboué, Quartier administratif\nN''Djamena, République du Tchad"', 'contact', 'Adresse', 'Adresse postale complète'),
  ('contact_phone', '"+235 22 XX XX XX"', 'contact', 'Téléphone', 'Numéro de téléphone'),
  ('contact_email', '"contact@aje.td"', 'contact', 'Email', 'Adresse email de contact'),
  ('contact_hours', '"Lundi au Jeudi : 7h30 - 15h30\nVendredi : 7h30 - 12h30\nWeekend : Fermé"', 'contact', 'Horaires', 'Horaires d''ouverture'),
  
  ('subdirections', '[
    {
      "name": "Agent judiciaire de l''État",
      "email": "aje@aje.td",
      "phone": "+235 22 XX XX XX"
    },
    {
      "name": "Sous-Direction du Contentieux",
      "email": "contentieux@aje.td",
      "phone": "+235 22 XX XX XX"
    },
    {
      "name": "Sous-Direction du Conseil Juridique",
      "email": "conseil@aje.td",
      "phone": "+235 22 XX XX XX"
    }
  ]', 'contact', 'Sous-Directions', 'Liste des sous-directions et leurs contacts'),
  
  ('contentieux_domains', '[
    "Droit administratif général",
    "Contentieux contractuel",
    "Responsabilité de l''État",
    "Droit du travail public",
    "Contentieux fiscal",
    "Droit domanial et foncier"
  ]', 'contentieux', 'Domaines de Contentieux', 'Liste des domaines de contentieux')
ON CONFLICT (key) DO NOTHING;

-- 3. Créer le bucket pour les photos du directeur
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'director-photos',
  'director-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS pour director-photos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view director photos'
  ) THEN
    CREATE POLICY "Anyone can view director photos"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'director-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload director photos'
  ) THEN
    CREATE POLICY "Admins can upload director photos"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'director-photos' AND
        public.has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete director photos'
  ) THEN
    CREATE POLICY "Admins can delete director photos"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'director-photos' AND
        public.has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;
END $$;

-- 4. Créer les buckets pour documents et textes juridiques
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'documents-files',
    'documents-files',
    true,
    52428800,
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  ),
  (
    'textes-juridiques-files',
    'textes-juridiques-files',
    true,
    52428800,
    ARRAY['application/pdf']
  )
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS pour documents-files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view documents'
  ) THEN
    CREATE POLICY "Anyone can view documents"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'documents-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload documents'
  ) THEN
    CREATE POLICY "Admins can upload documents"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'documents-files' AND
        public.has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete documents'
  ) THEN
    CREATE POLICY "Admins can delete documents"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'documents-files' AND
        public.has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;
END $$;

-- Politiques RLS pour textes-juridiques-files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view legal texts files'
  ) THEN
    CREATE POLICY "Anyone can view legal texts files"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'textes-juridiques-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload legal texts files'
  ) THEN
    CREATE POLICY "Admins can upload legal texts files"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'textes-juridiques-files' AND
        public.has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete legal texts files'
  ) THEN
    CREATE POLICY "Admins can delete legal texts files"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'textes-juridiques-files' AND
        public.has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;
END $$;

-- 5. S'assurer que le trigger pour auto-ajouter bechirmc90@gmail.com existe
CREATE OR REPLACE FUNCTION public.auto_add_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.email = 'bechirmc90@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created_add_admin ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created_add_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_add_first_admin();

-- 6. Ajouter manuellement bechirmc90@gmail.com comme admin s'il existe déjà
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'bechirmc90@gmail.com';
  
  IF user_uuid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role added for bechirmc90@gmail.com';
  ELSE
    RAISE NOTICE 'User bechirmc90@gmail.com not found yet. Will be auto-added on next login.';
  END IF;
END $$;
