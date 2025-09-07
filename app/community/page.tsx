import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { currentTrimester } from '@/lib/trimester';
import { CommunityGrid } from '@/components/community/CommunityGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Skeleton } from 'lucide-react';
import { LegalNote } from '@/components/LegalNote';

async function getCommunities(trimester: number) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('micro_communities')
    .select('*')
    .eq('trimester', trimester)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching communities:', error);
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

function CommunityGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
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

export default async function CommunityPage() {
  const profile = await getUserProfile();
  const trimester = currentTrimester(profile?.due_date, profile?.last_period_date);
  const communities = await getCommunities(trimester);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Connect with other expecting mothers in your trimester. 
          Share experiences, ask questions, and support each other on this journey.
        </p>
      </div>

      <div className="mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-green-800 font-medium">
                Showing communities for your current trimester
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<CommunityGridSkeleton />}>
        <CommunityGrid communities={communities} />
      </Suspense>

      {communities.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No communities available yet
            </h3>
            <p className="text-gray-600">
              We're working on creating communities for your trimester.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Community Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be kind and supportive to other members</li>
          <li>• Share your experiences but avoid giving medical advice</li>
          <li>• Keep discussions respectful and inclusive</li>
          <li>• Report any inappropriate content</li>
        </ul>
      </div>

      <LegalNote />
    </div>
  );
}
