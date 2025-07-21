import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EmailThread {
  thread_id: string;
  created_at: string;
  thread_sentiment: string;
  complaint_status: string;
}

interface Email {
  email_id: string;
  created_at: string;
  user: string;
  email_content: string;
  category: string;
  sub_class: string;
  department: string;
  thread_id: string;
}

const getSentimentBadge = (sentiment: string) => {
  switch (sentiment?.toLowerCase()) {
    case "positive":
      return <Badge className="bg-success text-success-foreground">Positive</Badge>;
    case "negative":
      return <Badge className="bg-destructive text-destructive-foreground">Negative</Badge>;
    case "neutral":
      return <Badge className="bg-warning text-warning-foreground">Neutral</Badge>;
    default:
      return <Badge variant="outline">{sentiment || "Unknown"}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return <Badge variant="destructive">Open</Badge>;
    case "resolved":
      return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
    case "pending":
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    default:
      return <Badge variant="outline">{status || "Unknown"}</Badge>;
  }
};

const getEmotionWithEmoji = (emotion: string) => {
  const emotionMap: Record<string, string> = {
    anger: '😠',
    angry: '😠',
    joy: '😊',
    happy: '😊',
    happiness: '😊',
    sad: '😢',
    sadness: '😢',
    fear: '😨',
    scared: '😨',
    surprise: '😲',
    surprised: '😲',
    disgust: '🤢',
    disgusted: '🤢',
    love: '❤️',
    excited: '🤩',
    excitement: '🤩',
    frustrated: '😤',
    frustration: '😤',
    disappointed: '😞',
    disappointment: '😞',
    confused: '😕',
    confusion: '😕',
    worried: '😟',
    worry: '😟',
    anxious: '😰',
    anxiety: '😰',
    calm: '😌',
    peaceful: '😌',
    grateful: '🙏',
    gratitude: '🙏',
    annoyed: '😒',
    irritated: '😒',
    bored: '😴',
    tired: '😴',
    neutral: '😐'
  };

  if (!emotion) return "N/A";
  
  const emoji = emotionMap[emotion.toLowerCase()] || '😐';
  return `${emoji} ${emotion}`;
};

export const ComplaintsTable = () => {
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [emails, setEmails] = useState<Record<string, Email[]>>({});
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('email_thread')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailsForThread = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('Email')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(prev => ({ ...prev, [threadId]: data || [] }));
    } catch (error) {
      console.error('Error fetching emails for thread:', error);
    }
  };

  const toggleThreadExpansion = async (threadId: string) => {
    const newExpandedThreads = new Set(expandedThreads);
    
    if (expandedThreads.has(threadId)) {
      newExpandedThreads.delete(threadId);
    } else {
      newExpandedThreads.add(threadId);
      // Fetch emails for this thread if not already loaded
      if (!emails[threadId]) {
        await fetchEmailsForThread(threadId);
      }
    }
    
    setExpandedThreads(newExpandedThreads);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg">Customer Complaints</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search complaints..."
                className="pl-10 w-full"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2 shrink-0" />
                <SelectValue placeholder="Filter by Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {threads.map((thread) => (
            <div key={thread.thread_id} className="border border-border rounded-lg p-4 bg-card">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Thread ID</p>
                    <p className="font-mono text-sm">{thread.thread_id}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleThreadExpansion(thread.thread_id)}
                    className="bg-primary text-primary-foreground text-xs px-2"
                  >
                    {expandedThreads.has(thread.thread_id) ? (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-3 w-3 mr-1" />
                        View
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Created</p>
                    <p>{formatDate(thread.created_at)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Status</p>
                    <div className="mt-1">{getStatusBadge(thread.complaint_status)}</div>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-muted-foreground text-sm">Sentiment</p>
                  <div className="mt-1">{getSentimentBadge(thread.thread_sentiment)}</div>
                </div>

                {expandedThreads.has(thread.thread_id) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-medium mb-3 text-sm">Related Emails</h4>
                    {emails[thread.thread_id]?.length > 0 ? (
                      <div className="space-y-3">
                        {emails[thread.thread_id].map((email) => (
                          <div key={email.email_id} className="border border-border rounded p-3 bg-muted/20">
                            <div className="space-y-2 text-xs">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="font-medium text-muted-foreground">Sent:</span>
                                  <div className="text-xs">{formatDateTime(email.created_at)}</div>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">User:</span>
                                  <div>{email.user || "N/A"}</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="font-medium text-muted-foreground">Sentiment:</span>
                                  <div className="mt-1">{getSentimentBadge(email.category)}</div>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Emotion:</span>
                                  <div>{getEmotionWithEmoji(email.sub_class)}</div>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Department:</span>
                                <div>{email.department || "N/A"}</div>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Content:</span>
                                <div className="mt-1 text-xs leading-relaxed">{email.email_content || "No content"}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-xs">No emails found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Thread ID</TableHead>
                  <TableHead className="min-w-[120px]">Created Time</TableHead>
                  <TableHead className="min-w-[100px]">Sentiment</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {threads.map((thread) => (
                  <>
                    <TableRow key={thread.thread_id} className="hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">{thread.thread_id}</TableCell>
                      <TableCell>{formatDate(thread.created_at)}</TableCell>
                      <TableCell>{getSentimentBadge(thread.thread_sentiment)}</TableCell>
                      <TableCell>{getStatusBadge(thread.complaint_status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleThreadExpansion(thread.thread_id)}
                          className="bg-primary text-primary-foreground"
                        >
                          {expandedThreads.has(thread.thread_id) ? (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-4 w-4 mr-1" />
                              View More
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedThreads.has(thread.thread_id) && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-muted/20 p-0">
                          <div className="p-4">
                            <h4 className="font-medium mb-3">Related Emails</h4>
                            {emails[thread.thread_id]?.length > 0 ? (
                              <div className="space-y-3">
                                {emails[thread.thread_id].map((email) => (
                                  <div key={email.email_id} className="border border-border rounded-lg p-4 bg-background">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium text-muted-foreground">Email Sent Time:</span>
                                        <div className="text-xs mt-1">{formatDateTime(email.created_at)}</div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">User:</span>
                                        <div>{email.user || "N/A"}</div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">Email Sentiment:</span>
                                        <div className="mt-1">{getSentimentBadge(email.category)}</div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">Emotion:</span>
                                        <div>{getEmotionWithEmoji(email.sub_class)}</div>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">Department:</span>
                                        <div>{email.department || "N/A"}</div>
                                      </div>
                                    </div>
                                    <div className="mt-3">
                                      <span className="font-medium text-muted-foreground">Email Content:</span>
                                      <div className="mt-1 text-sm leading-relaxed">{email.email_content || "No content available"}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-muted-foreground text-sm">No emails found for this thread.</div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-border gap-4">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {threads.length} of {threads.length} threads
          </p>
          <div className="flex items-center space-x-2 order-1 sm:order-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};