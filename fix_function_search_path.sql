-- =====================================================
-- FIX FUNCTION SEARCH PATH SECURITY WARNING
-- Add search_path to functions without it set
-- =====================================================

-- Fix update_updated_at_column() function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix cleanup_expired_drafts() function
CREATE OR REPLACE FUNCTION public.cleanup_expired_drafts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM brouillons_avis
  WHERE user_id IS NULL 
    AND session_id IS NOT NULL 
    AND expires_at < now();
END;
$$;

-- Verification: Check all functions now have search_path set
SELECT 
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments,
  prosecdef as security_definer,
  proconfig as config_settings
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('update_updated_at_column', 'cleanup_expired_drafts', 'handle_new_user', 'auto_add_first_admin', 'has_role')
ORDER BY proname;

SELECT '✓ Function search_path security warning fixed!' as status;
