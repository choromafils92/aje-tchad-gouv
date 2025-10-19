-- =====================================================
-- INITIALISATION DES SOUS-DIRECTIONS
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================

-- Créer l'entrée pour les sous-directions si elle n'existe pas
INSERT INTO site_settings (key, category, label, description, value)
VALUES (
  'subdirections', 
  'contact', 
  'Sous-Directions', 
  'Liste des sous-directions et leurs responsables', 
  '[]'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Vérification
SELECT * FROM site_settings WHERE key = 'subdirections';

-- Note: Après l'exécution de ce script, vous pouvez ajouter des sous-directeurs
-- via l'interface d'administration dans l'onglet "Contact"
