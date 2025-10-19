-- =====================================================
-- CORRECTION DE TOUS LES PROBLÈMES DE SÉCURITÉ
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================

-- 1. Table contacts - Bloquer l'accès SELECT public
-- =====================================================
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON contacts;

-- Seulement insertion publique, pas de lecture
CREATE POLICY "Anyone can submit contact form"
ON contacts
FOR INSERT
TO public
WITH CHECK (true);

-- Admins peuvent tout voir
CREATE POLICY "Admins can view all contacts"
ON contacts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins peuvent mettre à jour
CREATE POLICY "Admins can update contacts"
ON contacts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Table consultations_juridiques - Bloquer l'accès SELECT public
-- =====================================================
DROP POLICY IF EXISTS "Anyone can create consultation" ON consultations_juridiques;
DROP POLICY IF EXISTS "Admins can view all consultations" ON consultations_juridiques;
DROP POLICY IF EXISTS "Admins can update consultations" ON consultations_juridiques;

-- Insertion publique uniquement
CREATE POLICY "Anyone can create consultation"
ON consultations_juridiques
FOR INSERT
TO public
WITH CHECK (true);

-- Admins et conseillers assignés peuvent voir
CREATE POLICY "Admins can view all consultations"
ON consultations_juridiques
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR conseiller_assigne = auth.uid()
);

-- Admins et conseillers assignés peuvent mettre à jour
CREATE POLICY "Admins can update consultations"
ON consultations_juridiques
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR conseiller_assigne = auth.uid()
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR conseiller_assigne = auth.uid()
);

-- 3. Table demandes_avis - Ajouter politique de blocage explicite
-- =====================================================
DROP POLICY IF EXISTS "Users can create requests" ON demandes_avis;
DROP POLICY IF EXISTS "Users can view their own requests" ON demandes_avis;
DROP POLICY IF EXISTS "Admins can view all requests" ON demandes_avis;
DROP POLICY IF EXISTS "Admins can update all requests" ON demandes_avis;

-- Blocage explicite pour anon
CREATE POLICY "Deny anonymous access"
ON demandes_avis
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Insertion pour authentifiés
CREATE POLICY "Authenticated users can create requests"
ON demandes_avis
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Lecture restreinte
CREATE POLICY "Users can view their own requests"
ON demandes_avis
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
ON demandes_avis
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Mise à jour admin uniquement
CREATE POLICY "Admins can update all requests"
ON demandes_avis
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Table signalements_contentieux - Bloquer l'accès SELECT public
-- =====================================================
DROP POLICY IF EXISTS "Anyone can create signalement" ON signalements_contentieux;
DROP POLICY IF EXISTS "Admins can view all signalements" ON signalements_contentieux;
DROP POLICY IF EXISTS "Admins can update signalements" ON signalements_contentieux;

-- Insertion publique uniquement
CREATE POLICY "Anyone can create signalement"
ON signalements_contentieux
FOR INSERT
TO public
WITH CHECK (true);

-- Admins et assignés peuvent voir
CREATE POLICY "Admins can view all signalements"
ON signalements_contentieux
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR traite_par = auth.uid()
);

-- Admins et assignés peuvent mettre à jour
CREATE POLICY "Admins can update signalements"
ON signalements_contentieux
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR traite_par = auth.uid()
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR traite_par = auth.uid()
);

-- 5. Table media_accreditations - Ajouter audit
-- =====================================================
-- Ajouter colonne pour tracking des accès admins
ALTER TABLE media_accreditations 
ADD COLUMN IF NOT EXISTS viewed_by uuid[],
ADD COLUMN IF NOT EXISTS viewed_at timestamptz[];

COMMENT ON COLUMN media_accreditations.viewed_by IS 'Audit trail: admins who viewed this accreditation';
COMMENT ON COLUMN media_accreditations.viewed_at IS 'Audit trail: timestamps when accreditation was viewed';

-- 6. Table kv_store_e892ec19 - Ajouter politiques strictes
-- =====================================================
DROP POLICY IF EXISTS "Admins can manage kv_store" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Deny unauthenticated access" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can read" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can insert" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can update" ON kv_store_e892ec19;
DROP POLICY IF EXISTS "Admins can delete" ON kv_store_e892ec19;

-- Blocage explicite anon
CREATE POLICY "Deny unauthenticated access"
ON kv_store_e892ec19
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Admins seulement
CREATE POLICY "Admins can select"
ON kv_store_e892ec19
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert"
ON kv_store_e892ec19
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update"
ON kv_store_e892ec19
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete"
ON kv_store_e892ec19
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Table brouillons_avis - Renforcer la sécurité des sessions
-- =====================================================
-- Ajouter expiration pour les brouillons basés sur session
ALTER TABLE brouillons_avis 
ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '24 hours');

-- Créer fonction de nettoyage automatique
CREATE OR REPLACE FUNCTION cleanup_expired_drafts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM brouillons_avis
  WHERE user_id IS NULL 
    AND session_id IS NOT NULL 
    AND expires_at < now();
END;
$$;

-- Créer index pour performance
CREATE INDEX IF NOT EXISTS idx_brouillons_expires ON brouillons_avis(expires_at) 
WHERE user_id IS NULL AND session_id IS NOT NULL;

-- 8. Vérification finale
-- =====================================================
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN (
    'contacts', 
    'consultations_juridiques', 
    'demandes_avis', 
    'signalements_contentieux',
    'media_accreditations',
    'kv_store_e892ec19',
    'brouillons_avis'
  )
GROUP BY schemaname, tablename
ORDER BY tablename;
