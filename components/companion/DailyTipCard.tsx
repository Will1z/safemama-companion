'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { currentTrimester } from '@/lib/trimester';
import { Heart, RefreshCw } from 'lucide-react';

interface DailyTip {
  id: string;
  message: string;
  source: string;
  risk_tags: string[];
}

interface DailyTipCardProps {
  userProfile?: {
    due_date?: string;
    last_period_date?: string;
  };
  userConditions?: string[];
}

export function DailyTipCard({ userProfile, userConditions = [] }: DailyTipCardProps) {
  const [tip, setTip] = useState<DailyTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  const fetchTip = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const trimester = currentTrimester(userProfile?.due_date, userProfile?.last_period_date);
      
      // Build query for tips matching trimester and user conditions
      let query = supabase
        .from('daily_tips')
        .select('*')
        .eq('trimester', trimester)
        .eq('locale', 'en');

      // If user has conditions, try to find tips that match their risk tags
      if (userConditions.length > 0) {
        query = query.or(
          `risk_tags.cs.{${userConditions.join(',')}},risk_tags.is.null`
        );
      }

      const { data, error } = await query.limit(1).single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching tip:', error);
        return;
      }

      if (data) {
        setTip(data);
      } else {
        // Fallback to any tip for this trimester
        const { data: fallbackData } = await supabase
          .from('daily_tips')
          .select('*')
          .eq('trimester', trimester)
          .eq('locale', 'en')
          .limit(1)
          .single();
        
        if (fallbackData) {
          setTip(fallbackData);
        }
      }
    } catch (error) {
      console.error('Error fetching daily tip:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, [userProfile, userConditions]);

  const handleRefresh = () => {
    fetchTip(true);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-pink-500" />
            Daily Companion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tip) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-pink-500" />
            Daily Companion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Hi there! How are you feeling today? Take a moment to check in with yourself.
          </p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Get a tip
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-pink-500" />
          Daily Companion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            {tip.message}
          </p>
          
          {tip.source && (
            <p className="text-sm text-gray-500">
              — {tip.source}
            </p>
          )}
          
          {tip.risk_tags && tip.risk_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tip.risk_tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={refreshing}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Getting another tip...' : 'Show another tip'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
