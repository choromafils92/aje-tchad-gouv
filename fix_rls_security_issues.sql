-- =====================================================
-- CORRECTION DES ERREURS DE SÉCURITÉ RLS
-- Restriction de l'accès aux données personnelles sensibles
-- =====================================================

-- 1. CORRIGER consultations_juridiques
-- Seuls les admins et conseillers assignés peuvent voir les consultations
DROP POLICY IF EXISTS "Admins can view all consultations" ON consultations_juridiques;
DROP POLICY IF EXISTS "Admins can update consultations" ON consultations_juridiques;
DROP POLICY IF EXISTS "Anyone can create consultation" ON consultations_juridiques;

-- Bloquer l'accès anonyme
CREATE POLICY "Deny anonymous read access to consultations"
ON consultations_juridiques
FOR SELECT TO anon
USING (false);

-- Permettre aux utilisateurs authentifiés de créer des consultations
CREATE POLICY "Authenticated users can create consultations"
ON consultations_juridiques
FOR INSERT TO authenticated
WITH CHECK (true);

-- Admins et conseillers assignés peuvent voir les consultations
CREATE POLICY "Admins and assigned counselors can view consultations"
ON consultations_juridiques
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR conseiller_assigne = auth.uid()
);

-- Admins et conseillers assignés peuvent mettre à jour les consultations
CREATE POLICY "Admins and assigned counselors can update consultations"
ON consultations_juridiques
FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR conseiller_assigne = auth.uid()
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR conseiller_assigne = auth.uid()
);

-- 2. CORRIGER contacts
-- Seuls les admins peuvent voir les contacts
DROP POLICY IF EXISTS "Admins can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contacts;

-- Bloquer l'accès anonyme en lecture
CREATE POLICY "Deny anonymous read access to contacts"
ON contacts
FOR SELECT TO anon
USING (false);

-- Permettre aux utilisateurs de soumettre le formulaire de contact
CREATE POLICY "Anyone can submit contact form"
ON contacts
FOR INSERT
WITH CHECK (true);

-- Seuls les admins peuvent voir les contacts
CREATE POLICY "Only admins can view contacts"
ON contacts
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. CORRIGER job_applications
-- Seuls les admins peuvent voir les candidatures
DROP POLICY IF EXISTS "Admins can view all applications" ON job_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON job_applications;

-- Bloquer l'accès anonyme en lecture
CREATE POLICY "Deny anonymous read access to job applications"
ON job_applications
FOR SELECT TO anon
USING (false);

-- Permettre aux utilisateurs de soumettre des candidatures
CREATE POLICY "Anyone can submit job applications"
ON job_applications
FOR INSERT
WITH CHECK (true);

-- Seuls les admins peuvent voir les candidatures
CREATE POLICY "Only admins can view job applications"
ON job_applications
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. CORRIGER media_accreditations
-- Seuls les admins peuvent voir les demandes d'accréditation
DROP POLICY IF EXISTS "Admins can view all accreditations" ON media_accreditations;
DROP POLICY IF EXISTS "Anyone can create accreditation request" ON media_accreditations;

-- Bloquer l'accès anonyme en lecture
CREATE POLICY "Deny anonymous read access to accreditations"
ON media_accreditations
FOR SELECT TO anon
USING (false);

-- Permettre aux utilisateurs de créer des demandes d'accréditation
CREATE POLICY "Anyone can create accreditation requests"
ON media_accreditations
FOR INSERT
WITH CHECK (true);

-- Seuls les admins peuvent voir les demandes
CREATE POLICY "Only admins can view accreditations"
ON media_accreditations
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. CORRIGER signalements_contentieux
-- Seuls les admins et personnes assignées peuvent voir les signalements
DROP POLICY IF EXISTS "Admins can view all signalements" ON signalements_contentieux;
DROP POLICY IF EXISTS "Anyone can create signalement" ON signalements_contentieux;

-- Bloquer l'accès anonyme en lecture
CREATE POLICY "Deny anonymous read access to signalements"
ON signalements_contentieux
FOR SELECT TO anon
USING (false);

-- Permettre aux utilisateurs de créer des signalements
CREATE POLICY "Anyone can create signalements"
ON signalements_contentieux
FOR INSERT
WITH CHECK (true);

-- Seuls les admins et personnes assignées peuvent voir les signalements
CREATE POLICY "Only admins and assigned can view signalements"
ON signalements_contentieux
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR traite_par = auth.uid()
);

-- 6. AMÉLIORER brouillons_avis
-- Ajouter une validation supplémentaire pour les session_id
CREATE POLICY "Strict session validation for drafts"
ON brouillons_avis
FOR ALL
USING (
  -- Utilisateurs authentifiés peuvent voir leurs propres brouillons
  (auth.uid() = user_id)
  OR
  -- Brouillons avec session_id valides (non expirés uniquement)
  (user_id IS NULL AND session_id IS NOT NULL AND expires_at > now())
  OR
  -- Admins peuvent tout voir
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Vérification finale
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename IN (
  'consultations_juridiques',
  'contacts', 
  'job_applications',
  'media_accreditations',
  'signalements_contentieux',
  'brouillons_avis'
)
ORDER BY tablename, policyname;
