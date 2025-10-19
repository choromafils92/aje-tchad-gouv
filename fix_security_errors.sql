-- =====================================================
-- CORRECTION DES 2 ERREURS DE SÉCURITÉ CRITIQUES
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================

-- 1. CORRIGER LA TABLE kv_store_e892ec19 (Erreur MISSING_RLS)
-- =====================================================

-- Cette table est utilisée par Lovable pour le stockage clé-valeur
-- Seuls les admins doivent y avoir accès

-- Supprimer toutes les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admins can manage kv_store" ON kv_store_e892ec19;

-- Créer les politiques séparées pour chaque opération
-- Bloquer l'accès anonyme explicitement
CREATE POLICY "Deny unauthenticated access"
ON kv_store_e892ec19
FOR ALL TO anon
USING (false)
WITH CHECK (false);

-- Admins peuvent lire
CREATE POLICY "Admins can read"
ON kv_store_e892ec19
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins peuvent insérer
CREATE POLICY "Admins can insert"
ON kv_store_e892ec19
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins peuvent mettre à jour
CREATE POLICY "Admins can update"
ON kv_store_e892ec19
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins peuvent supprimer
CREATE POLICY "Admins can delete"
ON kv_store_e892ec19
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Vérification des politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'kv_store_e892ec19'
ORDER BY policyname;

-- Note: La deuxième erreur (INPUT_VALIDATION) sera corrigée dans le code
-- avec l'ajout de la validation Zod dans les formulaires
