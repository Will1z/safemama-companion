import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Skeleton } from 'lucide-react';
import { LegalNote } from '@/components/LegalNote';

async function getUserProfile() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: history } = await supabase
    .from('pregnancy_history')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return { profile, history, user };
}

function ProfileFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

export default async function ProfilePage() {
  const userData = await getUserProfile();

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Please sign in
            </h3>
            <p className="text-gray-600">
              You need to be signed in to view and edit your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>
        <p className="text-gray-600">
          Update your personal information to get personalized recommendations and connect with the right community.
        </p>
      </div>

      <Suspense fallback={<ProfileFormSkeleton />}>
        <ProfileForm 
          initialProfile={userData.profile} 
          initialHistory={userData.history}
          userId={userData.user.id}
        />
      </Suspense>

      <LegalNote />
    </div>
  );
}
