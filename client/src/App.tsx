import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Upload from "@/pages/upload";
import Viewer from "@/pages/viewer";
import Compare from "@/pages/compare";
import Header from "@/components/header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Upload} />
      <Route path="/viewer/:fileId" component={Viewer} />
      <Route path="/compare/:fileId/:resultId" component={Compare} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
          <Header />
          <div className="flex-1">
            <Router />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
