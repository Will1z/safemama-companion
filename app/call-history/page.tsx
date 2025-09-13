'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Mail, MessageSquare, User, Phone } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { safeMessage } from '@/lib/http/safeError';

interface CallHistoryItem {
  id: string;
  session_id: string;
  summary: string;
  patient_name?: string;
  patient_phone?: string;
  recipient_email?: string;
  whatsapp_number?: string;
  created_at: string;
  updated_at: string;
}

interface CallHistoryResponse {
  ok: boolean;
  data?: CallHistoryItem[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  message?: string;
  error?: string;
}

export default function CallHistoryPage() {
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });

  const fetchCallHistory = async (offset = 0, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/call-history?limit=${pagination.limit}&offset=${offset}`);
      const data: CallHistoryResponse = await response.json();

      if (!data.ok) {
        throw new Error(safeMessage(data, 'Failed to fetch call history'));
      }

      if (append) {
        setCallHistory(prev => [...prev, ...(data.data || [])]);
      } else {
        setCallHistory(data.data || []);
      }
      
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchCallHistory(pagination.offset + pagination.limit, true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, 'MMM dd, yyyy \'at\' h:mm a')
    };
  };

  if (loading && callHistory.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Call History</h1>
            <p className="text-gray-600">View summaries of your voice conversations with SafeMama</p>
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Call History</h1>
            <p className="text-gray-600">View summaries of your voice conversations with SafeMama</p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => fetchCallHistory()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Call History</h1>
          <p className="text-gray-600">
            View summaries of your voice conversations with SafeMama
            {pagination.total > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({pagination.total} {pagination.total === 1 ? 'conversation' : 'conversations'})
              </span>
            )}
          </p>
        </div>

        {callHistory.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 mb-4">
                  Start a voice conversation with SafeMama to see your call history here.
                </p>
                <Button asChild>
                  <a href="/chat">Start Conversation</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {callHistory.map((call) => {
              const dateInfo = formatDate(call.created_at);
              return (
                <Card key={call.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">
                          {call.patient_name || 'Voice Conversation'}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {dateInfo.relative}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span title={dateInfo.absolute}>{dateInfo.absolute}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Session: {call.session_id.slice(-8)}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {call.summary}
                        </p>
                      </div>
                      
                      {(call.recipient_email || call.whatsapp_number) && (
                        <div className="border-t pt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Sent To</h4>
                          <div className="space-y-2">
                            {call.recipient_email && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Email: {call.recipient_email}</span>
                              </div>
                            )}
                            {call.whatsapp_number && (
                              <div className="flex items-center space-x-2 text-sm">
                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">WhatsApp: {call.whatsapp_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {pagination.hasMore && (
              <div className="text-center pt-4">
                <Button 
                  onClick={loadMore} 
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
