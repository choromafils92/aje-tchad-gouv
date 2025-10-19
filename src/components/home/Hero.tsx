import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import drapeauTchad from "@/assets/drapeau-tchad.png";
import armoirieTchad from "@/assets/armoirie-tchad.png";
import logoAje from "@/assets/logo-aje-final.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState({
    title: "Agence Judiciaire de l'État",
    tagline: "Conseiller-Défendre-Protéger",
    description: "L'organe officiel chargé de défendre et représenter l'État du Tchad dans toutes les affaires juridiques et contentieuses."
  });

  useEffect(() => {
    fetchHeroContent();
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
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed opacity-95 text-center">
                    {heroContent.description}
                  </p>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-center ml-8">
                      {heroContent.title}
                    </h1>
                    <p className="text-base md:text-lg opacity-90 uppercase tracking-wide text-center">
                      {heroContent.tagline}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
              
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
              </>
            )}
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
