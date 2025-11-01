import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Users, FileText, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MissionCards = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();
  
  const missions = [
    {
      icon: Scale,
      title: t("home.missions.representation.title"),
      description: t("home.missions.representation.description"),
      link: "/missions#representation",
      color: "text-accent"
    },
    {
      icon: Users,
      title: t("home.missions.conseil.title"),
      description: t("home.missions.conseil.description"),
      link: "/missions#conseil",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: t("home.missions.contentieux.title"),
      description: t("home.missions.contentieux.description"),
      link: "/missions#contentieux",
      color: "text-accent"
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            {t("home.missions.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.missions.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missions.map((mission, index) => {
            const IconComponent = mission.icon;
            const delay = index * 150;
            return (
              <Card 
                key={index} 
                className={`group hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${mission.color}`} />
                  </div>
                  <CardTitle className="text-xl text-primary">
                    {mission.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <CardDescription className="text-foreground/80 leading-relaxed">
                    {mission.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-accent hover:text-accent-foreground hover:bg-accent group"
                    asChild
                  >
                    <Link to={mission.link}>
                      {t("home.missions.learnMore")}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link to="/missions">
              {t("home.missions.discoverAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionCards;