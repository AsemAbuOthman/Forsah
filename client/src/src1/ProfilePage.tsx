import { Switch, Route } from "wouter";
import { TooltipProvider } from "./ProfilePage/ui/tooltip";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";
import { createRoot } from "react-dom/client";
import "./ProfilePage.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./ProfilePage/ui/toaster";

function ProfilePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
          <Switch>
          {/* <Route path="/" component={Profile} /> */}
            <Profile />
          {/* <Route component={NotFound} /> */}
        </Switch>
      </TooltipProvider>
    <Toaster />
  </QueryClientProvider>
  );
}

export default ProfilePage;
