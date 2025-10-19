-- =====================================================
-- SETUP CONTENTIEUX & SERVICES FEATURES
-- Execute this SQL in your Supabase SQL Editor
-- =====================================================

-- Table pour les procédures de traitement du contentieux
CREATE TABLE IF NOT EXISTS public.procedures_contentieux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ordre integer NOT NULL,
  etape text NOT NULL,
  description text NOT NULL,
  delai text NOT NULL,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les jurisprudences récentes
CREATE TABLE IF NOT EXISTS public.jurisprudences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  juridiction text NOT NULL,
  affaire text NOT NULL,
  domaine text NOT NULL,
  resultat text NOT NULL,
  resume text NOT NULL,
  published boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les signalements de contentieux urgents
CREATE TABLE IF NOT EXISTS public.signalements_contentieux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_dossier text UNIQUE NOT NULL,
  organisme text NOT NULL,
  nom_demandeur text NOT NULL,
  email text NOT NULL,
  telephone text,
  description text NOT NULL,
  pieces_jointes text[] DEFAULT '{}',
  statut text DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'traite', 'clos')),
  priorite text DEFAULT 'urgent' CHECK (priorite IN ('urgent', 'tres_urgent')),
  notes_internes text,
  traite_par uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les demandes de consultation juridique
CREATE TABLE IF NOT EXISTS public.consultations_juridiques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_reference text UNIQUE NOT NULL,
  organisme text NOT NULL,
  nom_demandeur text NOT NULL,
  fonction text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  objet text NOT NULL,
  contexte text NOT NULL,
  pieces_jointes text[] DEFAULT '{}',
  statut text DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'planifie', 'en_cours', 'termine')),
  date_consultation timestamptz,
  notes_internes text,
  conseiller_assigne uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les brouillons de demandes d'avis
CREATE TABLE IF NOT EXISTS public.brouillons_avis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text,
  ministere text,
  urgence text,
  demandeur text,
  fonction text,
  email text,
  telephone text,
  objet text,
  contexte text,
  pieces_jointes text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.procedures_contentieux ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisprudences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signalements_contentieux ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations_juridiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brouillons_avis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for procedures_contentieux
DROP POLICY IF EXISTS "Anyone can view published procedures" ON public.procedures_contentieux;
CREATE POLICY "Anyone can view published procedures"
  ON public.procedures_contentieux FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage procedures" ON public.procedures_contentieux;
CREATE POLICY "Admins can manage procedures"
  ON public.procedures_contentieux FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for jurisprudences
DROP POLICY IF EXISTS "Anyone can view published jurisprudences" ON public.jurisprudences;
CREATE POLICY "Anyone can view published jurisprudences"
  ON public.jurisprudences FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage jurisprudences" ON public.jurisprudences;
CREATE POLICY "Admins can manage jurisprudences"
  ON public.jurisprudences FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for signalements_contentieux
DROP POLICY IF EXISTS "Anyone can create signalement" ON public.signalements_contentieux;
CREATE POLICY "Anyone can create signalement"
  ON public.signalements_contentieux FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all signalements" ON public.signalements_contentieux;
CREATE POLICY "Admins can view all signalements"
  ON public.signalements_contentieux FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update signalements" ON public.signalements_contentieux;
CREATE POLICY "Admins can update signalements"
  ON public.signalements_contentieux FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for consultations_juridiques
DROP POLICY IF EXISTS "Anyone can create consultation" ON public.consultations_juridiques;
CREATE POLICY "Anyone can create consultation"
  ON public.consultations_juridiques FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations_juridiques;
CREATE POLICY "Admins can view all consultations"
  ON public.consultations_juridiques FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update consultations" ON public.consultations_juridiques;
CREATE POLICY "Admins can update consultations"
  ON public.consultations_juridiques FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for brouillons_avis
DROP POLICY IF EXISTS "Users can create their own drafts" ON public.brouillons_avis;
CREATE POLICY "Users can create their own drafts"
  ON public.brouillons_avis FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

DROP POLICY IF EXISTS "Users can view their own drafts" ON public.brouillons_avis;
CREATE POLICY "Users can view their own drafts"
  ON public.brouillons_avis FOR SELECT
  USING (auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL));

DROP POLICY IF EXISTS "Users can update their own drafts" ON public.brouillons_avis;
CREATE POLICY "Users can update their own drafts"
  ON public.brouillons_avis FOR UPDATE
  USING (auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL));

DROP POLICY IF EXISTS "Users can delete their own drafts" ON public.brouillons_avis;
CREATE POLICY "Users can delete their own drafts"
  ON public.brouillons_avis FOR DELETE
  USING (auth.uid() = user_id OR (user_id IS NULL AND session_id IS NOT NULL));

DROP POLICY IF EXISTS "Admins can view all drafts" ON public.brouillons_avis;
CREATE POLICY "Admins can view all drafts"
  ON public.brouillons_avis FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_procedures_contentieux_updated_at ON public.procedures_contentieux;
CREATE TRIGGER update_procedures_contentieux_updated_at
  BEFORE UPDATE ON public.procedures_contentieux
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_jurisprudences_updated_at ON public.jurisprudences;
CREATE TRIGGER update_jurisprudences_updated_at
  BEFORE UPDATE ON public.jurisprudences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_signalements_contentieux_updated_at ON public.signalements_contentieux;
CREATE TRIGGER update_signalements_contentieux_updated_at
  BEFORE UPDATE ON public.signalements_contentieux
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_juridiques_updated_at ON public.consultations_juridiques;
CREATE TRIGGER update_consultations_juridiques_updated_at
  BEFORE UPDATE ON public.consultations_juridiques
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_brouillons_avis_updated_at ON public.brouillons_avis;
CREATE TRIGGER update_brouillons_avis_updated_at
  BEFORE UPDATE ON public.brouillons_avis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default procedures data
INSERT INTO public.procedures_contentieux (ordre, etape, description, delai, documents) VALUES
(1, '1. Saisine', 'Réception et analyse de la demande', '2-5 jours', '["Dossier complet", "Pièces justificatives"]'::jsonb),
(2, '2. Instruction', 'Étude approfondie du dossier', '15-30 jours', '["Analyses juridiques", "Consultations"]'::jsonb),
(3, '3. Stratégie', 'Définition de la stratégie contentieuse', '5-10 jours', '["Plan d''action", "Recommandations"]'::jsonb),
(4, '4. Action', 'Mise en œuvre et suivi', 'Variable', '["Actes de procédure", "Rapports de suivi"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert default jurisprudences data
INSERT INTO public.jurisprudences (date, juridiction, affaire, domaine, resultat, resume) VALUES
('2024-03-15', 'Cour Suprême du Tchad', 'État du Tchad c. Société ALPHA', 'Marchés Publics', 'Favorable', 'Annulation pour vice de procédure - Économie de 2,4 milliards FCFA'),
('2024-02-08', 'Tribunal Administratif de N''Djaména', 'Ministère des Finances c. Contribuable X', 'Fiscal', 'Favorable', 'Confirmation du redressement fiscal - Recouvrement de 850 millions FCFA'),
('2024-01-22', 'Cour d''Appel de N''Djaména', 'État c. Société de Construction Y', 'Responsabilité', 'Transactionnel', 'Accord amiable - Réduction de 60% de l''indemnisation demandée')
ON CONFLICT DO NOTHING;
