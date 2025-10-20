-- Create statistiques_contentieux table
CREATE TABLE IF NOT EXISTS statistiques_contentieux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  valeur text NOT NULL,
  evolution text NOT NULL,
  icon_name text DEFAULT 'FileText',
  ordre integer NOT NULL DEFAULT 0,
  published boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE statistiques_contentieux ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage statistics"
  ON statistiques_contentieux
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published statistics"
  ON statistiques_contentieux
  FOR SELECT
  USING (published = true);

-- Trigger for updated_at
CREATE TRIGGER update_statistiques_contentieux_updated_at
  BEFORE UPDATE ON statistiques_contentieux
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO statistiques_contentieux (titre, valeur, evolution, icon_name, ordre, created_by) VALUES
('Dossiers traités (2024)', '2,847', '+15%', 'FileText', 1, (SELECT id FROM profiles LIMIT 1)),
('Taux de succès', '89%', '+3%', 'TrendingUp', 2, (SELECT id FROM profiles LIMIT 1)),
('Délai moyen de traitement', '45 jours', '-8 jours', 'Clock', 3, (SELECT id FROM profiles LIMIT 1)),
('Affaires en cours', '156', 'Stable', 'Scale', 4, (SELECT id FROM profiles LIMIT 1));
