import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SentimentCardProps {
  title: string;
  value: number;
  description: string;
  variant: "total" | "positive" | "neutral" | "negative";
}

const SentimentCard = ({ title, value, description, variant }: SentimentCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "total":
        return "border-primary/20 bg-primary/5";
      case "positive": 
        return "border-success/20 bg-success/5";
      case "neutral":
        return "border-warning/20 bg-warning/5";
      case "negative":
        return "border-destructive/20 bg-destructive/5";
      default:
        return "";
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case "total":
        return "text-primary";
      case "positive":
        return "text-success";
      case "neutral": 
        return "text-warning";
      case "negative":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className={`${getVariantStyles()} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${getValueColor()} mb-1`}>
          {value}
        </div>
        <CardDescription className="text-xs">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export const SentimentCards = () => {
  const [sentimentData, setSentimentData] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const fetchSentimentData = async () => {
    try {
      const { data: emails, error } = await supabase
        .from('Email')
        .select('category');

      if (error) throw error;

      const total = emails?.length || 0;
      const positive = emails?.filter(email => email.category?.toLowerCase() === 'positive').length || 0;
      const neutral = emails?.filter(email => email.category?.toLowerCase() === 'neutral').length || 0;
      const negative = emails?.filter(email => email.category?.toLowerCase() === 'negative').length || 0;

      setSentimentData({ total, positive, neutral, negative });
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <SentimentCard
        title="Total Complaints"
        value={sentimentData.total}
        description="Overall complaints received"
        variant="total"
      />
      <SentimentCard
        title="Positive Sentiment"
        value={sentimentData.positive}
        description="Customers with positive feedback"
        variant="positive"
      />
      <SentimentCard
        title="Neutral Sentiment"
        value={sentimentData.neutral}
        description="Customers with neutral feedback"
        variant="neutral"
      />
      <SentimentCard
        title="Negative Sentiment"
        value={sentimentData.negative}
        description="Customers with negative feedback"
        variant="negative"
      />
    </div>
  );
};