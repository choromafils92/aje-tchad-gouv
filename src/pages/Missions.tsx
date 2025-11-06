import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Users, FileText, ArrowRight, CheckCircle, Shield, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import type { MissionPrincipale } from "@/types/missions";

interface MissionData {
  id: string;
  code: string;
  title: string;
  description: string;
  content: string;
  details: string[];
  icon_name: string;
  color_class: string;
  ordre: number;
}

const iconMap: Record<string, any> = {
  Scale,
  Users,
  FileText
};

const Missions = () => {
  const { t, language } = useLanguage();
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, [language]);

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('missions_principales' as any)
        .select('*')
        .eq('published', true)
        .order('ordre');

      if (error) throw error;

      // Map data based on current language
      const missionsData = (data || []) as any[];
      const mappedMissions = missionsData.map((mission: any) => ({
        id: mission.code,
        code: mission.code,
        title: mission[`title_${language}`] || mission.title_fr,
        description: mission[`description_${language}`] || mission.description_fr,
        content: mission[`content_${language}`] || mission.content_fr,
        details: mission[`details_${language}`] || mission.details_fr || [],
        icon_name: mission.icon_name,
        color_class: mission.color_class,
        ordre: mission.ordre
      }));

      setMissions(mappedMissions);
    } catch (error: any) {
      console.error('Error fetching missions:', error);
      toast.error(language === 'fr' ? 'Erreur lors du chargement des missions' : 
                  language === 'ar' ? 'خطأ في تحميل المهام' : 'Error loading missions');
    } finally {
      setLoading(false);
    }
  };

  const keyFigures = [
    { number: "2500+", label: t("missions.casesProcessed") },
    { number: "85%", label: t("missions.successRate") },
    { number: "150+", label: t("missions.administrations") },
    { number: "24h", label: t("missions.responseTime") }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
                {t("missions.title")}
              </h1>
              <p className="text-xl lg:text-2xl font-bold mb-8 text-white drop-shadow-md">
                {t("missions.subtitle")}
              </p>
              <div className="flex items-center justify-center space-x-2 text-lg">
                <Shield className="h-6 w-6" />
                <span>{t("hero.tagline")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Figures */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFigures.map((figure, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {figure.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {figure.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Missions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                {t("missions.detailsTitle")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t("missions.detailsSubtitle")}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{language === 'fr' ? 'Chargement...' : language === 'ar' ? 'جار التحميل...' : 'Loading...'}</p>
              </div>
            ) : missions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {language === 'fr' ? 'Aucune mission disponible' : language === 'ar' ? 'لا توجد مهام متاحة' : 'No missions available'}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {missions.map((mission) => {
                  const IconComponent = iconMap[mission.icon_name] || Scale;
                  return (
                    <Card key={mission.id} id={mission.id} className="overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        <div className={`${mission.color_class} p-8 flex flex-col justify-center`}>
                          <div className="text-center lg:text-left">
                            <IconComponent className="h-16 w-16 mx-auto lg:mx-0 mb-4" />
                            <h3 className="text-2xl font-bold mb-4">
                              {mission.title}
                            </h3>
                            <p className="text-lg opacity-90">
                              {mission.description}
                            </p>
                          </div>
                        </div>
                        <div className="lg:col-span-2 p-8">
                          {/* HTML Content */}
                          {mission.content && (
                            <div 
                              className="prose prose-sm max-w-none mb-6"
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mission.content) }}
                              dir={language === 'ar' ? 'rtl' : 'ltr'}
                            />
                          )}
                          
                          {/* Intervention Details */}
                          {mission.details && mission.details.length > 0 && (
                            <>
                              <h4 className="text-xl font-semibold text-primary mb-6">
                                {language === 'fr' ? "Domaines d'intervention" :
                                 language === 'ar' ? 'مجالات التدخل' :
                                 'Areas of Intervention'}
                              </h4>
                              <div className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                {mission.details.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                                    <span className="text-foreground/80">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Process Flow */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                {t("missions.intervention.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("missions.intervention.subtitle")}
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <Card className="text-center p-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{t("missions.intervention.step1.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("missions.intervention.step1.description")}
                  </p>
                </Card>

                <ArrowRight className="h-8 w-8 text-accent mx-auto rotate-90 lg:rotate-0" />

                <Card className="text-center p-6">
                  <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{t("missions.intervention.step2.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("missions.intervention.step2.description")}
                  </p>
                </Card>

                <ArrowRight className="h-8 w-8 text-accent mx-auto rotate-90 lg:rotate-0" />

                <Card className="text-center p-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{t("missions.intervention.step3.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("missions.intervention.step3.description")}
                  </p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <Card className="text-center p-6">
                  <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{t("missions.intervention.step4.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("missions.intervention.step4.description")}
                  </p>
                </Card>

                <Card className="text-center p-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    5
                  </div>
                  <h3 className="font-semibold text-primary mb-2">Exécution</h3>
                  <p className="text-sm text-muted-foreground">
                    Mise en œuvre des décisions favorables à l'État
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-4">
                {t("missions.cta.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("missions.cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/services/demande-avis">
                    {t("missions.cta.button")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/textes/faq">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {t("missions.consultFAQ")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Missions;
