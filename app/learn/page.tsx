import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { currentTrimester } from '@/lib/trimester';
import { EducationGrid } from '@/components/education/EducationGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LegalNote } from '@/components/LegalNote';

async function getEducationTopics(trimester: number) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('education_topics')
    .select('*')
    .eq('trimester', trimester)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching education topics:', error);
    return [];
  }

  return data || [];
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

function EducationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function LearnPage() {
  const profile = await getUserProfile();
  const trimester = currentTrimester(profile?.due_date, profile?.last_period_date);
  const topics = await getEducationTopics(trimester);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Evidence-based information tailored to your current trimester. 
          Learn about your pregnancy journey with topics that matter most to you right now.
        </p>
      </div>

      <div className="mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-blue-800 font-medium">
                Showing topics for your current trimester
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<EducationGridSkeleton />}>
        <EducationGrid topics={topics} />
      </Suspense>

      {topics.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No topics available yet
            </h3>
            <p className="text-gray-600">
              We're working on adding more educational content for your trimester.
            </p>
          </CardContent>
        </Card>
      )}

      <LegalNote />
    </div>
  );
}
