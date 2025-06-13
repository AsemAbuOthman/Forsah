import { Switch, Route } from "wouter";
import { TooltipProvider } from "./ProfilePage/ui/tooltip";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";
import { createRoot } from "react-dom/client";
import "./ProfilePage.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./ProfilePage/ui/toaster";
import { useParams } from 'react-router-dom';

function ProfilePage() {

  let { id } = useParams();

  return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Switch>
            {/* <Route path="/" component={Profile} /> */}
              {id ?  <Profile DEFAULT_USER_ID={parseInt(id)}  /> : <Profile />  }
            {/* <Route component={NotFound} /> */}
          </Switch>
        </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default ProfilePage;
