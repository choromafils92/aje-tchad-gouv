-- =====================================================
-- SCRIPT CONSOLIDÉ - VERSION CORRIGÉE
-- Supprime les politiques existantes avant de les recréer
-- Copier/coller dans l'éditeur SQL Supabase et exécuter
-- =====================================================

-- =====================================================
-- 1. FIX FUNCTION SEARCH PATH (SÉCURITÉ CRITIQUE)
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_drafts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM brouillons_avis
  WHERE user_id IS NULL 
    AND session_id IS NOT NULL 
    AND expires_at < now();
END;
$$;

-- =====================================================
-- 2. FIX KV_STORE RLS POLICIES (SÉCURITÉ CRITIQUE)
-- =====================================================

-- Supprimer TOUTES les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admins can manage kv_store" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Deny unauthenticated access" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can read" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can insert" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can update" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can delete" ON kv_store_e892ec19;

-- Créer les nouvelles politiques
CREATE POLICY "Deny unauthenticated access"
ON kv_store_e892ec19
FOR ALL TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Admins can read"
ON kv_store_e892ec19
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert"
ON kv_store_e892ec19
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update"
ON kv_store_e892ec19
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete"
ON kv_store_e892ec19
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 3. CONFIGURATION MAPBOX & GPS
-- =====================================================

-- Mapbox Token (à configurer dans le back-office)
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES 
  ('mapbox_token', '""', 'hero', 'Token API Mapbox', 'Token public Mapbox pour afficher la carte interactive', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;

-- Google Place ID pour localisation précise
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES 
  ('google_place_id', '"ChIJUe9wLGdhGREREQDExZ0_5kE"', 'hero', 'Google Place ID', 'Identifiant de lieu Google pour localisation précise', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 4. GRADE DU DIRECTEUR
-- =====================================================

INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'director_grade',
  '"Conseiller à la Cour Suprême"',
  'director',
  'Grade du Directeur',
  'Grade professionnel du Directeur de l''AJE',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 5. PARAMÈTRES HERO & GPS
-- =====================================================

-- Hero Title
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'hero_title',
  '"Agence Juridique de l''État du Tchad"',
  'hero',
  'Titre Hero',
  'Titre principal affiché sur la page d''accueil',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- Hero Tagline
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'hero_tagline',
  '"Conseil Juridique de l''Administration"',
  'hero',
  'Slogan Hero',
  'Sous-titre affiché sous le titre principal',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- Hero Description
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'hero_description',
  '"Assistance juridique, conseil contentieux et représentation de l''État"',
  'hero',
  'Description Hero',
  'Description détaillée affichée sur la page d''accueil',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- GPS Latitude
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'gps_latitude',
  '12.1348',
  'hero',
  'Latitude GPS',
  'Coordonnée GPS latitude de l''AJE',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- GPS Longitude
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'gps_longitude',
  '15.0557',
  'hero',
  'Longitude GPS',
  'Coordonnée GPS longitude de l''AJE',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- Location Name
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'location_name',
  '"Agence Juridique de l''État"',
  'hero',
  'Nom du lieu',
  'Nom affiché pour la localisation',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- Location Address
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'location_address',
  '"N''Djamena, Tchad"',
  'hero',
  'Adresse',
  'Adresse complète de l''AJE',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 6. RÉSEAUX SOCIAUX
-- =====================================================

-- Facebook
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'social_facebook',
  '""',
  'social_media',
  'Facebook',
  'URL de la page Facebook officielle',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- Twitter
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'social_twitter',
  '""',
  'social_media',
  'Twitter/X',
  'URL du compte Twitter/X officiel',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- LinkedIn
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'social_linkedin',
  '""',
  'social_media',
  'LinkedIn',
  'URL de la page LinkedIn officielle',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- YouTube
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES (
  'social_youtube',
  '""',
  'social_media',
  'YouTube',
  'URL de la chaîne YouTube officielle',
  (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 7. VÉRIFICATIONS FINALES
-- =====================================================

-- Vérifier les fonctions
SELECT 
  proname as fonction,
  prosecdef as security_definer,
  proconfig as search_path_config
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('update_updated_at_column', 'cleanup_expired_drafts', 'handle_new_user', 'auto_add_first_admin', 'has_role')
ORDER BY proname;

-- Vérifier les politiques kv_store
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies 
WHERE tablename = 'kv_store_e892ec19'
ORDER BY policyname;

-- Vérifier les paramètres du site
SELECT 
  key, 
  category, 
  label,
  CASE 
    WHEN length(value::text) > 50 THEN substring(value::text, 1, 50) || '...'
    ELSE value::text
  END as value_preview
FROM public.site_settings
ORDER BY category, key;

-- =====================================================
-- ✅ SCRIPT TERMINÉ AVEC SUCCÈS
-- =====================================================

SELECT '✅ Tous les scripts ont été exécutés avec succès!' as status;
SELECT '🔒 Sécurité: Fonctions et RLS corrigés' as security_status;
SELECT '⚙️ Configuration: Paramètres initialisés' as config_status;
