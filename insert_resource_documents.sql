-- Insert resource documents for all forms
-- These documents will appear in the "Ressources documentaires" section

INSERT INTO public.resource_documents (title, description, pdf_url, word_url, file_size, ordre, published, created_by)
VALUES
  -- Formulaire de demande d'avis juridique
  (
    'Formulaire de demande d''avis juridique',
    'Modèle de formulaire pour soumettre une demande d''avis juridique à l''AJE. Ce document guide les administrations publiques dans la formulation de leurs demandes.',
    '/documents/modele_demande_avis_juridique.html',
    NULL,
    '25 KB',
    1,
    true,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  
  -- Modèle de clause de règlement des différends
  (
    'Modèle de clause de règlement des différends',
    'Clause type à intégrer dans les contrats administratifs pour prévoir les modalités de règlement des différends et éviter les contentieux.',
    '/documents/modele_clause_reglement_differends.html',
    NULL,
    '20 KB',
    2,
    true,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  
  -- Modèle de transaction administrative
  (
    'Modèle de transaction administrative',
    'Template pour la rédaction d''une transaction administrative permettant de régler un différend à l''amiable.',
    '/documents/modele_transaction_administrative.html',
    NULL,
    '22 KB',
    3,
    true,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  
  -- Check-list pré-contentieuse (Version complète)
  (
    'Check-list pré-contentieuse',
    'Liste de vérification complète pour évaluer la solidité d''un dossier avant d''engager une procédure contentieuse. Aide à identifier les pièces manquantes et les points faibles.',
    '/documents/checklist_pre_contentieuse.html',
    NULL,
    '95 KB',
    4,
    true,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  
  -- Guide des marchés publics (Version HTML détaillée)
  (
    'Guide des marchés publics',
    'Guide complet et interactif sur la réglementation des marchés publics au Tchad, incluant les procédures, les seuils, les obligations légales et une check-list de conformité.',
    '/documents/guide_marches_publics.html',
    NULL,
    '2.1 MB',
    5,
    true,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  ),
  
  -- Guide des marchés publics (Version PDF officielle)
  (
    'Loi AJE - Décret de création',
    'Décret portant création, organisation interne et attributions spécifiques de l''Agence Judiciaire de l''État.',
    '/documents/Loi_AJE.pdf',
    NULL,
    '450 KB',
    6,
    true,
    (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)
  )
ON CONFLICT DO NOTHING;
