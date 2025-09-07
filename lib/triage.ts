export type TriageResult = { tier: 1|2|3; reasons: string[]; action: string };

export function triage(summaryText: string): TriageResult {
  const reasons: string[] = [];
  let tier: 1|2|3 = 1;

  // Blood pressure checks
  const bp = summaryText.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if (bp) {
    const sys = parseInt(bp[1], 10), dia = parseInt(bp[2], 10);
    if (sys >= 160 || dia >= 110) { 
      tier = 3; 
      reasons.push("Very high BP (≥160/110)"); 
    }
    else if (sys >= 140 || dia >= 90) { 
      tier = Math.max(tier, 2) as any; 
      reasons.push("High BP (≥140/90)"); 
    }
  }

  // Severe bleeding - Tier 3
  if (/(heavy|severe|lots of|excessive)\s+bleed/i.test(summaryText)) { 
    tier = 3; 
    reasons.push("Severe bleeding"); 
  }

  // Severe headache with vision changes - Tier 3
  if (/severe\s+headache.*vision|vision.*severe\s+headache/i.test(summaryText)) { 
    tier = 3; 
    reasons.push("Severe headache with vision changes"); 
  }

  // Reduced fetal movement - Tier 2 or 3
  if (/no\s+movement|no\s+kick|stopped\s+movement/i.test(summaryText)) { 
    tier = 3; 
    reasons.push("No fetal movement"); 
  } else if (/reduced\s+movement|less\s+movement|fewer\s+kick/i.test(summaryText)) { 
    tier = Math.max(tier, 2) as any; 
    reasons.push("Reduced fetal movement"); 
  }

  // Vision changes - Tier 2
  if (/blur|vision|spots|flashing/i.test(summaryText)) { 
    tier = Math.max(tier, 2) as any; 
    reasons.push("Vision changes"); 
  }

  // Severe headache - Tier 2
  if (/severe\s+headache|terrible\s+headache|worst\s+headache/i.test(summaryText)) { 
    tier = Math.max(tier, 2) as any; 
    reasons.push("Severe headache"); 
  }

  // Chest pain - Tier 2
  if (/chest\s+pain|chest\s+discomfort/i.test(summaryText)) { 
    tier = Math.max(tier, 2) as any; 
    reasons.push("Chest pain"); 
  }

  // Breathing difficulties - Tier 2
  if (/can't\s+breathe|difficulty\s+breathing|shortness\s+of\s+breath/i.test(summaryText)) { 
    tier = Math.max(tier, 2) as any; 
    reasons.push("Breathing difficulties"); 
  }

  // High fever - Tier 2
  if (/high\s+fever|fever.*\d{3}|temperature.*\d{3}/i.test(summaryText)) { 
    tier = Math.max(tier, 2) as any; 
    reasons.push("High fever"); 
  }

  // Severe abdominal pain - Tier 2
  if (/severe\s+(abdominal\s+)?pain|terrible\s+(abdominal\s+)?pain/i.test(summaryText)) { 
    tier = Math.max(tier, 2) as any; 
    reasons.push("Severe abdominal pain"); 
  }

  const action = tier === 3
    ? "Emergency — go to the nearest equipped facility now."
    : tier === 2
      ? "Visit a clinic within 24 hours."
      : "Self-care and monitor; recheck tomorrow.";

  return { tier, reasons, action };
}
