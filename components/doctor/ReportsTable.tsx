'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Mail, MessageSquare } from 'lucide-react';

interface Report {
  id: string;
  session_id: string;
  user_id: string | null;
  summary: string;
  sent_email_to: string | null;
  sent_whatsapp_to: string | null;
  sent_at: string | null;
  created_at: string;
}

interface ReportsTableProps {
  reports: Report[];
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 160) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const shortenSessionId = (sessionId: string) => {
    return sessionId.substring(0, 8);
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No conversation reports found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Conversation Summaries ({reports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Created</th>
                  <th className="text-left p-3 font-medium text-gray-700">Session ID</th>
                  <th className="text-left p-3 font-medium text-gray-700">User ID</th>
                  <th className="text-left p-3 font-medium text-gray-700">Summary</th>
                  <th className="text-left p-3 font-medium text-gray-700">Email</th>
                  <th className="text-left p-3 font-medium text-gray-700">WhatsApp</th>
                  <th className="text-left p-3 font-medium text-gray-700">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">
                      {formatDateTime(report.created_at)}
                    </td>
                    <td className="p-3 text-sm font-mono text-gray-800">
                      {shortenSessionId(report.session_id)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {report.user_id || '-'}
                    </td>
                    <td className="p-3 text-sm text-gray-700 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {truncateText(report.summary)}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 flex-shrink-0"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Conversation Summary</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Session ID:</span>
                                  <p className="font-mono text-gray-600">{report.session_id}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">User ID:</span>
                                  <p className="text-gray-600">{report.user_id || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Created:</span>
                                  <p className="text-gray-600">{formatDateTime(report.created_at)}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Sent:</span>
                                  <p className="text-gray-600">
                                    {report.sent_at ? formatDateTime(report.sent_at) : 'Not sent'}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Summary:</span>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                  <p className="text-gray-800 whitespace-pre-wrap">
                                    {report.summary}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-4 text-sm">
                                {report.sent_email_to && (
                                  <div className="flex items-center gap-1 text-blue-600">
                                    <Mail className="h-4 w-4" />
                                    <span>{report.sent_email_to}</span>
                                  </div>
                                )}
                                {report.sent_whatsapp_to && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{report.sent_whatsapp_to}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {report.sent_email_to ? (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-32">
                            {report.sent_email_to}
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {report.sent_whatsapp_to ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <MessageSquare className="h-3 w-3" />
                          <span className="truncate max-w-32">
                            {report.sent_whatsapp_to}
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {report.sent_at ? formatDateTime(report.sent_at) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
