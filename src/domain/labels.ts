import OpenAI from 'openai';

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export const ALLOWED_LABELS = [
  'heavy_bleeding',
  'mild_bleeding', 
  'severe_abdominal_pain',
  'abdominal_pain',
  'fever',
  'headache',
  'severe_headache_with_vision_changes',
  'swelling',
  'blurred_vision',
  'dizziness',
  'shortness_of_breath',
  'vomiting',
  'reduced_fetal_movement',
  'diarrhea',
  'chest_pain'
] as const;

export type Label = typeof ALLOWED_LABELS[number];

const SYSTEM_PROMPT = `You are a medical AI assistant specializing in maternal health. Your role is to analyze patient-reported symptoms and classify them using only the allowed label set.

ALLOWED LABELS:
- heavy_bleeding: Significant vaginal bleeding, soaking pads/tampons
- mild_bleeding: Light vaginal bleeding or spotting
- severe_abdominal_pain: Intense, sharp, or cramping abdominal pain
- abdominal_pain: Mild to moderate abdominal discomfort
- fever: Elevated body temperature, feeling hot, chills
- headache: General head pain or discomfort
- severe_headache_with_vision_changes: Intense headache accompanied by vision problems
- swelling: Edema, particularly in face, hands, or feet
- blurred_vision: Vision changes, seeing spots, visual disturbances
- dizziness: Feeling lightheaded, unsteady, or faint
- shortness_of_breath: Difficulty breathing, breathlessness
- vomiting: Nausea with vomiting, throwing up
- reduced_fetal_movement: Decreased baby movement or kicks
- diarrhea: Loose, frequent bowel movements
- chest_pain: Pain or discomfort in chest area

INSTRUCTIONS:
1. Analyze the patient's symptom description carefully
2. Select ONLY labels from the allowed set that match the reported symptoms
3. Return a JSON object with a "labels" array containing matching labels
4. If no symptoms match the allowed labels, return an empty labels array
5. Do not provide medical advice, diagnosis, or treatment recommendations
6. Focus purely on classification using the approved label set

Response format: {"labels": ["label1", "label2"]}`;

export async function classifySymptoms(text: string): Promise<{ labels: Label[] }> {
  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content);
    
    // Validate that all returned labels are in our allowed set
    const validLabels = result.labels?.filter((label: string) => 
      ALLOWED_LABELS.includes(label as Label)
    ) || [];

    return { labels: validLabels };
  } catch (error) {
    console.error('Error classifying symptoms:', error);
    return { labels: [] };
  }
}