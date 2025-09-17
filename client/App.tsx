import "./global.css";
import AlumniStories from "@/pages/AlumniStories";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Directory from "./pages/Directory";
import Events from "./pages/Events";
import Forum from "./pages/Forum";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import AlumniLayout from "@/components/layout/AlumniLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Profile from "./pages/Profile";
import OtherProfile from './pages/OtherProfiles';
import EventRegistration from "./pages/EventRegistration";
import Leaderboard from "./pages/Leaderboard";
import "./global.css";








import BecomeMentor from "./pages/BecomeMentor";
import MentorDashboard from "./pages/MentorDashboard";






const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route
            element={
              <ProtectedRoute>
                <AlumniLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Index />} />
            <Route path="directory" element={<Directory />} />
            <Route path="events" element={<Events />} />
            <Route path="forum" element={<Forum />} />
            <Route path="profile" element={<Profile />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="/profile/:name" element={<OtherProfile />} />
            <Route path="/profile/me" element={<Profile />} />
            <Route path="/alumni-stories" element={<AlumniStories />} />
            <Route path="/become-mentor" element={<BecomeMentor />} />
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />



            <Route path="settings" element={<Settings />} />
            <Route path="/events/register/:eventId" element={<EventRegistration />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
// Reuse an existing root if HMR or repeated imports occur to avoid calling createRoot twice.
if (!(window as any).__REACT_ROOT__) {
  (window as any).__REACT_ROOT__ = createRoot(container);
}
(window as any).__REACT_ROOT__.render(<App />);


