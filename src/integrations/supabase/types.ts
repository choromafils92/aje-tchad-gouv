export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      actualites: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string
          description: string
          id: string
          pdfs: Json | null
          photos: string[] | null
          published: boolean | null
          title: string
          type: string
          updated_at: string | null
          urgent: boolean | null
          videos: string[] | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          pdfs?: Json | null
          photos?: string[] | null
          published?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          urgent?: boolean | null
          videos?: string[] | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          pdfs?: Json | null
          photos?: string[] | null
          published?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          urgent?: boolean | null
          videos?: string[] | null
        }
        Relationships: []
      }
      aje_missions_content: {
        Row: {
          code: string
          color_class: string | null
          content_ar: string
          content_en: string
          content_fr: string
          created_at: string | null
          description_ar: string
          description_en: string
          description_fr: string
          details_ar: Json | null
          details_en: Json | null
          details_fr: Json | null
          icon_name: string | null
          id: string
          ordre: number
          published: boolean | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at: string | null
        }
        Insert: {
          code: string
          color_class?: string | null
          content_ar: string
          content_en: string
          content_fr: string
          created_at?: string | null
          description_ar: string
          description_en: string
          description_fr: string
          details_ar?: Json | null
          details_en?: Json | null
          details_fr?: Json | null
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          title_ar: string
          title_en: string
          title_fr: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          color_class?: string | null
          content_ar?: string
          content_en?: string
          content_fr?: string
          created_at?: string | null
          description_ar?: string
          description_en?: string
          description_fr?: string
          details_ar?: Json | null
          details_en?: Json | null
          details_fr?: Json | null
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          title_ar?: string
          title_en?: string
          title_fr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          resource_id: string | null
          resource_type: string
          status: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type: string
          status?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type?: string
          status?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      brouillons_avis: {
        Row: {
          contexte: string | null
          created_at: string | null
          demandeur: string | null
          email: string | null
          expires_at: string | null
          fonction: string | null
          id: string
          ministere: string | null
          objet: string | null
          pieces_jointes: string[] | null
          session_id: string | null
          telephone: string | null
          updated_at: string | null
          urgence: string | null
          user_id: string | null
        }
        Insert: {
          contexte?: string | null
          created_at?: string | null
          demandeur?: string | null
          email?: string | null
          expires_at?: string | null
          fonction?: string | null
          id?: string
          ministere?: string | null
          objet?: string | null
          pieces_jointes?: string[] | null
          session_id?: string | null
          telephone?: string | null
          updated_at?: string | null
          urgence?: string | null
          user_id?: string | null
        }
        Update: {
          contexte?: string | null
          created_at?: string | null
          demandeur?: string | null
          email?: string | null
          expires_at?: string | null
          fonction?: string | null
          id?: string
          ministere?: string | null
          objet?: string | null
          pieces_jointes?: string[] | null
          session_id?: string | null
          telephone?: string | null
          updated_at?: string | null
          urgence?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      consultations_juridiques: {
        Row: {
          conseiller_assigne: string | null
          contexte: string
          created_at: string | null
          date_consultation: string | null
          email: string
          fonction: string
          id: string
          lu: boolean | null
          nom_demandeur: string
          notes_internes: string | null
          numero_reference: string
          objet: string
          organisme: string
          pieces_jointes: string[] | null
          repondu: boolean | null
          statut: string | null
          telephone: string
          updated_at: string | null
        }
        Insert: {
          conseiller_assigne?: string | null
          contexte: string
          created_at?: string | null
          date_consultation?: string | null
          email: string
          fonction: string
          id?: string
          lu?: boolean | null
          nom_demandeur: string
          notes_internes?: string | null
          numero_reference: string
          objet: string
          organisme: string
          pieces_jointes?: string[] | null
          repondu?: boolean | null
          statut?: string | null
          telephone: string
          updated_at?: string | null
        }
        Update: {
          conseiller_assigne?: string | null
          contexte?: string
          created_at?: string | null
          date_consultation?: string | null
          email?: string
          fonction?: string
          id?: string
          lu?: boolean | null
          nom_demandeur?: string
          notes_internes?: string | null
          numero_reference?: string
          objet?: string
          organisme?: string
          pieces_jointes?: string[] | null
          repondu?: boolean | null
          statut?: string | null
          telephone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          lu: boolean | null
          message: string
          nom: string
          numero_reference: string | null
          repondu: boolean | null
          statut: string | null
          sujet: string
          telephone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          lu?: boolean | null
          message: string
          nom: string
          numero_reference?: string | null
          repondu?: boolean | null
          statut?: string | null
          sujet: string
          telephone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          lu?: boolean | null
          message?: string
          nom?: string
          numero_reference?: string | null
          repondu?: boolean | null
          statut?: string | null
          sujet?: string
          telephone?: string | null
        }
        Relationships: []
      }
      demandes_avis: {
        Row: {
          created_at: string | null
          description: string
          documents_joints: string[] | null
          email: string
          id: string
          lu: boolean | null
          nom_complet: string
          numero_reference: string | null
          objet: string
          organisme: string
          repondu: boolean | null
          reponse: string | null
          statut: string | null
          telephone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          documents_joints?: string[] | null
          email: string
          id?: string
          lu?: boolean | null
          nom_complet: string
          numero_reference?: string | null
          objet: string
          organisme: string
          repondu?: boolean | null
          reponse?: string | null
          statut?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          documents_joints?: string[] | null
          email?: string
          id?: string
          lu?: boolean | null
          nom_complet?: string
          numero_reference?: string | null
          objet?: string
          organisme?: string
          repondu?: boolean | null
          reponse?: string | null
          statut?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      domaines_contentieux: {
        Row: {
          affaires: Json
          categorie: string
          created_at: string | null
          created_by: string
          description: string
          icon_name: string | null
          id: string
          ordre: number
          published: boolean | null
          statistiques: string
          updated_at: string | null
        }
        Insert: {
          affaires?: Json
          categorie: string
          created_at?: string | null
          created_by: string
          description: string
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          statistiques: string
          updated_at?: string | null
        }
        Update: {
          affaires?: Json
          categorie?: string
          created_at?: string | null
          created_by?: string
          description?: string
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          statistiques?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          created_by: string
          id: string
          ordre: number | null
          published: boolean | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          ordre?: number | null
          published?: boolean | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          ordre?: number | null
          published?: boolean | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faq_assistance_contacts: {
        Row: {
          additional_info: string | null
          contact_label: string
          contact_value: string
          created_at: string | null
          created_by: string
          id: string
          ordre: number | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          additional_info?: string | null
          contact_label: string
          contact_value: string
          created_at?: string | null
          created_by: string
          id?: string
          ordre?: number | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          additional_info?: string | null
          contact_label?: string
          contact_value?: string
          created_at?: string | null
          created_by?: string
          id?: string
          ordre?: number | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string | null
          cv_url: string | null
          email: string
          id: string
          is_spontaneous: boolean | null
          job_offer_id: string | null
          lettre_motivation: string
          nom: string
          notes_internes: string | null
          prenom: string
          statut: string | null
          telephone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cv_url?: string | null
          email: string
          id?: string
          is_spontaneous?: boolean | null
          job_offer_id?: string | null
          lettre_motivation: string
          nom: string
          notes_internes?: string | null
          prenom: string
          statut?: string | null
          telephone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cv_url?: string | null
          email?: string
          id?: string
          is_spontaneous?: boolean | null
          job_offer_id?: string | null
          lettre_motivation?: string
          nom?: string
          notes_internes?: string | null
          prenom?: string
          statut?: string | null
          telephone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_offer_id_fkey"
            columns: ["job_offer_id"]
            isOneToOne: false
            referencedRelation: "job_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_offers: {
        Row: {
          created_at: string | null
          created_by: string | null
          department: string
          description: string
          experience: string
          id: string
          location: string
          published: boolean | null
          requirements: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department: string
          description: string
          experience: string
          id?: string
          location?: string
          published?: boolean | null
          requirements?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department?: string
          description?: string
          experience?: string
          id?: string
          location?: string
          published?: boolean | null
          requirements?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jurisprudences: {
        Row: {
          affaire: string
          created_at: string | null
          created_by: string | null
          date: string
          domaine: string
          id: string
          juridiction: string
          published: boolean | null
          resultat: string
          resume: string
          updated_at: string | null
        }
        Insert: {
          affaire: string
          created_at?: string | null
          created_by?: string | null
          date: string
          domaine: string
          id?: string
          juridiction: string
          published?: boolean | null
          resultat: string
          resume: string
          updated_at?: string | null
        }
        Update: {
          affaire?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          domaine?: string
          id?: string
          juridiction?: string
          published?: boolean | null
          resultat?: string
          resume?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kv_store_e892ec19: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      media_accreditations: {
        Row: {
          created_at: string | null
          documents_joints: string[] | null
          email: string
          fonction: string
          id: string
          media_organisation: string
          motif: string
          nom_complet: string
          notes_internes: string | null
          statut: string | null
          telephone: string
          type_accreditation: string
          updated_at: string | null
          viewed_at: string[] | null
          viewed_by: string[] | null
        }
        Insert: {
          created_at?: string | null
          documents_joints?: string[] | null
          email: string
          fonction: string
          id?: string
          media_organisation: string
          motif: string
          nom_complet: string
          notes_internes?: string | null
          statut?: string | null
          telephone: string
          type_accreditation: string
          updated_at?: string | null
          viewed_at?: string[] | null
          viewed_by?: string[] | null
        }
        Update: {
          created_at?: string | null
          documents_joints?: string[] | null
          email?: string
          fonction?: string
          id?: string
          media_organisation?: string
          motif?: string
          nom_complet?: string
          notes_internes?: string | null
          statut?: string | null
          telephone?: string
          type_accreditation?: string
          updated_at?: string | null
          viewed_at?: string[] | null
          viewed_by?: string[] | null
        }
        Relationships: []
      }
      media_gallery_items: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          file_size: number | null
          file_url: string
          id: string
          ordre: number | null
          published: boolean | null
          resolution: string | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          ordre?: number | null
          published?: boolean | null
          resolution?: string | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          ordre?: number | null
          published?: boolean | null
          resolution?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_kit_items: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          file_size: number | null
          file_url: string
          id: string
          name: string
          ordre: number | null
          published: boolean | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          name: string
          ordre?: number | null
          published?: boolean | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          name?: string
          ordre?: number | null
          published?: boolean | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_press_contacts: {
        Row: {
          availability_hours: string
          created_at: string | null
          email: string
          id: string
          phone: string
          service_name: string
          updated_at: string | null
        }
        Insert: {
          availability_hours: string
          created_at?: string | null
          email: string
          id?: string
          phone: string
          service_name: string
          updated_at?: string | null
        }
        Update: {
          availability_hours?: string
          created_at?: string | null
          email?: string
          id?: string
          phone?: string
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_press_newsletter: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
          unsubscribe_token: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
        }
        Relationships: []
      }
      media_press_releases: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          created_by: string
          date_publication: string
          excerpt: string
          file_size: number | null
          file_url: string | null
          id: string
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          created_by: string
          date_publication: string
          excerpt: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          created_by?: string
          date_publication?: string
          excerpt?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      missions_principales: {
        Row: {
          created_at: string
          date_debut: string | null
          date_fin: string | null
          description: string | null
          id: string
          owner_id: string | null
          priorite: number
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          priorite?: number
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          priorite?: number
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_principales_owner_fk"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
          unsubscribe_token: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
        }
        Relationships: []
      }
      procedures_contentieux: {
        Row: {
          created_at: string | null
          created_by: string | null
          delai: string
          description: string
          documents: Json
          etape: string
          id: string
          ordre: number
          published: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          delai: string
          description: string
          documents?: Json
          etape: string
          id?: string
          ordre: number
          published?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          delai?: string
          description?: string
          documents?: Json
          etape?: string
          id?: string
          ordre?: number
          published?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          request_count: number | null
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          request_count?: number | null
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number | null
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      reference_counters: {
        Row: {
          created_at: string | null
          current_count: number
          form_code: string
          form_type: string
          id: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          current_count?: number
          form_code: string
          form_type: string
          id?: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          current_count?: number
          form_code?: string
          form_type?: string
          id?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      resource_documents: {
        Row: {
          created_at: string | null
          created_by: string
          description: string
          file_size: string | null
          id: string
          ordre: number | null
          pdf_url: string | null
          published: boolean | null
          title: string
          updated_at: string | null
          word_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description: string
          file_size?: string | null
          id?: string
          ordre?: number | null
          pdf_url?: string | null
          published?: boolean | null
          title: string
          updated_at?: string | null
          word_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string
          file_size?: string | null
          id?: string
          ordre?: number | null
          pdf_url?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
          word_url?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      services_juridiques: {
        Row: {
          created_at: string | null
          created_by: string
          criteres: Json
          delai: string
          description: string
          icon_name: string | null
          id: string
          ordre: number
          published: boolean | null
          titre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          criteres?: Json
          delai: string
          description: string
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          titre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          criteres?: Json
          delai?: string
          description?: string
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          titre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      signalements_contentieux: {
        Row: {
          created_at: string | null
          description: string
          email: string
          id: string
          lu: boolean | null
          nom_demandeur: string
          notes_internes: string | null
          numero_dossier: string
          organisme: string
          pieces_jointes: string[] | null
          priorite: string | null
          repondu: boolean | null
          statut: string | null
          telephone: string | null
          traite_par: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          email: string
          id?: string
          lu?: boolean | null
          nom_demandeur: string
          notes_internes?: string | null
          numero_dossier: string
          organisme: string
          pieces_jointes?: string[] | null
          priorite?: string | null
          repondu?: boolean | null
          statut?: string | null
          telephone?: string | null
          traite_par?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          lu?: boolean | null
          nom_demandeur?: string
          notes_internes?: string | null
          numero_dossier?: string
          organisme?: string
          pieces_jointes?: string[] | null
          priorite?: string | null
          repondu?: boolean | null
          statut?: string | null
          telephone?: string | null
          traite_par?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          key: string
          label: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key: string
          label: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key?: string
          label?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      statistiques_contentieux: {
        Row: {
          created_at: string | null
          created_by: string
          evolution: string
          icon_name: string | null
          id: string
          ordre: number
          published: boolean | null
          titre: string
          updated_at: string | null
          valeur: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          evolution: string
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          titre: string
          updated_at?: string | null
          valeur: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          evolution?: string
          icon_name?: string | null
          id?: string
          ordre?: number
          published?: boolean | null
          titre?: string
          updated_at?: string | null
          valeur?: string
        }
        Relationships: []
      }
      textes_juridiques: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string
          date_publication: string | null
          file_url: string | null
          id: string
          published: boolean | null
          reference: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by: string
          date_publication?: string | null
          file_url?: string | null
          id?: string
          published?: boolean | null
          reference?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string
          date_publication?: string | null
          file_url?: string | null
          id?: string
          published?: boolean | null
          reference?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_drafts: { Args: never; Returns: undefined }
      cleanup_old_audit_logs: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      create_audit_log: {
        Args: {
          p_action: string
          p_error_message?: string
          p_new_data?: Json
          p_old_data?: Json
          p_resource_id?: string
          p_resource_type: string
          p_status?: string
        }
        Returns: string
      }
      get_next_reference: {
        Args: { p_form_code: string; p_form_type: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
