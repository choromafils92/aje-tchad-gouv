-- Add Hero, GPS and Legal page settings to site_settings table

-- Hero Section
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES 
  ('hero_title', '"Agence Judiciaire de l''État"', 'hero', 'Titre Principal', 'Titre affiché sur la page d''accueil', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('hero_tagline', '"Conseiller-Défendre-Protéger"', 'hero', 'Devise', 'Devise affichée sous le titre principal', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('hero_description', '"L''organe officiel chargé de défendre et représenter l''État du Tchad dans toutes les affaires juridiques et contentieuses, d''assister les administrations par le conseil juridique, et d''assurer la gestion centralisée du contentieux de l''État."', 'hero', 'Description', 'Texte descriptif sur la page d''accueil', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;

-- GPS Coordinates
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES 
  ('gps_latitude', '12.1067', 'localisation', 'Latitude', 'Coordonnée GPS Latitude', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('gps_longitude', '15.0444', 'localisation', 'Longitude', 'Coordonnée GPS Longitude', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('location_name', '"Agence Judiciaire de l''État"', 'localisation', 'Nom du Lieu', 'Nom affiché sur la carte', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('location_address', '"Avenue Félix Éboué, Quartier administratif"', 'localisation', 'Adresse', 'Adresse affichée sur la carte', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;

-- Legal Pages Content
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES 
  ('mentions_legales', '"## Mentions Légales\n\nAgence Judiciaire de l''État du Tchad\n\n### Éditeur du site\nAgence Judiciaire de l''État\nAvenue Félix Éboué, Quartier administratif\nN''Djamena, République du Tchad\n\n### Directeur de la publication\n[Nom du Directeur]\n\n### Hébergement\n[Informations sur l''hébergeur]\n\n### Propriété intellectuelle\nL''ensemble de ce site relève de la législation tchadienne et internationale sur le droit d''auteur et la propriété intellectuelle."', 'legal', 'Mentions Légales', 'Contenu de la page Mentions Légales', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('donnees_personnelles', '"## Protection des Données Personnelles\n\n### Collecte des données\nLes informations recueillies sur ce site sont destinées à l''usage exclusif de l''Agence Judiciaire de l''État.\n\n### Droit d''accès\nConformément à la législation en vigueur, vous disposez d''un droit d''accès, de modification et de suppression des données vous concernant.\n\n### Sécurité\nNous mettons en œuvre toutes les mesures techniques et organisationnelles pour assurer la sécurité de vos données."', 'legal', 'Données Personnelles', 'Contenu de la page Données Personnelles', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('accessibilite', '"## Accessibilité\n\n### Notre engagement\nL''Agence Judiciaire de l''État s''engage à rendre son site accessible conformément aux standards internationaux.\n\n### Normes appliquées\nNous nous efforçons de respecter les normes WCAG 2.1 niveau AA.\n\n### Contact\nPour toute difficulté d''accès, contactez-nous à: contact@aje.td"', 'legal', 'Accessibilité', 'Contenu de la page Accessibilité', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('plan_du_site', '"## Plan du Site\n\n### Pages principales\n- Accueil\n- Missions\n- Textes Juridiques\n- Actualités\n- Services\n- Contentieux\n- Contact\n\n### Services\n- Demande d''avis juridique\n- Modèles et guides\n- Rendez-vous\n\n### Informations légales\n- Mentions légales\n- Données personnelles\n- Accessibilité"', 'legal', 'Plan du Site', 'Contenu de la page Plan du Site', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1)),
  ('rss', '"## Flux RSS\n\n### Abonnement aux actualités\nRestez informé des dernières actualités de l''Agence Judiciaire de l''État.\n\n### Flux disponibles\n- Actualités générales\n- Communiqués de presse\n- Nouveaux textes juridiques\n\n### Comment s''abonner\nUtilisez un lecteur RSS compatible et ajoutez l''URL de notre flux."', 'legal', 'Flux RSS', 'Contenu de la page Flux RSS', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;
