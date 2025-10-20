-- Suppression des doublons dans resource_documents
-- Garde uniquement la première occurrence de chaque titre

DELETE FROM resource_documents
WHERE id NOT IN (
  SELECT MIN(id)
  FROM resource_documents
  GROUP BY title
);

-- Vérification: afficher les documents restants
SELECT title, COUNT(*) as count
FROM resource_documents
GROUP BY title
ORDER BY title;
