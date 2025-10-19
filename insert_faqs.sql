-- Insertion des FAQs dans la base de données
-- Assurez-vous que l'utilisateur admin existe pour pouvoir utiliser son ID

-- Insérer les FAQs (en supposant que l'utilisateur est connecté)
-- Vous devrez remplacer 'VOTRE_USER_ID' par l'ID de l'utilisateur admin

INSERT INTO faq (question, answer, category, ordre, published, created_by) VALUES
-- Questions générales
('Qu''est-ce que l''Agence Judiciaire de l''État (AJE) ?', 
'L''AJE est l''institution chargée de représenter et défendre les intérêts de l''État du Tchad devant toutes les juridictions. Elle fournit également des conseils juridiques aux administrations publiques.', 
'Questions générales', 1, true, auth.uid()),

('Qui peut saisir l''AJE ?', 
'Seules les administrations publiques, les ministères et les établissements publics peuvent saisir l''AJE. Les particuliers ne peuvent pas directement saisir l''AJE.', 
'Questions générales', 2, true, auth.uid()),

('Quels sont les horaires de l''AJE ?', 
'L''AJE est ouverte du lundi au jeudi de 7h30 à 15h30 et le vendredi de 7h30 à 12h30. Un service de permanence est disponible pour les urgences contentieuses.', 
'Questions générales', 3, true, auth.uid()),

-- Demandes d'avis juridique
('Comment demander un avis juridique ?', 
'Les administrations doivent soumettre une demande écrite accompagnée de tous les documents pertinents. Un formulaire de demande est disponible sur notre site ou auprès de nos services.', 
'Demandes d''avis juridique', 4, true, auth.uid()),

('Quel est le délai de réponse pour un avis juridique ?', 
'Le délai standard est de 15 jours ouvrables. Pour les demandes urgentes dûment justifiées, un délai réduit peut être accordé (24-48h).', 
'Demandes d''avis juridique', 5, true, auth.uid()),

('L''avis de l''AJE est-il contraignant ?', 
'L''avis de l''AJE a une valeur consultative mais fait autorité en matière juridique. Il est fortement recommandé de le suivre pour sécuriser les décisions administratives.', 
'Demandes d''avis juridique', 6, true, auth.uid()),

-- Contentieux et représentation
('L''AJE peut-elle représenter l''État dans tous les types de contentieux ?', 
'Oui, l''AJE représente l''État devant toutes les juridictions : civiles, commerciales, administratives, pénales, ainsi que devant les tribunaux arbitraux et internationaux.', 
'Contentieux et représentation', 7, true, auth.uid()),

('Comment signaler un contentieux impliquant l''État ?', 
'Toute administration ayant connaissance d''un contentieux impliquant l''État doit immédiatement en informer l''AJE en transmettant tous les documents utiles (assignation, requête, etc.).', 
'Contentieux et représentation', 8, true, auth.uid()),

('L''AJE gère-t-elle le recouvrement des créances de l''État ?', 
'Oui, la Sous-Direction du Recouvrement de Créances Contentieuses est chargée du recouvrement des créances publiques par voie contentieuse.', 
'Contentieux et représentation', 9, true, auth.uid()),

-- Procédures et documents
('Quels documents fournir pour une saisine de l''AJE ?', 
'Il faut fournir : une lettre de saisine officielle, un exposé des faits, tous les documents juridiques pertinents (contrats, correspondances, décisions), et les références réglementaires applicables.', 
'Procédures et documents', 10, true, auth.uid()),

('Peut-on consulter les modèles de documents ?', 
'Oui, des modèles de formulaires et de clauses juridiques sont disponibles dans la section ''Textes et Ressources'' de notre site.', 
'Procédures et documents', 11, true, auth.uid()),

('Comment obtenir une copie d''un dossier traité par l''AJE ?', 
'Les administrations concernées peuvent demander une copie en adressant une demande écrite au service compétent de l''AJE.', 
'Procédures et documents', 12, true, auth.uid());

-- Note: Ce script utilisera l'ID de l'utilisateur actuellement connecté (auth.uid())
-- Assurez-vous d'être connecté en tant qu'administrateur avant d'exécuter ce script
