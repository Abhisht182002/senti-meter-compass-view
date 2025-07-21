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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle className="text-lg">Customer Complaints</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search complaints by ID, text, or source..."
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thread ID</TableHead>
                <TableHead>Created Time</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threads.map((thread) => (
                <>
                  <TableRow key={thread.thread_id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{thread.thread_id}</TableCell>
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
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-muted-foreground">Email Sent Time:</span>
                                      <div>{formatDateTime(email.created_at)}</div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-muted-foreground">User:</span>
                                      <div>{email.user || "N/A"}</div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-muted-foreground">Email Sentiment:</span>
                                      <div>{getSentimentBadge(email.category)}</div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-muted-foreground">Emotion:</span>
                                      <div>{email.sub_class || "N/A"}</div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-muted-foreground">Department Assigned:</span>
                                      <div>{email.department || "N/A"}</div>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <span className="font-medium text-muted-foreground">Email Content:</span>
                                    <div className="mt-1 text-sm">{email.email_content || "No content available"}</div>
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
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {threads.length} of {threads.length} complaint threads.
          </p>
          <div className="flex items-center space-x-2">
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