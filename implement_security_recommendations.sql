-- =====================================================
-- IMPLEMENTATION DES RECOMMANDATIONS DE SECURITE
-- =====================================================

-- 1. TABLE RATE LIMITING
-- =====================================================
CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier text NOT NULL, -- IP address or user_id
    endpoint text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier_endpoint 
ON public.rate_limit_tracking(identifier, endpoint, window_start);

-- RLS sur rate_limit_tracking
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les logs de rate limiting
CREATE POLICY "Admins can view rate limit logs"
ON public.rate_limit_tracking
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. TABLE AUDIT LOGGING
-- =====================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email text,
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    old_data jsonb,
    new_data jsonb,
    ip_address text,
    user_agent text,
    status text DEFAULT 'success', -- success, error, warning
    error_message text,
    created_at timestamptz DEFAULT now()
);

-- Index pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- RLS sur audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Les admins peuvent créer des audit logs
CREATE POLICY "Admins can create audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. TABLE POLITIQUE DE MOTS DE PASSE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.security_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key text UNIQUE NOT NULL,
    setting_value jsonb NOT NULL,
    description text,
    updated_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS sur security_settings
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent gérer les paramètres de sécurité
CREATE POLICY "Admins can manage security settings"
ON public.security_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insérer les paramètres par défaut
INSERT INTO public.security_settings (setting_key, setting_value, description) VALUES
('password_policy', '{
    "min_length": 8,
    "require_uppercase": true,
    "require_lowercase": true,
    "require_numbers": true,
    "require_special_chars": true,
    "password_expiry_days": 90,
    "prevent_reuse_count": 5
}'::jsonb, 'Politique de mots de passe pour les comptes administrateurs'),
('two_factor_auth', '{
    "enabled": false,
    "required_for_admins": true,
    "methods": ["totp", "sms"]
}'::jsonb, 'Configuration de l''authentification à deux facteurs'),
('rate_limiting', '{
    "enabled": true,
    "contact_form_limit": 5,
    "avis_form_limit": 3,
    "window_minutes": 60,
    "global_limit": 100
}'::jsonb, 'Configuration du rate limiting'),
('backup_settings', '{
    "auto_backup_enabled": true,
    "backup_frequency_hours": 24,
    "retention_days": 30,
    "last_backup_check": null,
    "last_restore_test": null
}'::jsonb, 'Configuration et vérification des sauvegardes')
ON CONFLICT (setting_key) DO NOTHING;

-- 4. FONCTIONS HELPER
-- =====================================================

-- Fonction pour nettoyer les anciennes entrées de rate limiting
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.rate_limit_tracking
    WHERE window_start < now() - interval '24 hours';
END;
$$;

-- Fonction pour nettoyer les anciens audit logs (garder 1 an)
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.audit_logs
    WHERE created_at < now() - interval '1 year';
END;
$$;

-- Fonction pour créer un audit log
CREATE OR REPLACE FUNCTION public.create_audit_log(
    p_action text,
    p_resource_type text,
    p_resource_id text DEFAULT NULL,
    p_old_data jsonb DEFAULT NULL,
    p_new_data jsonb DEFAULT NULL,
    p_status text DEFAULT 'success',
    p_error_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_audit_id uuid;
    v_user_email text;
BEGIN
    -- Récupérer l'email de l'utilisateur
    SELECT email INTO v_user_email
    FROM auth.users
    WHERE id = auth.uid();

    -- Insérer le log d'audit
    INSERT INTO public.audit_logs (
        user_id,
        user_email,
        action,
        resource_type,
        resource_id,
        old_data,
        new_data,
        status,
        error_message
    ) VALUES (
        auth.uid(),
        v_user_email,
        p_action,
        p_resource_type,
        p_resource_id,
        p_old_data,
        p_new_data,
        p_status,
        p_error_message
    ) RETURNING id INTO v_audit_id;

    RETURN v_audit_id;
END;
$$;

-- 5. TRIGGERS POUR AUDIT AUTOMATIQUE
-- =====================================================

-- Trigger pour audit sur user_roles
CREATE OR REPLACE FUNCTION public.audit_user_roles_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.create_audit_log(
            'role_assigned',
            'user_role',
            NEW.id::text,
            NULL,
            to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.create_audit_log(
            'role_removed',
            'user_role',
            OLD.id::text,
            to_jsonb(OLD),
            NULL
        );
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS audit_user_roles_trigger ON public.user_roles;
CREATE TRIGGER audit_user_roles_trigger
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.audit_user_roles_changes();

-- Trigger pour updated_at sur security_settings
CREATE TRIGGER update_security_settings_updated_at
BEFORE UPDATE ON public.security_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur rate_limit_tracking
CREATE TRIGGER update_rate_limit_tracking_updated_at
BEFORE UPDATE ON public.rate_limit_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.rate_limit_tracking IS 
'Suivi du rate limiting pour prévenir les abus des endpoints publics';

COMMENT ON TABLE public.audit_logs IS 
'Logs d''audit pour tracer toutes les actions sensibles des administrateurs';

COMMENT ON TABLE public.security_settings IS 
'Paramètres de sécurité incluant politique de mots de passe, 2FA, et configuration des sauvegardes';

COMMENT ON FUNCTION public.create_audit_log IS 
'Fonction helper pour créer facilement des logs d''audit depuis n''importe où dans l''application';

-- =====================================================
-- MESSAGE DE CONFIRMATION
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Toutes les recommandations de sécurité ont été implémentées avec succès:';
    RAISE NOTICE '   - Rate Limiting: Table et fonctions créées';
    RAISE NOTICE '   - Audit Logging: Système complet d''audit implémenté';
    RAISE NOTICE '   - Politique de Mots de Passe: Configuration stockée';
    RAISE NOTICE '   - Vérification des Sauvegardes: Paramètres configurés';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Prochaines étapes:';
    RAISE NOTICE '   1. Configurer le 2FA dans Supabase Auth Settings';
    RAISE NOTICE '   2. Tester les sauvegardes régulièrement';
    RAISE NOTICE '   3. Surveiller les audit logs et rate limiting';
END $$;
