-- Ajouter le champ director_grade dans site_settings
INSERT INTO public.site_settings (key, category, label, description, value)
VALUES (
  'director_grade',
  'director',
  'Grade du Directeur',
  'Grade ou titre professionnel du directeur (ex: MAGISTRAT)',
  '"MAGISTRAT"'::jsonb
)
ON CONFLICT (key) DO NOTHING;
