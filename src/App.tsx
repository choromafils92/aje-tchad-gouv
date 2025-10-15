import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Missions from "./pages/Missions";
import Textes from "./pages/Textes";
import Actualites from "./pages/Actualites";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Contentieux from "./pages/Contentieux";
import FAQ from "./pages/FAQ";
import DemandeAvis from "./pages/DemandeAvis";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/textes" element={<Textes />} />
              <Route path="/textes/faq" element={<FAQ />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/demande-avis" element={<DemandeAvis />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contentieux" element={<Contentieux />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
