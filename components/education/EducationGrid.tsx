'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface EducationTopic {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  trimester: number;
}

interface EducationGridProps {
  topics: EducationTopic[];
}

export function EducationGrid({ topics }: EducationGridProps) {
  if (topics.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <Card key={topic.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg leading-tight">
                {topic.title}
              </CardTitle>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                T{topic.trimester}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {topic.summary}
            </p>
            
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {topic.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {topic.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{topic.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/learn/${topic.slug}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Open voice widget with prefilled prompt
                  const prompt = `Explain this topic in simple words: ${topic.title}`;
                  // This would integrate with your existing ElevenLabs widget
                  console.log('Voice prompt:', prompt);
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
