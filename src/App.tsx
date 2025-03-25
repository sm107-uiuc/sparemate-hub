
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { setupApiInterceptor } from "@/lib/api";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Cart from "./pages/Cart";
import OrderStatus from "./pages/OrderStatus";
import ApiDocs from "./pages/ApiDocs";
import NotFound from "./pages/NotFound";

// Initialize API interceptor
setupApiInterceptor();

// Setup API endpoint handler
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : input.toString();
    
    // Handle API endpoints
    if (url.includes('/api/')) {
      // Simulate API response
      return new Promise((resolve) => {
        setTimeout(() => {
          const apiKey = init?.headers && (init.headers as any)['X-API-Key'];
          
          // Check if API Key exists and is valid
          if (!apiKey) {
            resolve(new Response(JSON.stringify({ error: 'API Key is required' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            }));
            return;
          }
          
          // Handle different API endpoints
          if (url.includes('/api/cart')) {
            const method = init?.method || 'GET';
            
            if (method === 'GET') {
              resolve(new Response(JSON.stringify({ 
                items: [], 
                total: 0,
                message: 'Cart retrieved successfully' 
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }));
            } 
            else if (method === 'POST') {
              resolve(new Response(JSON.stringify({ 
                success: true, 
                message: 'Item added to cart successfully' 
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }));
            }
            else if (method === 'DELETE') {
              resolve(new Response(JSON.stringify({ 
                success: true, 
                message: 'Item removed from cart successfully' 
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }));
            }
          } else {
            // Default response for unknown API endpoints
            resolve(new Response(JSON.stringify({ error: 'Endpoint not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        }, 500);
      });
    }
    
    // Continue with original fetch for non-API requests
    return originalFetch(input, init);
  };
}

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/order-status" element={
              <ProtectedRoute>
                <OrderStatus />
              </ProtectedRoute>
            } />
            <Route path="/api-docs" element={
              <ProtectedRoute>
                <ApiDocs />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
