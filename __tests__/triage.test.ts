import { runTriageRules, calculateGestationalWeeks, shouldOpenCase } from '@/src/domain/triage';
import type { Label } from '@/src/domain/labels';

describe('Triage System', () => {
  describe('runTriageRules', () => {
    it('should return tier 1 for mild symptoms', () => {
      const result = runTriageRules({
        labels: ['headache'] as Label[]
      });

      expect(result.tier).toBe(1);
      expect(result.action).toBe('Self care and monitor. Recheck tomorrow.');
    });

    it('should return tier 2 for moderate symptoms', () => {
      const result = runTriageRules({
        labels: ['mild_bleeding', 'abdominal_pain'] as Label[]
      });

      expect(result.tier).toBe(2);
      expect(result.action).toBe('Visit a clinic within 24 hours');
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('should return tier 3 for severe symptoms', () => {
      const result = runTriageRules({
        labels: ['heavy_bleeding', 'severe_abdominal_pain'] as Label[]
      });

      expect(result.tier).toBe(3);
      expect(result.action).toBe('Go to the nearest equipped facility now');
    });

    it('should escalate to tier 3 for severe hypertension', () => {
      const result = runTriageRules({
        bp: { systolic: 170, diastolic: 115 }
      });

      expect(result.tier).toBe(3);
      expect(result.reasons).toContain('Severe high blood pressure detected');
    });

    it('should escalate to tier 2 for moderate hypertension', () => {
      const result = runTriageRules({
        bp: { systolic: 145, diastolic: 95 }
      });

      expect(result.tier).toBe(2);
      expect(result.reasons).toContain('Elevated blood pressure');
    });

    it('should escalate for dangerous symptom combinations', () => {
      const result = runTriageRules({
        labels: ['headache', 'blurred_vision'] as Label[]
      });

      expect(result.tier).toBe(3);
      expect(result.reasons.some(r => r.includes('Dangerous symptom combination'))).toBe(true);
    });

    it('should consider gestational age and risk factors', () => {
      const result = runTriageRules({
        labels: ['heavy_bleeding'] as Label[],
        weeks: 18,
        risk_flags: { diabetes: true }
      });

      expect(result.tier).toBe(3);
    });

    it('should handle high fever appropriately', () => {
      const result = runTriageRules({
        temp_c: 39.2
      });

      expect(result.tier).toBe(3);
      expect(result.reasons).toContain('High fever detected');
    });
  });

  describe('calculateGestationalWeeks', () => {
    it('should calculate weeks correctly', () => {
      const lmp = new Date();
      lmp.setDate(lmp.getDate() - (24 * 7)); // 24 weeks ago
      
      const weeks = calculateGestationalWeeks(lmp);
      
      expect(weeks).toBe(24);
    });
  });

  describe('shouldOpenCase', () => {
    it('should always open case for tier 3', () => {
      expect(shouldOpenCase(3, false)).toBe(true);
      expect(shouldOpenCase(3, true)).toBe(true);
    });

    it('should open case for tier 2 only with consent', () => {
      expect(shouldOpenCase(2, false)).toBe(false);
      expect(shouldOpenCase(2, true)).toBe(true);
    });

    it('should never open case for tier 1', () => {
      expect(shouldOpenCase(1, false)).toBe(false);
      expect(shouldOpenCase(1, true)).toBe(false);
    });
  });
});