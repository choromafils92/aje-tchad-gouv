-- =========================================
-- SCRIPT À COPIER-COLLER DANS SUPABASE
-- =========================================

-- 1. Créer la table site_settings
CREATE TABLE public.site_settings (
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

-- 2. Activer RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Politiques RLS
CREATE POLICY "Anyone can view settings"
  ON public.site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Trigger pour updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Insérer les données par défaut
INSERT INTO public.site_settings (key, value, category, label, description) VALUES
  ('director_name', '"MAHAMAT TADJADINE"', 'director', 'Nom du Directeur', 'Nom complet du directeur'),
  ('director_title', '"Agent Judiciaire de l''État"', 'director', 'Titre du Directeur', 'Titre officiel'),
  ('director_photo', '""', 'director', 'Photo du Directeur', 'URL de la photo'),
  ('director_message', '"L''Agence Judiciaire de l''État du Tchad s''engage résolument dans sa mission de défense des intérêts de notre nation avec la plus grande rigueur et le plus haut niveau de professionnalisme.\n\nDepuis notre création, nous œuvrons sans relâche pour garantir que l''État du Tchad soit représenté avec excellence dans toutes les procédures juridiques, tout en accompagnant nos administrations publiques par des conseils juridiques de qualité.\n\nNotre équipe de juristes expérimentés met son expertise au service de la protection du patrimoine public et de la défense de la souveraineté nationale. Nous restons déterminés à servir notre pays avec Conseiller-Défendre-Protéger.\n\nEnsemble, construisons un système juridique fort au service du développement du Tchad."', 'director', 'Message du Directeur', 'Message officiel'),
  ('services_intro', '"L''AJE met à disposition des administrations une gamme complète de services juridiques pour sécuriser leur action et prévenir les contentieux."', 'services', 'Introduction Services', 'Texte d''introduction'),
  ('contact_address', '"Avenue Félix Éboué, Quartier administratif\nN''Djamena, République du Tchad"', 'contact', 'Adresse', 'Adresse postale'),
  ('contact_phone', '"+235 22 XX XX XX"', 'contact', 'Téléphone', 'Numéro de téléphone'),
  ('contact_email', '"contact@aje.td"', 'contact', 'Email', 'Email de contact'),
  ('contact_hours', '"Lundi au Jeudi : 7h30 - 15h30\nVendredi : 7h30 - 12h30\nWeekend : Fermé"', 'contact', 'Horaires', 'Horaires d''ouverture'),
  ('subdirections', '[{"name":"Agent judiciaire de l''État","email":"aje@aje.td","phone":"+235 22 XX XX XX"},{"name":"Sous-Direction du Contentieux","email":"contentieux@aje.td","phone":"+235 22 XX XX XX"},{"name":"Sous-Direction du Conseil Juridique","email":"conseil@aje.td","phone":"+235 22 XX XX XX"}]', 'contact', 'Sous-Directions', 'Liste des sous-directions'),
  ('contentieux_domains', '["Droit administratif général","Contentieux contractuel","Responsabilité de l''État","Droit du travail public","Contentieux fiscal","Droit domanial et foncier"]', 'contentieux', 'Domaines de Contentieux', 'Liste des domaines');

-- 6. Créer les buckets de stockage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('director-photos', 'director-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']),
  ('documents-files', 'documents-files', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('textes-juridiques-files', 'textes-juridiques-files', true, 52428800, ARRAY['application/pdf']);

-- 7. Politiques RLS pour director-photos
CREATE POLICY "Anyone can view director photos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'director-photos');

CREATE POLICY "Admins can upload director photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'director-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete director photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'director-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 8. Politiques RLS pour documents-files
CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'documents-files');

CREATE POLICY "Admins can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents-files' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents-files' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 9. Politiques RLS pour textes-juridiques-files
CREATE POLICY "Anyone can view legal texts files"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'textes-juridiques-files');

CREATE POLICY "Admins can upload legal texts files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'textes-juridiques-files' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete legal texts files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'textes-juridiques-files' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 10. S'assurer que bechirmc90@gmail.com est admin
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'bechirmc90@gmail.com';
  
  IF user_uuid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
