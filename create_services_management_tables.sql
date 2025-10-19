-- Création des tables pour gérer les services juridiques et domaines de contentieux

-- Table pour les services juridiques offerts
CREATE TABLE IF NOT EXISTS public.services_juridiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  delai TEXT NOT NULL,
  criteres JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de critères d'éligibilité
  icon_name TEXT DEFAULT 'FileText', -- Nom de l'icône Lucide
  ordre INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les domaines de contentieux
CREATE TABLE IF NOT EXISTS public.domaines_contentieux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie TEXT NOT NULL,
  description TEXT NOT NULL,
  affaires JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array des types d'affaires
  statistiques TEXT NOT NULL, -- Ex: "67% des dossiers"
  icon_name TEXT DEFAULT 'Scale', -- Nom de l'icône Lucide
  ordre INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.services_juridiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domaines_contentieux ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour services_juridiques
CREATE POLICY "Admins can manage services"
  ON public.services_juridiques
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published services"
  ON public.services_juridiques
  FOR SELECT
  USING (published = true);

-- Politiques RLS pour domaines_contentieux
CREATE POLICY "Admins can manage domaines"
  ON public.domaines_contentieux
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published domaines"
  ON public.domaines_contentieux
  FOR SELECT
  USING (published = true);

-- Triggers pour updated_at
CREATE TRIGGER update_services_juridiques_updated_at
  BEFORE UPDATE ON public.services_juridiques
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domaines_contentieux_updated_at
  BEFORE UPDATE ON public.domaines_contentieux
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX idx_services_juridiques_published_ordre ON public.services_juridiques(published, ordre);
CREATE INDEX idx_domaines_contentieux_published_ordre ON public.domaines_contentieux(published, ordre);

-- Insertion des données par défaut (services juridiques)
INSERT INTO public.services_juridiques (titre, description, delai, criteres, icon_name, ordre, created_by)
VALUES 
  (
    'Avis juridiques préalables',
    'Conseil et validation juridique avant signature de contrats ou prise de décisions',
    '7-15 jours',
    '["Contrats > 50M FCFA", "Projets de décrets", "Conventions internationales"]'::jsonb,
    'FileText',
    1,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  (
    'Représentation contentieuse',
    'Défense des intérêts de l''État devant toutes juridictions',
    'Selon procédure',
    '["Litiges impliquant l''État", "Arbitrages", "Procédures d''urgence"]'::jsonb,
    'Users',
    2,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  (
    'Formation juridique',
    'Sessions de formation pour les agents des administrations publiques',
    'Sur planning',
    '["Cadres administratifs", "Gestionnaires de marchés", "Directeurs juridiques"]'::jsonb,
    'CheckCircle',
    3,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  (
    'Veille juridique',
    'Information sur l''évolution de la législation et de la jurisprudence',
    'Continu',
    '["Abonnement newsletter", "Accès documentation", "Alertes réglementaires"]'::jsonb,
    'AlertCircle',
    4,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  )
ON CONFLICT DO NOTHING;

-- Insertion des données par défaut (domaines de contentieux)
INSERT INTO public.domaines_contentieux (categorie, description, affaires, statistiques, icon_name, ordre, created_by)
VALUES 
  (
    'Contentieux Administratif',
    'Litiges impliquant l''administration publique',
    '["Marchés publics", "Fonction publique", "Urbanisme et domaine public", "Fiscalité et douanes"]'::jsonb,
    '67% des dossiers',
    'Building',
    1,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  (
    'Contentieux Civil',
    'Litiges de droit privé impliquant l''État',
    '["Responsabilité civile de l''État", "Contrats de droit privé", "Propriété et biens publics", "Assurances et indemnisations"]'::jsonb,
    '23% des dossiers',
    'Scale',
    2,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  (
    'Contentieux Commercial',
    'Litiges économiques et commerciaux',
    '["Partenariats public-privé", "Concessions et délégations", "Investissements publics", "Commerce international"]'::jsonb,
    '10% des dossiers',
    'Briefcase',
    3,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  (
    'Contentieux Pénal',
    'Défense des intérêts de l''État dans les affaires pénales',
    '["Constitution de partie civile", "Infractions contre les biens publics", "Blanchiment et fraude fiscale", "Crimes économiques et financiers"]'::jsonb,
    '5% des dossiers',
    'Gavel',
    4,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  (
    'Contentieux Social',
    'Litiges relatifs au droit du travail et de la sécurité sociale',
    '["Agents de l''État et fonctionnaires", "Accidents de service", "Sécurité sociale et pensions", "Conflits collectifs du travail"]'::jsonb,
    '8% des dossiers',
    'UserCheck',
    5,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  )
ON CONFLICT DO NOTHING;
