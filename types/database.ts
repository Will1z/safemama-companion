export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          user_id: string
          role: 'patient' | 'clinician' | 'dispatcher' | 'admin'
          phone: string | null
          display_name: string
          lang: string
          country: string
          created_at: string
        }
        Insert: {
          user_id: string
          role: 'patient' | 'clinician' | 'dispatcher' | 'admin'
          phone?: string | null
          display_name: string
          lang?: string
          country?: string
        }
        Update: {
          user_id?: string
          role?: 'patient' | 'clinician' | 'dispatcher' | 'admin'
          phone?: string | null
          display_name?: string
          lang?: string
          country?: string
        }
      }
      consent: {
        Row: {
          id: string
          user_id: string
          kind: 'data' | 'sms' | 'whatsapp' | 'share'
          granted: boolean
          granted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: 'data' | 'sms' | 'whatsapp' | 'share'
          granted?: boolean
          granted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kind?: 'data' | 'sms' | 'whatsapp' | 'share'
          granted?: boolean
          granted_at?: string
        }
      }
      pregnancies: {
        Row: {
          id: string
          user_id: string
          lmp: string
          edd: string
          parity: number
          risk_flags: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lmp: string
          edd: string
          parity?: number
          risk_flags?: Json
        }
        Update: {
          id?: string
          user_id?: string
          lmp?: string
          edd?: string
          parity?: number
          risk_flags?: Json
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          is_emergency: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          is_emergency?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          is_emergency?: boolean
        }
      }
      facilities: {
        Row: {
          id: string
          name: string
          lat: number
          lng: number
          services: string[]
          phone: string | null
          address: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          lat: number
          lng: number
          services: string[]
          phone?: string | null
          address: string
        }
        Update: {
          id?: string
          name?: string
          lat?: number
          lng?: number
          services?: string[]
          phone?: string | null
          address?: string
        }
      }
      vitals: {
        Row: {
          id: string
          user_id: string
          pregnancy_id: string
          taken_at: string
          systolic: number | null
          diastolic: number | null
          temp_c: number | null
          weight_kg: number | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pregnancy_id: string
          taken_at?: string
          systolic?: number | null
          diastolic?: number | null
          temp_c?: number | null
          weight_kg?: number | null
          source?: string
        }
        Update: {
          id?: string
          user_id?: string
          pregnancy_id?: string
          taken_at?: string
          systolic?: number | null
          diastolic?: number | null
          temp_c?: number | null
          weight_kg?: number | null
          source?: string
        }
      }
      symptoms: {
        Row: {
          id: string
          user_id: string
          pregnancy_id: string
          reported_at: string
          raw_text: string
          labels: string[]
          tier: number
          advice: string
          reasons: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pregnancy_id: string
          reported_at?: string
          raw_text: string
          labels: string[]
          tier: number
          advice: string
          reasons: string[]
        }
        Update: {
          id?: string
          user_id?: string
          pregnancy_id?: string
          reported_at?: string
          raw_text?: string
          labels?: string[]
          tier?: number
          advice?: string
          reasons?: string[]
        }
      }
      cases: {
        Row: {
          id: string
          patient_id: string
          pregnancy_id: string
          opened_at: string
          status: 'NEW' | 'NOTIFIED' | 'ACCEPTED' | 'IN_PROGRESS' | 'CLOSED'
          tier: number
          lat: number | null
          lng: number | null
          summary: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          pregnancy_id: string
          opened_at?: string
          status?: 'NEW' | 'NOTIFIED' | 'ACCEPTED' | 'IN_PROGRESS' | 'CLOSED'
          tier: number
          lat?: number | null
          lng?: number | null
          summary: string
        }
        Update: {
          id?: string
          patient_id?: string
          pregnancy_id?: string
          opened_at?: string
          status?: 'NEW' | 'NOTIFIED' | 'ACCEPTED' | 'IN_PROGRESS' | 'CLOSED'
          tier?: number
          lat?: number | null
          lng?: number | null
          summary?: string
        }
      }
      case_assignments: {
        Row: {
          id: string
          case_id: string
          clinician_id: string
          accepted: boolean | null
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          clinician_id: string
          accepted?: boolean | null
          accepted_at?: string | null
        }
        Update: {
          id?: string
          case_id?: string
          clinician_id?: string
          accepted?: boolean | null
          accepted_at?: string | null
        }
      }
      clinician_availability: {
        Row: {
          id: string
          clinician_id: string
          is_on_call: boolean
          radius_km: number
          lat: number | null
          lng: number | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          clinician_id: string
          is_on_call?: boolean
          radius_km?: number
          lat?: number | null
          lng?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          clinician_id?: string
          is_on_call?: boolean
          radius_km?: number
          lat?: number | null
          lng?: number | null
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          from_user: string | null
          to_user: string | null
          to_phone: string | null
          channel: 'sms' | 'whatsapp'
          body: string
          sent_at: string
          case_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          from_user?: string | null
          to_user?: string | null
          to_phone?: string | null
          channel: 'sms' | 'whatsapp'
          body: string
          sent_at?: string
          case_id?: string | null
          status?: string
        }
        Update: {
          id?: string
          from_user?: string | null
          to_user?: string | null
          to_phone?: string | null
          channel?: 'sms' | 'whatsapp'
          body?: string
          sent_at?: string
          case_id?: string | null
          status?: string
        }
      }
      summaries: {
        Row: {
          id: string
          user_id: string
          pregnancy_id: string
          period: 'daily' | 'weekly'
          generated_at: string
          pdf_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pregnancy_id: string
          period: 'daily' | 'weekly'
          generated_at?: string
          pdf_url: string
        }
        Update: {
          id?: string
          user_id?: string
          pregnancy_id?: string
          period?: 'daily' | 'weekly'
          generated_at?: string
          pdf_url?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          actor_user: string
          action: string
          target: string
          details: Json
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          actor_user: string
          action: string
          target: string
          details: Json
          occurred_at?: string
        }
        Update: {
          id?: string
          actor_user?: string
          action?: string
          target?: string
          details?: Json
          occurred_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}