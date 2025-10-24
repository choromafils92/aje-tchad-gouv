-- Modifier la colonne pdfs pour stocker des objets avec url et description
-- IMPORTANT: Exécutez ce script via l'éditeur SQL de Supabase
-- https://supabase.com/dashboard/project/aupfurarzgbdocgtdomy/sql/new

ALTER TABLE actualites 
ALTER COLUMN pdfs TYPE jsonb USING 
  CASE 
    WHEN pdfs IS NULL THEN '[]'::jsonb
    ELSE (
      SELECT jsonb_agg(
        jsonb_build_object('url', pdf_url, 'description', '')
      )
      FROM unnest(pdfs) AS pdf_url
    )
  END;
