import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LandDetail from "./pages/LandDetail";
import BuyLand from "./pages/BuyLand";
import SellLand from "./pages/SellLand";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

import { AuthProvider, useAuthContext } from "./services/auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isInitializing } = useAuthContext();

  if (isInitializing) {
    return <div>Loading...</div>; // bisa spinner juga
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/land/:id" element={<LandDetail />} />

                {/* need auth */}
                <Route
                  path="/buy/:id"
                  element={
                    <ProtectedRoute>
                      <BuyLand />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sell"
                  element={
                    <ProtectedRoute>
                      <SellLand />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                {/* note to add my collection page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
