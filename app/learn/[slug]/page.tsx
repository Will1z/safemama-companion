import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { LegalNote } from '@/components/LegalNote';

interface EducationTopic {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  trimester: number;
  created_at: string;
}

async function getEducationTopic(slug: string): Promise<EducationTopic | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('education_topics')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

interface TopicPageProps {
  params: {
    slug: string;
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = await getEducationTopic(params.slug);

  if (!topic) {
    notFound();
  }

  const handleVoicePrompt = () => {
    const prompt = `Explain this topic in simple words: ${topic.title}`;
    // This would integrate with your existing ElevenLabs widget
    console.log('Voice prompt:', prompt);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: topic.title,
          text: topic.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/learn">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Link>
        </Button>
      </div>

      <article className="space-y-6">
        <header className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {topic.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {topic.summary}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Trimester {topic.trimester}
            </Badge>
          </div>

          {topic.tags && topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topic.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-gray max-w-none">
              <div 
                className="whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleVoicePrompt} className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Talk to AI about this
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Related Topics
          </h3>
          <p className="text-gray-600">
            More educational content for your trimester is coming soon.
          </p>
        </div>
      </article>

      <LegalNote />
    </div>
  );
}

export async function generateStaticParams() {
  const supabase = createClient();
  
  const { data: topics } = await supabase
    .from('education_topics')
    .select('slug');

  return topics?.map((topic) => ({
    slug: topic.slug,
  })) || [];
}
