-- =====================================================
-- INITIALISATION DES PARAMÈTRES DE CONTACT
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================

-- Créer les entrées pour les coordonnées de contact
INSERT INTO site_settings (key, category, label, description, value)
VALUES 
  (
    'contact_address', 
    'contact', 
    'Adresse', 
    'Adresse de l''Agence Judiciaire de l''État', 
    '"Avenue Félix Éboué, Quartier administratif\nN''Djamena, République du Tchad"'::jsonb
  ),
  (
    'contact_phone', 
    'contact', 
    'Téléphone', 
    'Numéro de téléphone principal', 
    '"+235 22 XX XX XX"'::jsonb
  ),
  (
    'contact_email', 
    'contact', 
    'Email', 
    'Adresse email de contact', 
    '"contact@aje.td"'::jsonb
  ),
  (
    'contact_hours', 
    'contact', 
    'Horaires', 
    'Horaires d''ouverture', 
    '"Lundi au Jeudi : 7h30 - 15h30\nVendredi : 7h30 - 12h30\nWeekend : Fermé"'::jsonb
  ),
  (
    'contact_subdirections', 
    'contact', 
    'Sous-directions', 
    'Liste des sous-directions avec leurs contacts', 
    '[
      {
        "nom": "Agent judiciaire de l''État",
        "responsable": "Agent judiciaire de l''État",
        "telephone": "+235 22 XX XX XX",
        "email": "direction@aje.td"
      },
      {
        "nom": "Sous-Direction du Contentieux Judiciaire",
        "responsable": "Sous-Directeur du Contentieux Judiciaire",
        "telephone": "+235 22 XX XX XX",
        "email": "contentieux.judiciaire@aje.td"
      },
      {
        "nom": "Sous-Direction du Contentieux Administratif",
        "responsable": "Sous-Directeur du Contentieux Administratif",
        "telephone": "+235 22 XX XX XX",
        "email": "contentieux.administratif@aje.td"
      },
      {
        "nom": "Sous-Direction du Conseil et des Etudes Juridiques",
        "responsable": "Sous-Directeur du Conseil et des Etudes Juridiques",
        "telephone": "+235 22 XX XX XX",
        "email": "conseil.etudes@aje.td"
      },
      {
        "nom": "Sous-Direction du Recouvrement de Créances Contentieuses",
        "responsable": "Sous-Directeur du Recouvrement de Créances Contentieuses",
        "telephone": "+235 22 XX XX XX",
        "email": "recouvrement@aje.td"
      }
    ]'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

-- Vérification
SELECT * FROM site_settings WHERE category = 'contact';

-- Note: Après l'exécution de ce script, vous pouvez gérer ces informations
-- via l'interface d'administration dans l'onglet "Paramètres Contact"
