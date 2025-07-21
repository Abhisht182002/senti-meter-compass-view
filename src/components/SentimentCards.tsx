import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <SentimentCard
        title="Total Complaints"
        value={113}
        description="Overall complaints received"
        variant="total"
      />
      <SentimentCard
        title="Positive Sentiment"
        value={4}
        description="Customers with positive feedback"
        variant="positive"
      />
      <SentimentCard
        title="Neutral Sentiment"
        value={16}
        description="Customers with neutral feedback"
        variant="neutral"
      />
      <SentimentCard
        title="Negative Sentiment"
        value={93}
        description="Customers with negative feedback"
        variant="negative"
      />
    </div>
  );
};