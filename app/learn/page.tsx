import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, AlertTriangle, Heart, Utensils, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LegalNote } from '@/components/LegalNote';
import learnContent from '@/data/learnContent.json';
import Link from 'next/link';

function getTrimesterContent(trimester: number) {
  return learnContent[trimester as keyof typeof learnContent] || null;
}

async function getPregnancyStatus(userId: string) {
  const supabase = createClient();
  
  const { data: status, error } = await supabase
    .from('pregnancy_status_v')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching pregnancy status:', error);
    return null;
  }

  return status;
}

async function getUserProfile() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

async function getPregnancyData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Demo mode - use test user if no authenticated user
  const userId = user?.id || 'demo-user-pregnancy';
  
  const pregnancyStatus = await getPregnancyStatus(userId);
  
  return {
    userId,
    pregnancyStatus,
    isDemo: !user
  };
}


function getTopicIcon(topic: string) {
  const topicLower = topic.toLowerCase();
  if (topicLower.includes('body') || topicLower.includes('change')) {
    return <Heart className="h-5 w-5 text-pink-500" />;
  } else if (topicLower.includes('nutrition') || topicLower.includes('food')) {
    return <Utensils className="h-5 w-5 text-teal-500" />;
  } else if (topicLower.includes('warning') || topicLower.includes('sign')) {
    return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  }
  return <BookOpen className="h-5 w-5 text-blue-500" />;
}

export default async function LearnPage() {
  const { userId, pregnancyStatus, isDemo } = await getPregnancyData();
  const trimester = pregnancyStatus?.trimester;
  const trimesterContent = trimester ? getTrimesterContent(trimester) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
          {isDemo && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              Demo Mode
            </Badge>
          )}
        </div>
        <p className="text-gray-600 max-w-2xl">
          Evidence-based information tailored to your current trimester. 
          Learn about your pregnancy journey with topics that matter most to you right now.
        </p>
      </div>

      {!trimesterContent ? (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6 text-center">
            <Calendar className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-800 mb-2">
              {isDemo ? 'Demo Mode - Set a due date to see tailored lessons' : 'Please set your due date to see tailored lessons'}
            </h3>
            <p className="text-amber-700 mb-4">
              {isDemo 
                ? 'This is a demo. Set a due date to see how the system works with trimester-specific content.'
                : 'Update your profile with your due date or last period date to get personalized trimester-specific content.'
              }
            </p>
            <Button asChild>
              <Link href="/settings/pregnancy">
                <Settings className="h-4 w-4 mr-2" />
                {isDemo ? 'Try Demo - Set Due Date' : 'Set / Update Due Date'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <p className="text-teal-800 font-medium">
                      {trimesterContent.title}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/settings/pregnancy">
                      <Settings className="h-4 w-4 mr-2" />
                      Update
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pregnancy Status Badge */}
          {pregnancyStatus && (
            <div className="mb-6">
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-pink-100 text-pink-800 border-pink-200">
                You're about {pregnancyStatus.ga_weeks} weeks. 
                {pregnancyStatus.effective_due_date && (
                  <span> Estimated due {new Date(pregnancyStatus.effective_due_date).toLocaleDateString()}</span>
                )}
              </Badge>
            </div>
          )}

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
        </>
      )}

      <LegalNote />
    </div>
  );
}
