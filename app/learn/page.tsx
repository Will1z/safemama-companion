import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Heart, Utensils, AlertTriangle } from 'lucide-react';
import { LegalNote } from '@/components/LegalNote';
import learnContent from '@/data/learnContent.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Debug: Log the learnContent to console
console.log('🔍 DEBUG: learnContent loaded:', {
  isUndefined: learnContent === undefined,
  isNull: learnContent === null,
  type: typeof learnContent,
  keys: learnContent ? Object.keys(learnContent) : 'N/A',
  length: learnContent ? Object.keys(learnContent).length : 'N/A',
  hasSecondTrimester: learnContent ? '2' in learnContent : false
});

// Get content for second trimester (default)
const trimesterContent = learnContent?.["2"];

function getTopicIcon(topic: string) {
  const topicLower = topic.toLowerCase();
  if (topicLower.includes('body') || topicLower.includes('change')) {
    return <Heart className="h-5 w-5 text-pink-500" />;
  }
  if (topicLower.includes('nutrition') || topicLower.includes('food')) {
    return <Utensils className="h-5 w-5 text-green-500" />;
  }
  if (topicLower.includes('warning') || topicLower.includes('sign')) {
    return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  }
  return <BookOpen className="h-5 w-5 text-blue-500" />;
}

export default function LearnPage() {
  // Debug: Check if content loaded properly
  const hasContent = learnContent && learnContent["2"] && learnContent["2"].sections;
  
  if (!hasContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Evidence-based information tailored to your current trimester. 
            Learn about your pregnancy journey with topics that matter most to you right now.
          </p>
        </div>

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-2">❌</span>
            <div>
              <strong>Learn content failed to load in production</strong>
              <br />
              <small>Debug info: learnContent is {learnContent === undefined ? 'undefined' : learnContent === null ? 'null' : 'present but invalid'}</small>
            </div>
          </div>
        </div>

        <LegalNote />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Evidence-based information tailored to your current trimester. 
          Learn about your pregnancy journey with topics that matter most to you right now.
        </p>
      </div>

      <div className="mb-6">
        <Card className="bg-teal-50 border-teal-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <p className="text-teal-800 font-medium">
                {trimesterContent.title}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trimesterContent.sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200 bg-white border-pink-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                {getTopicIcon(section.topic)}
                {section.topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <LegalNote />
    </div>
  );
}

// TODO: Remove console.log and error banner after verifying the fix
