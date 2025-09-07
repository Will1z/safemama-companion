/*
  # SafeMama Initial Database Schema

  1. New Tables
    - `user_profiles` - User profile information with roles
    - `consent` - User consent tracking for various services
    - `pregnancies` - Pregnancy records with risk flags
    - `contacts` - Emergency contacts for patients
    - `facilities` - Healthcare facilities with services
    - `vitals` - Vital signs measurements
    - `symptoms` - Symptom reports with AI labels and triage
    - `cases` - Emergency cases requiring clinical attention
    - `case_assignments` - Clinician case assignments
    - `clinician_availability` - Clinician on-call status and location
    - `messages` - SMS/WhatsApp message log
    - `summaries` - Generated PDF summaries
    - `audit_logs` - System audit trail

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for different user roles
    - Patients can only access their own data
    - Clinicians can access assigned cases
    - Admins have broader access to facilities and system data

  3. Indexes
    - Performance indexes on frequently queried columns
    - Geographic indexes for facility searches
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('patient', 'clinician', 'dispatcher', 'admin')),
  phone text,
  display_name text NOT NULL,
  lang text DEFAULT 'en',
  country text DEFAULT 'NG',
  created_at timestamptz DEFAULT now()
);

-- Consent tracking
CREATE TABLE IF NOT EXISTS consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  kind text NOT NULL CHECK (kind IN ('data', 'sms', 'whatsapp', 'share')),
  granted boolean DEFAULT false,
  granted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Pregnancies
CREATE TABLE IF NOT EXISTS pregnancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  lmp date NOT NULL,
  edd date NOT NULL,
  parity integer DEFAULT 0,
  risk_flags jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  is_emergency boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Healthcare facilities
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lat decimal(10,8) NOT NULL,
  lng decimal(11,8) NOT NULL,
  services text[] DEFAULT '{}',
  phone text,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Vital signs
CREATE TABLE IF NOT EXISTS vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  pregnancy_id uuid REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,
  taken_at timestamptz DEFAULT now(),
  systolic integer,
  diastolic integer,
  temp_c decimal(4,2),
  weight_kg decimal(5,2),
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- Symptoms and triage
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  pregnancy_id uuid REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,
  reported_at timestamptz DEFAULT now(),
  raw_text text NOT NULL,
  labels text[] DEFAULT '{}',
  tier integer NOT NULL CHECK (tier IN (1, 2, 3)),
  advice text NOT NULL,
  reasons text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Emergency cases
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  pregnancy_id uuid REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,
  opened_at timestamptz DEFAULT now(),
  status text DEFAULT 'NEW' CHECK (status IN ('NEW', 'NOTIFIED', 'ACCEPTED', 'IN_PROGRESS', 'CLOSED')),
  tier integer NOT NULL CHECK (tier IN (1, 2, 3)),
  lat decimal(10,8),
  lng decimal(11,8),
  summary text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Case assignments
CREATE TABLE IF NOT EXISTS case_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE NOT NULL,
  clinician_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  accepted boolean,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Clinician availability
CREATE TABLE IF NOT EXISTS clinician_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_on_call boolean DEFAULT false,
  radius_km integer DEFAULT 10,
  lat decimal(10,8),
  lng decimal(11,8),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid REFERENCES user_profiles(user_id),
  to_user uuid REFERENCES user_profiles(user_id),
  to_phone text,
  channel text NOT NULL CHECK (channel IN ('sms', 'whatsapp')),
  body text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  case_id uuid REFERENCES cases(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- PDF summaries
CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  pregnancy_id uuid REFERENCES pregnancies(id) ON DELETE CASCADE NOT NULL,
  period text NOT NULL CHECK (period IN ('daily', 'weekly')),
  generated_at timestamptz DEFAULT now(),
  pdf_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user uuid REFERENCES user_profiles(user_id) NOT NULL,
  action text NOT NULL,
  target text NOT NULL,
  details jsonb DEFAULT '{}',
  occurred_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinician_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: Users can read/update their own profile, admins can manage all
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin')
    )
  );

-- Consent: Users can manage their own consent
CREATE POLICY "Users can manage own consent" ON consent
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND user_profiles.user_id = consent.user_id
    )
  );

-- Pregnancies: Patients can manage their own, clinicians can read assigned cases
CREATE POLICY "Patients can manage own pregnancies" ON pregnancies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Clinicians can read assigned pregnancies" ON pregnancies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN case_assignments ca ON ca.clinician_id = up.user_id
      JOIN cases c ON c.id = ca.case_id
      WHERE up.user_id = auth.uid() 
        AND up.role IN ('clinician', 'dispatcher')
        AND c.pregnancy_id = pregnancies.id
    )
  );

-- Contacts: Users can manage their own contacts
CREATE POLICY "Users can manage own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

-- Facilities: Public read access, admins can manage
CREATE POLICY "Public can read facilities" ON facilities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage facilities" ON facilities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin')
    )
  );

-- Vitals: Patients can manage their own, clinicians can read assigned
CREATE POLICY "Patients can manage own vitals" ON vitals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Clinicians can read assigned vitals" ON vitals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN case_assignments ca ON ca.clinician_id = up.user_id
      JOIN cases c ON c.id = ca.case_id
      WHERE up.user_id = auth.uid() 
        AND up.role IN ('clinician', 'dispatcher')
        AND c.patient_id = vitals.user_id
    )
  );

-- Symptoms: Similar to vitals
CREATE POLICY "Patients can manage own symptoms" ON symptoms
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Clinicians can read assigned symptoms" ON symptoms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN case_assignments ca ON ca.clinician_id = up.user_id
      JOIN cases c ON c.id = ca.case_id
      WHERE up.user_id = auth.uid() 
        AND up.role IN ('clinician', 'dispatcher')
        AND c.patient_id = symptoms.user_id
    )
  );

-- Cases: Patients can read their own, clinicians can read/update assigned
CREATE POLICY "Patients can read own cases" ON cases
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Clinicians can read assigned cases" ON cases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN case_assignments ca ON ca.clinician_id = up.user_id
      WHERE up.user_id = auth.uid() 
        AND up.role IN ('clinician', 'dispatcher')
        AND ca.case_id = cases.id
    )
  );

CREATE POLICY "Clinicians can update assigned cases" ON cases
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN case_assignments ca ON ca.clinician_id = up.user_id
      WHERE up.user_id = auth.uid() 
        AND up.role IN ('clinician', 'dispatcher')
        AND ca.case_id = cases.id
        AND ca.accepted = true
    )
  );

-- Case assignments: Clinicians can read/update their own assignments
CREATE POLICY "Clinicians can manage own assignments" ON case_assignments
  FOR ALL USING (auth.uid() = clinician_id);

-- Clinician availability: Clinicians can manage their own availability
CREATE POLICY "Clinicians can manage own availability" ON clinician_availability
  FOR ALL USING (auth.uid() = clinician_id);

-- Messages: Users can read messages involving them
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (auth.uid() IN (from_user, to_user));

-- Summaries: Users can read their own summaries
CREATE POLICY "Users can read own summaries" ON summaries
  FOR SELECT USING (auth.uid() = user_id);

-- Audit logs: Admins can read all, users can read actions involving them
CREATE POLICY "Admins can read all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_pregnancies_user_id ON pregnancies(user_id);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities USING GIST (ll_to_earth(lat, lng));
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_tier ON cases(tier);
CREATE INDEX IF NOT EXISTS idx_case_assignments_clinician ON case_assignments(clinician_id);
CREATE INDEX IF NOT EXISTS idx_vitals_user_pregnancy ON vitals(user_id, pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_user_pregnancy ON symptoms(user_id, pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred_at ON audit_logs(occurred_at);

-- Insert seed data for Lagos facilities
INSERT INTO facilities (name, lat, lng, services, phone, address) VALUES
('Lagos University Teaching Hospital', 6.5244, 3.3792, ARRAY['delivery', 'csection', 'blood_bank'], '+234-1-7749304', 'Idi-Araba, Surulere, Lagos'),
('Lagos State University Teaching Hospital', 6.5895, 3.2582, ARRAY['delivery', 'csection', 'blood_bank'], '+234-1-7345678', 'Ikeja, Lagos'),
('National Orthopaedic Hospital Igbobi', 6.5244, 3.3847, ARRAY['delivery', 'csection', 'blood_bank'], '+234-1-7940234', 'Igbobi, Lagos')
ON CONFLICT DO NOTHING;