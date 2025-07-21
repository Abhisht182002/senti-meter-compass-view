import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SentimentCards } from "@/components/SentimentCards";
import { ComplaintsTable } from "@/components/ComplaintsTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <DashboardHeader
              title="Dashboard"
              subtitle="Monitor and manage all customer complaints with real-time sentiment analysis."
            />
            
            <SentimentCards />
            
            <ComplaintsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
