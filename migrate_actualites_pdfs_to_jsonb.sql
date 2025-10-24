-- Modifier la colonne pdfs pour stocker des objets avec url et description
-- IMPORTANT: Exécutez ce script via l'éditeur SQL de Supabase
-- https://supabase.com/dashboard/project/aupfurarzgbdocgtdomy/sql/new

-- Étape 1: Créer une nouvelle colonne temporaire de type jsonb
ALTER TABLE actualites ADD COLUMN pdfs_new jsonb DEFAULT '[]'::jsonb;

-- Étape 2: Migrer les données existantes
UPDATE actualites
SET pdfs_new = (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object('url', pdf_url, 'description', '')
    ),
    '[]'::jsonb
  )
  FROM unnest(pdfs) AS pdf_url
)
WHERE pdfs IS NOT NULL AND array_length(pdfs, 1) > 0;

-- Étape 3: Supprimer l'ancienne colonne
ALTER TABLE actualites DROP COLUMN pdfs;

-- Étape 4: Renommer la nouvelle colonne
ALTER TABLE actualites RENAME COLUMN pdfs_new TO pdfs;
