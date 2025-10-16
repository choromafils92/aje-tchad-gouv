-- ============================================
-- SCRIPT DE CONFIGURATION COMPLÈTE DU BACKEND
-- ============================================

-- 1. Table des documents (modèles, formulaires, etc.)
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('modele', 'texte_fondamental', 'formulaire', 'autre')),
  file_type text,
  file_size bigint,
  published boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Table des textes juridiques
CREATE TABLE IF NOT EXISTS public.textes_juridiques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  reference text,
  type text NOT NULL CHECK (type IN ('loi', 'decret', 'arrete', 'ordonnance', 'autre')),
  date_publication date,
  content text,
  file_url text,
  published boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Table FAQ
CREATE TABLE IF NOT EXISTS public.faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  ordre integer DEFAULT 0,
  published boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Table des demandes d'avis juridique
CREATE TABLE IF NOT EXISTS public.demandes_avis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  nom_complet text NOT NULL,
  email text NOT NULL,
  telephone text,
  organisme text NOT NULL,
  objet text NOT NULL,
  description text NOT NULL,
  documents_joints text[],
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'traite', 'rejete')),
  reponse text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. Table des contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  telephone text,
  sujet text NOT NULL,
  message text NOT NULL,
  statut text DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'traite')),
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- ACTIVATION DE LA SÉCURITÉ RLS
-- ============================================

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textes_juridiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demandes_avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES RLS - DOCUMENTS
-- ============================================

CREATE POLICY "Anyone can view published documents"
  ON public.documents FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage all documents"
  ON public.documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- POLITIQUES RLS - TEXTES JURIDIQUES
-- ============================================

CREATE POLICY "Anyone can view published legal texts"
  ON public.textes_juridiques FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage all legal texts"
  ON public.textes_juridiques FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- POLITIQUES RLS - FAQ
-- ============================================

CREATE POLICY "Anyone can view published FAQ"
  ON public.faq FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage all FAQ"
  ON public.faq FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- POLITIQUES RLS - DEMANDES D'AVIS
-- ============================================

CREATE POLICY "Users can view their own requests"
  ON public.demandes_avis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
  ON public.demandes_avis FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all requests"
  ON public.demandes_avis FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all requests"
  ON public.demandes_avis FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- POLITIQUES RLS - CONTACTS
-- ============================================

CREATE POLICY "Anyone can submit contact form"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all contacts"
  ON public.contacts FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contacts"
  ON public.contacts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- TRIGGERS POUR LES MISES À JOUR AUTOMATIQUES
-- ============================================

CREATE TRIGGER update_documents_updated_at 
  BEFORE UPDATE ON public.documents
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_textes_juridiques_updated_at 
  BEFORE UPDATE ON public.textes_juridiques
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_updated_at 
  BEFORE UPDATE ON public.faq
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandes_avis_updated_at 
  BEFORE UPDATE ON public.demandes_avis
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEX POUR LES PERFORMANCES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_published ON public.documents(published);
CREATE INDEX IF NOT EXISTS idx_textes_juridiques_type ON public.textes_juridiques(type);
CREATE INDEX IF NOT EXISTS idx_textes_juridiques_published ON public.textes_juridiques(published);
CREATE INDEX IF NOT EXISTS idx_faq_published ON public.faq(published);
CREATE INDEX IF NOT EXISTS idx_faq_ordre ON public.faq(ordre);
CREATE INDEX IF NOT EXISTS idx_demandes_avis_statut ON public.demandes_avis(statut);
CREATE INDEX IF NOT EXISTS idx_demandes_avis_user_id ON public.demandes_avis(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON public.contacts(statut);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- ============================================
-- FIN DU SCRIPT
-- ============================================