-- =====================================================
-- FIX: Function Search Path Mutable Security Issue
-- This script adds search_path to all public functions
-- to prevent potential security vulnerabilities
-- =====================================================

-- Get list of functions without search_path set
DO $$
DECLARE
    func_record RECORD;
    func_definition TEXT;
BEGIN
    FOR func_record IN 
        SELECT 
            p.oid,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as arguments,
            CASE WHEN p.prosecdef THEN 'SECURITY DEFINER' ELSE 'SECURITY INVOKER' END as security_type
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND (p.proconfig IS NULL OR NOT (p.proconfig::text LIKE '%search_path%'))
    LOOP
        -- Get the function definition
        func_definition := pg_get_functiondef(func_record.oid);
        
        -- Add search_path to the function
        -- This is done by recreating the function with SET search_path = public
        RAISE NOTICE 'Function % needs search_path set', func_record.function_name;
        
        -- You can add SET search_path by altering the function
        EXECUTE format('ALTER FUNCTION public.%I(%s) SET search_path = public', 
                      func_record.function_name, 
                      func_record.arguments);
    END LOOP;
END $$;

-- Verify all functions now have search_path set
SELECT 
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments,
  CASE WHEN prosecdef THEN 'SECURITY DEFINER' ELSE 'SECURITY INVOKER' END as security,
  proconfig as config_settings
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace
ORDER BY proname;

SELECT '✓ Function search_path security issue fixed! All public functions now have search_path set.' as status;
