-- Table pour les informations de contact presse
CREATE TABLE IF NOT EXISTS public.media_press_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  availability_hours text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les demandes d'accréditation presse
CREATE TABLE IF NOT EXISTS public.media_accreditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  media_organisation text NOT NULL,
  fonction text NOT NULL,
  type_accreditation text NOT NULL,
  motif text NOT NULL,
  documents_joints text[],
  statut text DEFAULT 'en_attente',
  notes_internes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les communiqués de presse
CREATE TABLE IF NOT EXISTS public.media_press_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL,
  content text,
  file_url text,
  file_size bigint,
  date_publication date NOT NULL,
  published boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour le kit média
CREATE TABLE IF NOT EXISTS public.media_kit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  description text,
  ordre integer DEFAULT 0,
  published boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour la galerie média
CREATE TABLE IF NOT EXISTS public.media_gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  type text NOT NULL, -- 'photo' ou 'video'
  file_size bigint,
  resolution text,
  published boolean DEFAULT true,
  ordre integer DEFAULT 0,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour la newsletter presse
CREATE TABLE IF NOT EXISTS public.media_press_newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribe_token text DEFAULT gen_random_uuid()::text
);

-- Enable RLS
ALTER TABLE public.media_press_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_accreditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_press_newsletter ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media_press_contacts
CREATE POLICY "Anyone can view press contacts"
  ON public.media_press_contacts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage press contacts"
  ON public.media_press_contacts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for media_accreditations
CREATE POLICY "Anyone can create accreditation request"
  ON public.media_accreditations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all accreditations"
  ON public.media_accreditations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update accreditations"
  ON public.media_accreditations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for media_press_releases
CREATE POLICY "Anyone can view published press releases"
  ON public.media_press_releases FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage press releases"
  ON public.media_press_releases FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for media_kit_items
CREATE POLICY "Anyone can view published kit items"
  ON public.media_kit_items FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage kit items"
  ON public.media_kit_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for media_gallery_items
CREATE POLICY "Anyone can view published gallery items"
  ON public.media_gallery_items FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage gallery items"
  ON public.media_gallery_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for media_press_newsletter
CREATE POLICY "Anyone can subscribe to press newsletter"
  ON public.media_press_newsletter FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view press newsletter subscriptions"
  ON public.media_press_newsletter FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage press newsletter subscriptions"
  ON public.media_press_newsletter FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_media_press_contacts_updated_at BEFORE UPDATE ON public.media_press_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_accreditations_updated_at BEFORE UPDATE ON public.media_accreditations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_press_releases_updated_at BEFORE UPDATE ON public.media_press_releases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_kit_items_updated_at BEFORE UPDATE ON public.media_kit_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_gallery_items_updated_at BEFORE UPDATE ON public.media_gallery_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données par défaut pour le contact presse
INSERT INTO public.media_press_contacts (service_name, email, phone, availability_hours)
VALUES ('Service Communication', 'presse@aje.td', '+235 XX XX XX XX', 'Disponible du lundi au vendredi de 8h à 17h')
ON CONFLICT DO NOTHING;

-- Créer un bucket de stockage pour les médias
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-files', 'media-files', true)
ON CONFLICT DO NOTHING;

-- RLS pour le bucket media-files
CREATE POLICY "Anyone can view media files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media-files');

CREATE POLICY "Admins can upload media files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'media-files' AND 
    public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update media files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'media-files' AND 
    public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'media-files' AND 
    public.has_role(auth.uid(), 'admin'::app_role)
  );
