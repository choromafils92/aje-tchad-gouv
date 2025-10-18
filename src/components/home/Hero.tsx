import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import drapeauTchad from "@/assets/drapeau-tchad.png";
import armoirieTchad from "@/assets/armoirie-tchad.png";
import logoAje from "@/assets/logo-arrondi-vf.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-gradient-to-br from-primary to-accent text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                  {t("hero.title")}
                </h1>
                <p className="text-base md:text-lg opacity-90 uppercase tracking-wide mt-2">
                  {t("hero.tagline")}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-base md:text-lg lg:text-xl leading-relaxed opacity-95">
                {t("hero.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-primary hover:text-primary"
                >
                  {t("hero.discoverBtn")}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  {t("hero.textsBtn")}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-full h-96 bg-primary-foreground/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="text-center space-y-6 px-4">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold opacity-90">
                      {t("hero.republic")}
                    </h3>
                    <p className="text-base opacity-75 font-medium">
                      {t("hero.motto")}
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-6">
                    <img 
                      src={drapeauTchad} 
                      alt="Drapeau du Tchad"
                      className="w-28 h-20 object-cover rounded shadow-md"
                    />
                    <img 
                      src={armoirieTchad} 
                      alt="Armoirie du Tchad"
                      className="w-28 h-28 object-contain"
                    />
                    <img 
                      src={logoAje} 
                      alt="Logo AJE"
                      className="w-28 h-28 object-contain"
                    />
                  </div>
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