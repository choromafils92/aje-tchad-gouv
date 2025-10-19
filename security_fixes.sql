-- =====================================================
-- CORRECTIONS DE SÉCURITÉ CRITIQUES
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================

-- 1. CORRIGER LES FONCTIONS (Ajouter search_path pour la sécurité)
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_add_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 2. CORRIGER demandes_avis (CRITIQUE - Exposition de données sensibles)
-- =====================================================

-- Supprimer la politique problématique
DROP POLICY IF EXISTS "Users can create requests" ON public.demandes_avis;

-- Créer une fonction pour définir automatiquement l'user_id
CREATE OR REPLACE FUNCTION public.set_demande_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si l'utilisateur est authentifié, définir automatiquement l'user_id
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Créer le trigger
DROP TRIGGER IF EXISTS set_demande_user_id_trigger ON public.demandes_avis;
CREATE TRIGGER set_demande_user_id_trigger
  BEFORE INSERT ON public.demandes_avis
  FOR EACH ROW
  EXECUTE FUNCTION public.set_demande_user_id();

-- Nouvelle politique sécurisée
CREATE POLICY "Users can create their own requests" ON public.demandes_avis
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- 3. AMÉLIORER site_settings (Séparation public/privé)
-- =====================================================

-- Ajouter colonne pour marquer les settings publics
ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Marquer les settings existants comme publics ou privés
UPDATE public.site_settings 
SET is_public = true 
WHERE category IN ('contact', 'social_media', 'hero', 'about', 'director')
  OR key IN ('contact_info', 'social_links', 'hero_settings', 'subdirections');

UPDATE public.site_settings 
SET is_public = false 
WHERE is_public IS NULL OR is_public = false;

-- Remplacer la politique trop permissive
DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;

CREATE POLICY "Public can view public settings" ON public.site_settings
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can view all settings" ON public.site_settings
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. AJOUTER PROTECTIONS EXPLICITES pour contacts
-- =====================================================

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contacts;

CREATE POLICY "Anonymous can submit contact form" ON public.contacts
  FOR INSERT
  WITH CHECK (true);

-- Ajouter politique de suppression pour les admins
CREATE POLICY "Admins can delete contacts" ON public.contacts
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. SÉCURISER kv_store_e892ec19
-- =====================================================

CREATE POLICY "Admins can manage kv_store" ON public.kv_store_e892ec19
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. AJOUTER DES INDEX pour les performances
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_demandes_avis_user_id ON public.demandes_avis(user_id);
CREATE INDEX IF NOT EXISTS idx_demandes_avis_statut ON public.demandes_avis(statut);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_site_settings_is_public ON public.site_settings(is_public);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON public.contacts(statut);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- 7. AJOUTER TRIGGER updated_at pour profiles
-- =====================================================

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. AJOUTER COMMENTAIRES pour documentation
-- =====================================================

COMMENT ON TABLE public.demandes_avis IS 'Demandes d''avis juridiques - RLS appliqué pour protéger la confidentialité des citoyens';
COMMENT ON TABLE public.contacts IS 'Soumissions de formulaire de contact - Seuls les admins peuvent voir pour protéger la vie privée';
COMMENT ON TABLE public.profiles IS 'Profils utilisateurs - Les utilisateurs ne peuvent voir que leur propre profil sauf admins';
COMMENT ON TABLE public.site_settings IS 'Configuration du site - Seuls les paramètres publics sont visibles aux non-admins';
COMMENT ON COLUMN public.site_settings.is_public IS 'Indique si ce paramètre est visible publiquement (true) ou seulement aux admins (false)';

-- 9. VÉRIFICATION FINALE
-- =====================================================

-- Vérifier que toutes les tables sensibles ont RLS activé
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('demandes_avis', 'contacts', 'profiles', 'user_roles', 'site_settings')
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = r.tablename 
      AND rowsecurity = true
    ) THEN
      RAISE EXCEPTION 'RLS non activé sur la table: %', r.tablename;
    END IF;
  END LOOP;
END $$;

-- Afficher un résumé des corrections
SELECT 'Corrections de sécurité appliquées avec succès!' as status;
