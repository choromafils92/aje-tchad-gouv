-- Create job_offers table for managing job postings
CREATE TABLE IF NOT EXISTS public.job_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL DEFAULT 'N''Djamena, Tchad',
  type text NOT NULL, -- CDI, CDD, Stage
  experience text NOT NULL,
  description text NOT NULL,
  requirements text,
  published boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create job_applications table for storing job applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_offer_id uuid REFERENCES public.job_offers(id) ON DELETE SET NULL,
  is_spontaneous boolean DEFAULT false,
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  cv_url text,
  lettre_motivation text NOT NULL,
  statut text DEFAULT 'nouveau', -- nouveau, en_cours, accepte, refuse
  notes_internes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_offers
CREATE POLICY "Anyone can view published job offers"
  ON public.job_offers FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage job offers"
  ON public.job_offers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for job_applications
CREATE POLICY "Anyone can submit applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all applications"
  ON public.job_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update applications"
  ON public.job_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_job_offers_updated_at
  BEFORE UPDATE ON public.job_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
