// Type definitions for missions_principales table
export interface MissionPrincipale {
  id: string;
  code: string;
  title_fr: string;
  title_ar: string;
  title_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  content_fr: string;
  content_ar: string;
  content_en: string;
  details_fr: string[];
  details_ar: string[];
  details_en: string[];
  icon_name: string;
  color_class: string;
  ordre: number;
  published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
