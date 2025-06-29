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

import { AuthProvider } from "./services/auth";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import CreateItem from "./pages/CreateItem";

const queryClient = new QueryClient();

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

                <Route path="/login" element={<Login />} />

                {/* need auth */}
                <Route
                  path="/item/create"
                  element={
                    <ProtectedRoute>
                      <CreateItem />
                    </ProtectedRoute>
                  }
                />

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
