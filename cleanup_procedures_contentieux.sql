-- Suppression des doublons dans procedures_contentieux
-- Garde uniquement la première occurrence de chaque étape

DELETE FROM procedures_contentieux
WHERE id NOT IN (
  SELECT MIN(id)
  FROM procedures_contentieux
  GROUP BY etape, ordre
);

-- Vérification: afficher les procédures restantes
SELECT id, etape, description, delai, ordre, published
FROM procedures_contentieux
ORDER BY ordre;
