import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-accent text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src="/src/assets/logo-aje.svg" 
                    alt="Logo AJE - Agence Judiciaire de l'État du Tchad"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                    Agence Judiciaire de l'État
                  </h1>
                  <p className="text-lg opacity-90 uppercase tracking-wide mt-2">
                    Justice – Équité – Honneur
                  </p>
                </div>
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
                  <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-12 h-12 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold opacity-90">
                    République du Tchad
                  </h3>
                  <p className="text-sm opacity-75">
                    Justice • Travail • Progrès
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