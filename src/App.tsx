import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { OnboardingOverlay } from "./components/OnboardingOverlay";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reviews from "./pages/Reviews";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <OnboardingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <OnboardingOverlay />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
