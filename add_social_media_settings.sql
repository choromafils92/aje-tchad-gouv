-- Add YouTube and WhatsApp social media settings to site_settings table

-- Insert YouTube link setting
INSERT INTO public.site_settings (key, value, label, category, description)
VALUES (
  'social_youtube',
  '""'::jsonb,
  'YouTube',
  'social',
  'Lien vers la chaîne YouTube de l''AJE'
)
ON CONFLICT (key) DO NOTHING;

-- Insert WhatsApp channel link setting
INSERT INTO public.site_settings (key, value, label, category, description)
VALUES (
  'social_whatsapp',
  '""'::jsonb,
  'Canal WhatsApp',
  'social',
  'Lien vers le canal WhatsApp de l''AJE'
)
ON CONFLICT (key) DO NOTHING;
