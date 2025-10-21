import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import drapeauTchad from "@/assets/drapeau-tchad.png";
import armoirieTchad from "@/assets/armoirie-tchad.png";
import logoAje from "@/assets/logo-aje-final.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useParallax } from "@/hooks/use-parallax";

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const parallaxOffset = useParallax(0.3);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [heroContent, setHeroContent] = useState({
    title: "Agence Judiciaire de l'État",
    tagline: "Conseiller-Défendre-Protéger",
    description: "L'organe officiel chargé de défendre et représenter l'État du Tchad dans toutes les affaires juridictionnels et contentieuses, d'assister les administrations par le conseil, et d'assurer la gestion centralisée du contentieux de l'État."
  });

  useEffect(() => {
    fetchHeroContent();
    
    // Mise à jour de l'heure chaque seconde
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("key, value")
        .in("key", ["hero_title", "hero_tagline", "hero_description"]);

      if (error) throw error;

      const newContent = { ...heroContent };
      data?.forEach((setting: any) => {
        switch (setting.key) {
          case "hero_title":
            newContent.title = setting.value as string;
            break;
          case "hero_tagline":
            newContent.tagline = setting.value as string;
            break;
          case "hero_description":
            newContent.description = setting.value as string;
            break;
        }
      });
      setHeroContent(newContent);
    } catch (error) {
      console.error("Error fetching hero content:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="relative bg-gradient-to-br from-primary to-accent text-primary-foreground overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/10 parallax" 
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      ></div>
      <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col items-center space-y-2">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight text-center ml-8 text-white [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%),_0_4px_20px_rgb(0_0_0_/_60%)] animate-fade-down">
                      {heroContent.title}
                    </h1>
                    <p className="text-xs md:text-sm font-normal uppercase tracking-wide text-center text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%),_0_4px_16px_rgb(0_0_0_/_60%)] animate-fade-down [animation-delay:200ms]">
                      {heroContent.tagline}
                    </p>
                  </div>
                  
                  <p className="text-base md:text-lg lg:text-xl font-semibold leading-relaxed text-center text-white animate-fade-up [animation-delay:400ms]">
                    {heroContent.description}
                  </p>
                </div>
                
                <div className="space-y-6">
              
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="text-primary hover:text-primary min-h-[44px] min-w-[44px] px-6 py-3"
                      onClick={() => navigate('/missions')}
                    >
                      {t("hero.discoverBtn")}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary min-h-[44px] min-w-[44px] px-6 py-3"
                      onClick={() => navigate('/textes')}
                    >
                      {t("hero.textsBtn")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="hidden lg:block animate-slide-in-right">
            <div className="relative">
              <div className="w-full h-96 bg-primary-foreground/10 rounded-lg flex items-center justify-center backdrop-blur-sm hover-lift">
                  <div className="text-center space-y-6 px-4">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-extrabold text-white [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%),_0_4px_20px_rgb(0_0_0_/_60%)]">
                        {t("hero.republic")}
                      </h3>
                      <p className="text-base font-extrabold text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%),_0_4px_16px_rgb(0_0_0_/_60%)]">
                        {t("hero.motto")}
                      </p>
                    </div>
                  <div className="space-y-4">
                    <div className="flex items-end justify-center space-x-6">
                      <img 
                        src={drapeauTchad} 
                        alt="Drapeau du Tchad"
                        className="w-32 h-44 object-contain rounded shadow-md hover-scale animate-bounce-in"
                      />
                      <img 
                        src={armoirieTchad} 
                        alt="Armoirie du Tchad"
                        className="w-32 h-32 object-contain hover-scale animate-bounce-in [animation-delay:200ms]"
                      />
                      <img 
                        src={logoAje} 
                        alt="Logo AJE"
                        className="w-32 h-32 object-contain hover-scale animate-bounce-in [animation-delay:400ms]"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-extrabold text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%),_0_4px_16px_rgb(0_0_0_/_60%)] font-nagasaki">
                        {currentDateTime.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit' 
                        })}
                      </p>
                      <p className="text-sm font-bold text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_80%),_0_4px_12px_rgb(0_0_0_/_60%)] font-nagasaki">
                        {currentDateTime.toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
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
