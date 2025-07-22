import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SentimentData {
  name: string;
  value: number;
  color: string;
}

export const SentimentChart = () => {
  const [chartData, setChartData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const { data: emails, error } = await supabase
        .from('Email')
        .select('category');

      if (error) throw error;

      const positive = emails?.filter(email => email.category?.toLowerCase() === 'positive').length || 0;
      const neutral = emails?.filter(email => email.category?.toLowerCase() === 'neutral').length || 0;
      const negative = emails?.filter(email => email.category?.toLowerCase() === 'negative').length || 0;

      const data = [
        { name: 'Positive', value: positive, color: 'hsl(var(--success))' },
        { name: 'Neutral', value: neutral, color: 'hsl(var(--warning))' },
        { name: 'Negative', value: negative, color: 'hsl(var(--destructive))' }
      ].filter(item => item.value > 0); // Only show segments with data

      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    positive: {
      label: "Positive",
      color: "hsl(var(--success))",
    },
    neutral: {
      label: "Neutral", 
      color: "hsl(var(--warning))",
    },
    negative: {
      label: "Negative",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>
          Overall sentiment breakdown of all complaints
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};