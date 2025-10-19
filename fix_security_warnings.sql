-- =====================================================
-- FIX SECURITY WARNINGS FROM SECURITY SCAN
-- Execute this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. FIX: Authenticated users can view unpublished news
-- =====================================================
-- Issue: Non-admin authenticated users can see unpublished drafts
-- Fix: Restrict unpublished actualites to admins only

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view all actualites" ON actualites;

-- Add admin-only access to all actualites
CREATE POLICY "Admins can view all actualites"
ON actualites
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Verify: After this fix, access control will be:
-- - Public/anonymous: Only published actualites
-- - Authenticated non-admins: Only published actualites  
-- - Admins: All actualites (published and unpublished)

-- =====================================================
-- 2. FIX: Profile access needs hardening
-- =====================================================
-- Issue: No explicit deny for anonymous users, and users can't update their profiles
-- Fix: Add explicit denial and update policy

-- Explicitly deny anonymous access to profiles
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON profiles;
CREATE POLICY "Deny anonymous access to profiles"
ON profiles
FOR ALL TO anon
USING (false)
WITH CHECK (false);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify: After this fix, access control will be:
-- - Anonymous users: No access (explicit deny)
-- - Authenticated users: Can view and update their own profile
-- - Admins: Can view all profiles

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check actualites policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'actualites'
ORDER BY policyname;

-- Check profiles policies  
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- =====================================================
-- NOTES
-- =====================================================
-- XSS Risk: Fixed in code by adding DOMPurify sanitization in ActualiteDetail.tsx
-- This provides defense-in-depth protection against compromised admin accounts
