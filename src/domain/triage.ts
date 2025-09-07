import type { Label } from './labels';

export interface TriageInput {
  text?: string;
  labels?: Label[];
  bp?: { systolic: number; diastolic: number };
  temp_c?: number;
  weeks?: number;
  risk_flags?: Record<string, any>;
  lat?: number;
  lng?: number;
}

export interface TriageResult {
  tier: 1 | 2 | 3;
  action: string;
  reasons: string[];
}

const TIER_ACTIONS = {
  1: "Self care and monitor. Recheck tomorrow.",
  2: "Visit a clinic within 24 hours",
  3: "Go to the nearest equipped facility now"
} as const;

// High-risk labels that immediately trigger higher tiers
const HIGH_RISK_LABELS: Record<Label, number> = {
  'heavy_bleeding': 3,
  'severe_abdominal_pain': 3,
  'severe_headache_with_vision_changes': 3,
  'blurred_vision': 3,
  'shortness_of_breath': 3,
  'chest_pain': 3,
  'reduced_fetal_movement': 2,
  'fever': 2,
  'mild_bleeding': 2,
  'abdominal_pain': 2,
  'swelling': 2,
  'dizziness': 2,
  'vomiting': 2,
  'headache': 1,
  'diarrhea': 1
};

export function runTriageRules(input: TriageInput): TriageResult {
  const reasons: string[] = [];
  let tier: 1 | 2 | 3 = 1;

  // Check vital signs - blood pressure
  if (input.bp) {
    const { systolic, diastolic } = input.bp;
    
    // Severe hypertension (>160/110)
    if (systolic >= 160 || diastolic >= 110) {
      tier = Math.max(tier, 3) as 1 | 2 | 3;
      reasons.push('Severe high blood pressure detected');
    }
    // Moderate hypertension (140-159/90-109)
    else if (systolic >= 140 || diastolic >= 90) {
      tier = Math.max(tier, 2) as 1 | 2 | 3;
      reasons.push('Elevated blood pressure');
    }
    
    // Severe hypotension (<90/60)
    if (systolic < 90 && diastolic < 60) {
      tier = Math.max(tier, 3) as 1 | 2 | 3;
      reasons.push('Very low blood pressure');
    }
  }

  // Check temperature
  if (input.temp_c) {
    // High fever (>38.5°C / 101.3°F)
    if (input.temp_c >= 38.5) {
      tier = Math.max(tier, 3) as 1 | 2 | 3;
      reasons.push('High fever detected');
    }
    // Moderate fever (37.5-38.4°C / 99.5-101.2°F)
    else if (input.temp_c >= 37.5) {
      tier = Math.max(tier, 2) as 1 | 2 | 3;
      reasons.push('Fever detected');
    }
  }

  // Check gestational age for preterm concerns
  if (input.weeks) {
    // Very early pregnancy concerns
    if (input.weeks < 20 && input.labels?.includes('heavy_bleeding')) {
      tier = Math.max(tier, 3) as 1 | 2 | 3;
      reasons.push('Heavy bleeding in early pregnancy');
    }
    
    // Preterm labor concerns
    if (input.weeks >= 20 && input.weeks < 37) {
      if (input.labels?.some(label => ['severe_abdominal_pain', 'abdominal_pain'].includes(label))) {
        tier = Math.max(tier, 2) as 1 | 2 | 3;
        reasons.push('Abdominal pain in preterm period');
      }
    }
  }

  // Process symptom labels
  if (input.labels?.length) {
    const highestLabelTier = Math.max(
      ...input.labels.map(label => HIGH_RISK_LABELS[label] || 1)
    ) as 1 | 2 | 3;
    
    if (highestLabelTier > tier) {
      tier = highestLabelTier;
    }

    // Add specific reasons for concerning symptoms
    input.labels.forEach(label => {
      const labelTier = HIGH_RISK_LABELS[label];
      if (labelTier >= 2) {
        reasons.push(`Concerning symptom: ${label.replace('_', ' ')}`);
      }
    });
    
    // Check for dangerous combinations
    const dangerousCombos = [
      ['headache', 'blurred_vision'],
      ['headache', 'swelling'],
      ['fever', 'abdominal_pain'],
      ['shortness_of_breath', 'chest_pain']
    ];
    
    for (const combo of dangerousCombos) {
      if (combo.every(symptom => input.labels!.includes(symptom as Label))) {
        tier = 3;
        reasons.push(`Dangerous symptom combination: ${combo.join(' + ')}`);
      }
    }
  }

  // Check risk flags from pregnancy profile
  if (input.risk_flags) {
    const riskFactors = Object.keys(input.risk_flags).filter(
      key => input.risk_flags![key] === true
    );
    
    // High-risk pregnancy factors
    const highRiskFactors = [
      'preeclampsia_history',
      'diabetes',
      'hypertension',
      'multiple_pregnancy',
      'advanced_maternal_age'
    ];
    
    if (riskFactors.some(factor => highRiskFactors.includes(factor))) {
      tier = Math.max(tier, 2) as 1 | 2 | 3;
      reasons.push('High-risk pregnancy factors present');
    }
  }

  // Default reason if no specific issues but elevated tier
  if (reasons.length === 0 && tier > 1) {
    reasons.push('Clinical assessment recommended based on reported symptoms');
  }

  return {
    tier,
    action: TIER_ACTIONS[tier],
    reasons
  };
}

// Helper function to calculate gestational weeks from LMP
export function calculateGestationalWeeks(lmp: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - lmp.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

// Helper function to determine if a case should be opened
export function shouldOpenCase(tier: number, hasConsent: boolean): boolean {
  // Tier 3 always opens a case regardless of consent (medical emergency)
  if (tier === 3) return true;
  
  // Tier 2 opens a case only if consent is given
  if (tier === 2) return hasConsent;
  
  // Tier 1 never opens a case
  return false;
}