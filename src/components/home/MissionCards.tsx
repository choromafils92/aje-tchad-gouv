import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Users, FileText, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const MissionCards = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const missions = [
    {
      icon: Scale,
      title: "Représentation juridique et judiciaire",
      description: "Plaider pour l'État, en demande comme en défense, devant juridictions nationales, internationales et arbitrales.",
      link: "/missions#representation",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Conseil et assistance juridique",
      description: "Avis juridiques, prévention des litiges, sécurisation des contrats et conventions publiques.",
      link: "/missions#conseil",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "Recouvrement de créance contentieuse",
      description: "Assurer le recouvrement effectif des créances de l'État par des actions contentieuses et suivi rigoureux des procédures d'exécution.",
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
            Nos missions principales
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            L'AJE exerce ses responsabilités à travers les domaines d'intervention complémentaires pour servir l'État et ses administrations.
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
                    <a href={mission.link}>
                      En savoir plus
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Découvrir toutes nos missions
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionCards;