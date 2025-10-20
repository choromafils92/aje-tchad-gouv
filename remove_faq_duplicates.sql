-- Script pour supprimer les FAQs en doublon
-- Ce script conserve uniquement la première FAQ créée pour chaque question+catégorie unique

DELETE FROM faq 
WHERE id NOT IN (
  SELECT DISTINCT ON (question, category) id 
  FROM faq 
  ORDER BY question, category, created_at ASC
);

-- Vérifier les FAQs restantes
SELECT COUNT(*) as total_faqs FROM faq;
