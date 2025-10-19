-- Add Mapbox configuration to site_settings table

-- Mapbox Token (à configurer dans le back-office)
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES 
  ('mapbox_token', '""', 'hero', 'Token API Mapbox', 'Token public Mapbox pour afficher la carte interactive', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;

-- Google Place ID pour localisation précise
INSERT INTO public.site_settings (key, value, category, label, description, created_by)
VALUES 
  ('google_place_id', '"ChIJUe9wLGdhGREREQDExZ0_5kE"', 'hero', 'Google Place ID', 'Identifiant de lieu Google pour localisation précise', (SELECT id FROM auth.users WHERE email = 'bechirmc90@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;
