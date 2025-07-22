
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface SentimentData {
  name: string;
  value: number;
  color: string;
}

interface NegativeComplaintData {
  date: string;
  count: number;
}

export const SentimentChart = () => {
  const [pieData, setPieData] = useState<SentimentData[]>([]);
  const [lineData, setLineData] = useState<NegativeComplaintData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Fetch pie chart data
      const { data: emails, error } = await supabase
        .from('Email')
        .select('category');

      if (error) throw error;

      const positive = emails?.filter(email => email.category?.toLowerCase() === 'positive').length || 0;
      const neutral = emails?.filter(email => email.category?.toLowerCase() === 'neutral').length || 0;
      const negative = emails?.filter(email => email.category?.toLowerCase() === 'negative').length || 0;

      const sentimentData = [
        { name: 'Positive', value: positive, color: '#22c55e' },
        { name: 'Neutral', value: neutral, color: '#f59e0b' },
        { name: 'Negative', value: negative, color: '#ef4444' }
      ].filter(item => item.value > 0);

      setPieData(sentimentData);

      // Fetch line chart data for last 4 days
      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

      const { data: negativeEmails, error: lineError } = await supabase
        .from('Email')
        .select('created_at')
        .eq('category', 'negative')
        .gte('created_at', fourDaysAgo.toISOString());

      if (lineError) throw lineError;

      // Group by date
      const groupedData: Record<string, number> = {};
      
      // Initialize last 4 days with 0 counts
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        groupedData[dateStr] = 0;
      }

      // Count actual data
      negativeEmails?.forEach(email => {
        const date = new Date(email.created_at);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (groupedData.hasOwnProperty(dateStr)) {
          groupedData[dateStr]++;
        }
      });

      const lineChartData = Object.entries(groupedData).map(([date, count]) => ({
        date,
        count
      }));

      setLineData(lineChartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-5 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded animate-pulse"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pieChartConfig = {
    positive: {
      label: "Positive",
      color: "#22c55e",
    },
    neutral: {
      label: "Neutral", 
      color: "#f59e0b",
    },
    negative: {
      label: "Negative",
      color: "#ef4444",
    },
  };

  const lineChartConfig = {
    count: {
      label: "Negative Complaints",
      color: "#ef4444",
    },
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-medium text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Sentiment Distribution</CardTitle>
          <CardDescription>
            Overall sentiment breakdown of all complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Negative Complaints Trend</CardTitle>
          <CardDescription>
            Daily negative complaints over the last 4 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={lineChartConfig}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelStyle={{ color: '#1e293b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
