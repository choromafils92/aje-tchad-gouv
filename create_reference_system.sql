-- Table pour gérer les compteurs de références automatiques
CREATE TABLE IF NOT EXISTS reference_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL UNIQUE,
  form_code text NOT NULL,
  current_count integer NOT NULL DEFAULT 0,
  year integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_reference_counters_type ON reference_counters(form_type);
CREATE INDEX IF NOT EXISTS idx_reference_counters_year ON reference_counters(year);

-- Fonction pour obtenir la prochaine référence
CREATE OR REPLACE FUNCTION get_next_reference(p_form_type text, p_form_code text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_year integer;
  v_next_count integer;
  v_reference text;
BEGIN
  v_current_year := EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Insérer ou mettre à jour le compteur
  INSERT INTO reference_counters (form_type, form_code, current_count, year)
  VALUES (p_form_type, p_form_code, 1, v_current_year)
  ON CONFLICT (form_type) 
  DO UPDATE SET 
    current_count = CASE 
      WHEN reference_counters.year = v_current_year THEN reference_counters.current_count + 1
      ELSE 1
    END,
    year = v_current_year,
    updated_at = now()
  RETURNING current_count INTO v_next_count;
  
  -- Construire la référence: AJE/2025/CODE/NUM
  v_reference := 'AJE/' || v_current_year || '/' || p_form_code || '/' || v_next_count;
  
  RETURN v_reference;
END;
$$;

-- Ajouter la colonne numero_reference aux tables existantes si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contacts' AND column_name = 'numero_reference') THEN
    ALTER TABLE contacts ADD COLUMN numero_reference text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'demandes_avis' AND column_name = 'numero_reference') THEN
    ALTER TABLE demandes_avis ADD COLUMN numero_reference text;
  END IF;
END $$;

-- Ajouter colonnes de statut de lecture
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contacts' AND column_name = 'lu') THEN
    ALTER TABLE contacts ADD COLUMN lu boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contacts' AND column_name = 'repondu') THEN
    ALTER TABLE contacts ADD COLUMN repondu boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'demandes_avis' AND column_name = 'lu') THEN
    ALTER TABLE demandes_avis ADD COLUMN lu boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'demandes_avis' AND column_name = 'repondu') THEN
    ALTER TABLE demandes_avis ADD COLUMN repondu boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'consultations_juridiques' AND column_name = 'lu') THEN
    ALTER TABLE consultations_juridiques ADD COLUMN lu boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'consultations_juridiques' AND column_name = 'repondu') THEN
    ALTER TABLE consultations_juridiques ADD COLUMN repondu boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'signalements_contentieux' AND column_name = 'lu') THEN
    ALTER TABLE signalements_contentieux ADD COLUMN lu boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'signalements_contentieux' AND column_name = 'repondu') THEN
    ALTER TABLE signalements_contentieux ADD COLUMN repondu boolean DEFAULT false;
  END IF;
END $$;

-- Initialiser les compteurs pour chaque type de formulaire
INSERT INTO reference_counters (form_type, form_code, current_count, year)
VALUES 
  ('demande_avis', 'DA', 0, EXTRACT(YEAR FROM CURRENT_DATE)),
  ('contact', 'CT', 0, EXTRACT(YEAR FROM CURRENT_DATE)),
  ('consultation', 'CJ', 0, EXTRACT(YEAR FROM CURRENT_DATE)),
  ('signalement', 'SC', 0, EXTRACT(YEAR FROM CURRENT_DATE)),
  ('modele_clause', 'MCRDA', 0, EXTRACT(YEAR FROM CURRENT_DATE)),
  ('checklist', 'CLPC', 0, EXTRACT(YEAR FROM CURRENT_DATE)),
  ('transaction', 'MTA', 0, EXTRACT(YEAR FROM CURRENT_DATE)),
  ('guide_marches', 'GMP', 0, EXTRACT(YEAR FROM CURRENT_DATE))
ON CONFLICT (form_type) DO NOTHING;

-- RLS policies pour la table reference_counters
ALTER TABLE reference_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view counters" ON reference_counters
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage counters" ON reference_counters
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
