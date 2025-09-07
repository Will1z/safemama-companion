'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Community {
  id: string;
  title: string;
  region: string;
  trimester: number;
  created_at: string;
}

interface CommunityGridProps {
  communities: Community[];
}

export function CommunityGrid({ communities }: CommunityGridProps) {
  if (communities.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community) => (
        <Card key={community.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg leading-tight">
                {community.title}
              </CardTitle>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                T{community.trimester}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{community.region}</span>
            </div>
            
            <p className="text-sm text-gray-600">
              Connect with other expecting mothers in your trimester and region. 
              Share experiences and support each other.
            </p>
            
            <Button asChild className="w-full">
              <Link href={`/community/${community.id}`}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Community
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
