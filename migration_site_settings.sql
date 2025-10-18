-- ====================================
-- MIGRATION: Création de site_settings
-- À EXÉCUTER dans Supabase SQL Editor
-- ====================================

-- Create site_settings table for dynamic content management
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default values
INSERT INTO public.site_settings (key, value, category, label, description) VALUES
  -- Director info
  ('director_name', '"MAHAMAT TADJADINE"'::jsonb, 'director', 'Nom du Directeur', 'Nom complet de l''Agent Judiciaire de l''État'),
  ('director_title', '"Agent Judiciaire de l''État"'::jsonb, 'director', 'Titre du Directeur', 'Titre officiel du Directeur'),
  ('director_photo', '"/src/assets/directeur-aje.png"'::jsonb, 'director', 'Photo du Directeur', 'URL de la photo du Directeur'),
  ('director_message', '["L''Agence Judiciaire de l''État du Tchad s''engage résolument dans sa mission de défense des intérêts de notre nation avec la plus grande rigueur et le plus haut niveau de professionnalisme.", "Depuis notre création, nous œuvrons sans relâche pour garantir que l''État du Tchad soit représenté avec excellence dans toutes les procédures juridiques, tout en accompagnant nos administrations publiques par des conseils juridiques de qualité.", "Notre équipe de juristes expérimentés met son expertise au service de la protection du patrimoine public et de la défense de la souveraineté nationale. Nous restons déterminés à servir notre pays avec Conseiller-Defendre-Proteger.", "Ensemble, construisons un système juridique fort au service du développement du Tchad."]'::jsonb, 'director', 'Message du Directeur', 'Paragraphes du message du Directeur'),
  
  -- Services
  ('services_intro', '"L''AJE met à disposition des administrations une gamme complète de services juridiques pour sécuriser leur action et prévenir les contentieux."'::jsonb, 'services', 'Introduction Services', 'Texte d''introduction de la section Services'),
  
  -- Contact info
  ('contact_address', '"Avenue Félix Éboué, Quartier administratif\nN''Djamena, République du Tchad"'::jsonb, 'contact', 'Adresse', 'Adresse complète de l''AJE'),
  ('contact_phone', '"+235 22 XX XX XX"'::jsonb, 'contact', 'Téléphone', 'Numéro de téléphone principal'),
  ('contact_email', '"contact@aje.td"'::jsonb, 'contact', 'Email', 'Adresse email de contact'),
  ('contact_hours', '"Lundi au Jeudi : 7h30 - 15h30\nVendredi : 7h30 - 12h30\nWeekend : Fermé"'::jsonb, 'contact', 'Horaires', 'Horaires d''ouverture'),
  
  -- Subdirections
  ('subdirections', '[
    {
      "name": "Agent judiciaire de l''État",
      "responsable": "MAHAMAT TADJADINE",
      "phone": "+235 22 XX XX XX",
      "email": "aje@aje.td"
    },
    {
      "name": "Sous-Direction des Affaires Pré-contentieuses",
      "responsable": "À définir",
      "phone": "+235 22 XX XX XX",
      "email": "pre-contentieux@aje.td"
    },
    {
      "name": "Sous-Direction des Affaires Contentieuses",
      "responsable": "À définir",
      "phone": "+235 22 XX XX XX",
      "email": "contentieux@aje.td"
    },
    {
      "name": "Sous-Direction des Affaires Administratives et Financières",
      "responsable": "À définir",
      "phone": "+235 22 XX XX XX",
      "email": "admin@aje.td"
    }
  ]'::jsonb, 'subdirections', 'Sous-Directions', 'Liste des sous-directions avec leurs contacts'),
  
  -- Contentieux domains
  ('contentieux_domains', '[
    {
      "title": "Droit Administratif",
      "description": "Contentieux des actes administratifs, responsabilité de l''État"
    },
    {
      "title": "Droit Commercial",
      "description": "Litiges contractuels, contentieux des marchés publics"
    },
    {
      "title": "Droit Civil",
      "description": "Responsabilité civile de l''État, dommages et intérêts"
    },
    {
      "title": "Droit du Travail",
      "description": "Contentieux de la fonction publique"
    }
  ]'::jsonb, 'contentieux', 'Domaines de Contentieux', 'Liste des domaines de contentieux')
ON CONFLICT (key) DO NOTHING;

-- Create storage bucket for director photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('director-photos', 'director-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for director photos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view director photos'
  ) THEN
    CREATE POLICY "Anyone can view director photos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'director-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload director photos'
  ) THEN
    CREATE POLICY "Admins can upload director photos"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'director-photos' AND
        has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete director photos'
  ) THEN
    CREATE POLICY "Admins can delete director photos"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'director-photos' AND
        has_role(auth.uid(), 'admin'::app_role)
      );
  END IF;
END $$;
