import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import drapeauTchad from "@/assets/drapeau-tchad.png";
import armoirieTchad from "@/assets/armoirie-tchad.png";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-accent text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
                  Agence Judiciaire de l'État
                </h1>
                <p className="text-lg opacity-90 uppercase tracking-wide mt-2">
                  Justice – Équité – Honneur
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg lg:text-xl leading-relaxed opacity-95">
                L'organe officiel chargé de défendre et représenter l'État du Tchad dans toutes les affaires juridiques et contentieuses, d'assister les administrations par le conseil juridique, et d'assurer la gestion centralisée du contentieux de l'État.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-primary hover:text-primary"
                >
                  Découvrir nos missions
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Consulter les textes
                </Button>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-full h-96 bg-primary-foreground/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <img 
                      src={drapeauTchad} 
                      alt="Drapeau du Tchad"
                      className="w-16 h-12 object-cover rounded shadow-md"
                    />
                    <img 
                      src={armoirieTchad} 
                      alt="Armoirie du Tchad"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold opacity-90">
                    République du Tchad
                  </h3>
                  <p className="text-sm opacity-75 font-medium">
                    Unité • Travail • Progrès
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;