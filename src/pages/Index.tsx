import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SentimentCards } from "@/components/SentimentCards";
import { SentimentChart } from "@/components/SentimentChart";
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="lg:col-span-1">
                <SentimentChart />
              </div>
              <div className="lg:col-span-2">
                <ComplaintsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
