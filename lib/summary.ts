export type SymptomSummary = {
  chiefConcern: string;
  keyPoints: string[];
  duration?: string;
};

export function summarizeTranscript(t: string): SymptomSummary {
  const clean = t.replace(/\s+/g, " ").trim();
  // naive extraction; we'll refine later
  const keyPoints: string[] = [];
  
  if (/headache/i.test(clean)) keyPoints.push("Headache reported");
  if (/vision|blur/i.test(clean)) keyPoints.push("Vision changes mentioned");
  if (/swelling/i.test(clean)) keyPoints.push("Swelling reported");
  if (/bleed/i.test(clean)) keyPoints.push("Bleeding mentioned");
  if (/fever|temperature/i.test(clean)) keyPoints.push("Fever/temperature mentioned");
  if (/nausea|vomit/i.test(clean)) keyPoints.push("Nausea/vomiting reported");
  if (/dizziness/i.test(clean)) keyPoints.push("Dizziness reported");
  if (/breath|breathing/i.test(clean)) keyPoints.push("Breathing issues mentioned");
  if (/chest pain/i.test(clean)) keyPoints.push("Chest pain reported");
  if (/movement|kick/i.test(clean)) keyPoints.push("Fetal movement discussed");
  if (/cramp/i.test(clean)) keyPoints.push("Cramping mentioned");
  if (/tired|fatigue/i.test(clean)) keyPoints.push("Fatigue reported");
  
  const bpMatch = clean.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if (bpMatch) keyPoints.push(`BP quoted: ${bpMatch[1]}/${bpMatch[2]}`);
  
  // Extract duration if mentioned
  const durationMatch = clean.match(/(\d+)\s*(hour|day|week|minute)s?/i);
  const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}${durationMatch[1] !== '1' ? 's' : ''}` : undefined;
  
  return { 
    chiefConcern: keyPoints[0] || "Symptom check-in", 
    keyPoints,
    duration
  };
}
