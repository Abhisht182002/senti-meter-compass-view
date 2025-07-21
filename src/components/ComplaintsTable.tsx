import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";

interface Complaint {
  threadId: string;
  createdTime: string;
  sentiment: "positive" | "negative" | "neutral";
  status: "open" | "resolved" | "pending";
  emailSentTime: string;
  user: string;
  emailContent: string;
  emailSentiment: "positive" | "negative" | "neutral";
  emotion: string;
  department: string;
}

const mockComplaints: Complaint[] = [
  {
    threadId: "CPL001",
    createdTime: "2024-07-20",
    sentiment: "negative",
    status: "open",
    emailSentTime: "2024-07-20 6:30 PM",
    user: "Sanyasi Sahu",
    emailContent: "Food was delivered late and cold. Delivery partner was rude.",
    emailSentiment: "positive",
    emotion: "Angry",
    department: "Operation"
  },
  {
    threadId: "CPL002",
    createdTime: "2024-07-20", 
    sentiment: "positive",
    status: "resolved",
    emailSentTime: "2024-07-23 9:36 AM",
    user: "Abhilash Bose",
    emailContent: "I was charged twice for my order. Payment failed but money was deducted.",
    emailSentiment: "negative", 
    emotion: "Confused",
    department: "Finance"
  },
  {
    threadId: "CPL003",
    createdTime: "2024-07-20",
    sentiment: "negative", 
    status: "open",
    emailSentTime: "2024-07-23 7:30 PM",
    user: "Sanyasi Sahu",
    emailContent: "App keeps crashing whenever I try to reorder. Please fix this bug",
    emailSentiment: "neutral",
    emotion: "Delight",
    department: "Technical"
  },
  {
    threadId: "CPL004",
    createdTime: "2024-07-20",
    sentiment: "neutral",
    status: "pending", 
    emailSentTime: "",
    user: "",
    emailContent: "",
    emailSentiment: "neutral",
    emotion: "",
    department: ""
  },
  {
    threadId: "CPL005",
    createdTime: "2024-07-20",
    sentiment: "negative",
    status: "resolved",
    emailSentTime: "",
    user: "",
    emailContent: "",
    emailSentiment: "neutral",
    emotion: "",
    department: ""
  }
];

const getSentimentBadge = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <Badge className="bg-success text-success-foreground">Positive</Badge>;
    case "negative":
      return <Badge className="bg-destructive text-destructive-foreground">Negative</Badge>;
    case "neutral":
      return <Badge className="bg-neutral text-neutral-foreground">Neutral</Badge>;
    default:
      return <Badge variant="outline">{sentiment}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge variant="destructive">Open</Badge>;
    case "resolved":
      return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
    case "pending":
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const ComplaintsTable = () => {
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
                <TableHead>Email Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockComplaints.map((complaint) => (
                <TableRow key={complaint.threadId} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{complaint.threadId}</TableCell>
                  <TableCell>{complaint.createdTime}</TableCell>
                  <TableCell>{getSentimentBadge(complaint.sentiment)}</TableCell>
                  <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                  <TableCell>
                    {complaint.emailContent ? (
                      <div className="max-w-xs truncate text-muted-foreground">
                        {complaint.emailContent}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No details</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      View More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing 13 of 13 complaints.
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