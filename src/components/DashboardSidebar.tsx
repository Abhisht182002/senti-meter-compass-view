import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  List, 
  Monitor, 
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Complaint List", 
    href: "/complaints",
    icon: List,
  },
  {
    name: "Real-time Monitoring",
    href: "/monitoring", 
    icon: Monitor,
  },
  {
    name: "Proactive Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
];

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 p-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex h-screen bg-card border-r border-border transition-all duration-300 relative z-50",
        // Desktop sizing
        "hidden md:flex",
        collapsed ? "w-16" : "w-64",
        // Mobile positioning - slide in from left
        "md:relative md:translate-x-0",
        mobileOpen 
          ? "fixed top-0 left-0 w-64 flex md:hidden" 
          : "fixed top-0 -left-64 w-64 md:flex"
      )}>
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="text-lg font-semibold text-foreground">SentiMeter.AI</span>
              </div>
            )}
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileOpen(false);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4 md:hidden" />
              {!mobileOpen && (
                <>
                  {collapsed ? <Menu className="h-4 w-4 hidden md:block" /> : <X className="h-4 w-4 hidden md:block" />}
                </>
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )
                }
              >
                <item.icon className={cn("h-5 w-5", collapsed && "mr-0 md:mr-0", !collapsed && "mr-3")} />
                {(!collapsed || mobileOpen) && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};