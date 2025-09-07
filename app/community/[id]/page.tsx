import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CommunityChat } from '@/components/community/CommunityChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { LegalNote } from '@/components/LegalNote';

interface Community {
  id: string;
  title: string;
  region: string;
  trimester: number;
  created_at: string;
}

async function getCommunity(id: string): Promise<Community | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('micro_communities')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

interface CommunityPageProps {
  params: {
    id: string;
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const community = await getCommunity(params.id);

  if (!community) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/community">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communities
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <header className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {community.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{community.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Trimester {community.trimester}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Be kind and supportive to other members</li>
              <li>• Share your experiences but avoid giving medical advice</li>
              <li>• Keep discussions respectful and inclusive</li>
              <li>• Report any inappropriate content</li>
              <li>• Remember that everyone's pregnancy journey is unique</li>
            </ul>
          </CardContent>
        </Card>

        <CommunityChat communityId={community.id} />

        <LegalNote />
      </div>
    </div>
  );
}
