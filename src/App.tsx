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
import ActualiteDetail from "./pages/ActualiteDetail";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Contentieux from "./pages/Contentieux";
import FAQ from "./pages/FAQ";
import DemandeAvis from "./pages/DemandeAvis";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Modeles from "./pages/Modeles";
import RendezVous from "./pages/RendezVous";
import Carrieres from "./pages/Carrieres";
import Medias from "./pages/Medias";
import MentionsLegales from "./pages/MentionsLegales";
import DonneesPersonnelles from "./pages/DonneesPersonnelles";
import Accessibilite from "./pages/Accessibilite";
import PlanDuSite from "./pages/PlanDuSite";
import RSS from "./pages/RSS";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {

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
              <Route path="/actualites/:id" element={<ActualiteDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/modeles" element={<Modeles />} />
              <Route path="/services/demande-avis" element={<DemandeAvis />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contentieux" element={<Contentieux />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contact/rendez-vous" element={<RendezVous />} />
              <Route path="/carrieres" element={<Carrieres />} />
              <Route path="/medias" element={<Medias />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/donnees-personnelles" element={<DonneesPersonnelles />} />
              <Route path="/accessibilite" element={<Accessibilite />} />
              <Route path="/plan-du-site" element={<PlanDuSite />} />
              <Route path="/rss" element={<RSS />} />
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
