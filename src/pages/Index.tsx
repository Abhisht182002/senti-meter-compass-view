
import { TopNavigation } from "@/components/TopNavigation";
import { SentimentCards } from "@/components/SentimentCards";
import { SentimentChart } from "@/components/SentimentChart";
import { ComplaintsTable } from "@/components/ComplaintsTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage all customer complaints with real-time sentiment analysis.
            </p>
          </div>
          
          <SentimentCards />
          
          <SentimentChart />
          
          <ComplaintsTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
