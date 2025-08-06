import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import FacilityDashboard from "@/pages/FacilityDashboard";
import MachineDetail from "@/pages/MachineDetail";
import MachineLocator from "@/pages/MachineLocator";
import AdminAnalytics from "@/pages/AdminAnalytics";
import ThemeShowcase from "@/pages/ThemeShowcase";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="bg-bg-primary text-text-primary min-h-screen">
      <Navigation />
      <Switch>
        <Route path="/" component={FacilityDashboard} />
        <Route path="/machine/:id" component={MachineDetail} />
        <Route path="/locator" component={MachineLocator} />
        <Route path="/analytics" component={AdminAnalytics} />
        <Route path="/themes" component={ThemeShowcase} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
