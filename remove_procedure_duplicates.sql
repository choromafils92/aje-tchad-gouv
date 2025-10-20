-- Script pour supprimer les doublons de procédures contentieuses
-- Ce script garde la première occurrence de chaque étape et supprime les autres

WITH duplicates AS (
  SELECT 
    id,
    etape,
    ROW_NUMBER() OVER (PARTITION BY etape ORDER BY created_at ASC) as rn
  FROM procedures_contentieux
)
DELETE FROM procedures_contentieux
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE rn > 1
);

-- Afficher le résultat
SELECT 
  etape,
  COUNT(*) as count
FROM procedures_contentieux
GROUP BY etape
ORDER BY MIN(ordre);
