-- Nettoyage complet des documents de ressources
-- Supprime les doublons et garde uniquement les documents valides

-- Supprimer tous les documents existants pour repartir sur une base propre
DELETE FROM resource_documents;

-- Réinsérer uniquement les documents valides avec les bons chemins
INSERT INTO resource_documents (title, description, pdf_url, word_url, file_size, ordre, published, created_by)
VALUES
  -- Formulaire de demande d'avis juridique (HTML uniquement)
  (
    'Formulaire de demande d''avis juridique',
    'Modèle de formulaire pour soumettre une demande d''avis juridique à l''AJE. Ce document guide les administrations publiques dans la formulation de leurs demandes.',
    '/documents/modele_demande_avis_juridique.html',
    NULL,
    '25 KB',
    1,
    true,
    'a56ab279-68ab-4788-93ab-61f170491231'
  ),
  
  -- Modèle de clause de règlement des différends (HTML uniquement)
  (
    'Modèle de clause de règlement des différends',
    'Clause type à intégrer dans les contrats administratifs pour prévoir les modalités de règlement des différends et éviter les contentieux.',
    '/documents/modele_clause_reglement_differends.html',
    NULL,
    '20 KB',
    2,
    true,
    'a56ab279-68ab-4788-93ab-61f170491231'
  ),
  
  -- Modèle de transaction administrative (HTML uniquement)
  (
    'Modèle de transaction administrative',
    'Template pour la rédaction d''une transaction administrative permettant de régler un différend à l''amiable.',
    '/documents/modele_transaction_administrative.html',
    NULL,
    '22 KB',
    3,
    true,
    'a56ab279-68ab-4788-93ab-61f170491231'
  ),
  
  -- Check-list pré-contentieuse (HTML uniquement)
  (
    'Check-list pré-contentieuse',
    'Liste de vérification complète pour évaluer la solidité d''un dossier avant d''engager une procédure contentieuse. Aide à identifier les pièces manquantes et les points faibles.',
    '/documents/checklist_pre_contentieuse.html',
    NULL,
    '30 KB',
    4,
    true,
    'a56ab279-68ab-4788-93ab-61f170491231'
  ),
  
  -- Guide des marchés publics (HTML uniquement - un seul, pas de doublon)
  (
    'Guide des marchés publics',
    'Guide complet et interactif sur la réglementation des marchés publics au Tchad, incluant les procédures, les seuils, les obligations légales et une check-list de conformité.',
    '/documents/guide_marches_publics.html',
    NULL,
    '150 KB',
    5,
    true,
    'a56ab279-68ab-4788-93ab-61f170491231'
  ),
  
  -- Loi AJE - Décret de création (PDF uniquement)
  (
    'Loi AJE - Décret de création',
    'Décret portant création, organisation interne et attributions spécifiques de l''Agence Judiciaire de l''État.',
    '/documents/Loi_AJE.pdf',
    NULL,
    '450 KB',
    6,
    true,
    'a56ab279-68ab-4788-93ab-61f170491231'
  );

-- Vérification finale
SELECT id, title, pdf_url, word_url, file_size, ordre, published
FROM resource_documents
ORDER BY ordre;
