-- Créer la table pour gérer les informations d'assistance FAQ
CREATE TABLE IF NOT EXISTS faq_assistance_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  contact_label text NOT NULL,
  contact_value text NOT NULL,
  additional_info text,
  ordre integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Créer la table pour gérer les documents ressources téléchargeables
CREATE TABLE IF NOT EXISTS resource_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  pdf_url text,
  word_url text,
  file_size text,
  ordre integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id)
);

-- RLS pour faq_assistance_contacts
ALTER TABLE faq_assistance_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage FAQ assistance contacts"
  ON faq_assistance_contacts
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view FAQ assistance contacts"
  ON faq_assistance_contacts
  FOR SELECT
  USING (true);

-- RLS pour resource_documents
ALTER TABLE resource_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage resource documents"
  ON resource_documents
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published resource documents"
  ON resource_documents
  FOR SELECT
  USING (published = true);

-- Trigger pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faq_assistance_contacts_updated_at BEFORE UPDATE ON faq_assistance_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_documents_updated_at BEFORE UPDATE ON resource_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer les données initiales pour l'assistance FAQ
INSERT INTO faq_assistance_contacts (service_name, contact_label, contact_value, additional_info, ordre, created_by) VALUES
('Par téléphone', 'Service client AJE', '+235 22 XX XX XX', 'Lun-Jeu : 7h30-15h30, Ven : 7h30-12h30', 1, auth.uid()),
('Par email', 'Service conseil juridique', 'conseil@aje.td', 'Réponse sous 24h en jours ouvrables', 2, auth.uid());

-- Insérer les documents ressources initiaux
INSERT INTO resource_documents (title, description, pdf_url, word_url, file_size, ordre, created_by) VALUES
('Formulaire de demande d''avis juridique', 'Document officiel pour saisir l''AJE en demande d''avis', '/documents/modele_demande_avis_juridique.pdf', '/documents/modele_demande_avis_juridique.docx', '120 KB', 1, auth.uid()),
('Modèle de clause de règlement des différends', 'Clauses types pour sécuriser les contrats publics', '/documents/modele_clause_reglement_differends.pdf', '/documents/modele_clause_reglement_differends.docx', '85 KB', 2, auth.uid()),
('Check-list pré-contentieuse', 'Vérifications à effectuer avant toute action en justice', '/documents/checklist_pre_contentieuse.pdf', '/documents/checklist_pre_contentieuse.docx', '95 KB', 3, auth.uid()),
('Guide des marchés publics', 'Procédures et obligations en matière de commande publique', '/documents/guide_marches_publics.pdf', '/documents/guide_marches_publics.docx', '2.1 MB', 4, auth.uid());
