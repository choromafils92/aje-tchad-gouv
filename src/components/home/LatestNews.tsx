import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, FileText, AlertTriangle, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const LatestNews = () => {
  // Mock data - in real app this would come from a CMS
  const news = [
    {
      id: 1,
      type: "Communiqué",
      title: "Nouvelle procédure de saisine de l'AJE pour les contrats publics",
      description: "Les administrations doivent désormais suivre la procédure simplifiée pour soumettre leurs projets de contrats à l'analyse juridique préalable.",
      date: "2024-01-15",
      urgent: false,
      icon: FileText
    },
    {
      id: 2,
      type: "Note au public",
      title: "Rappel des délais de prescription en matière de contentieux administratif",
      description: "Important rappel concernant les délais de recours gracieux et contentieux applicables aux décisions administratives.",
      date: "2024-01-10",
      urgent: true,
      icon: AlertTriangle
    },
    {
      id: 3,
      type: "Annonce",
      title: "Ouverture des consultations juridiques mensuelles",
      description: "L'AJE organise des sessions de consultation juridique pour les administrations publiques tous les premiers mardis du mois.",
      date: "2024-01-08",
      urgent: false,
      icon: Megaphone
    }
  ];

  const getTypeColor = (type: string, urgent: boolean) => {
    if (urgent) return "destructive";
    switch (type) {
      case "Communiqué": return "default";
      case "Note au public": return "secondary";
      case "Annonce": return "outline";
      default: return "default";
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Dernières publications
            </h2>
            <p className="text-lg text-muted-foreground">
              Consultez nos derniers communiqués, notes et annonces officielles
            </p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/actualites">
              Toutes les actualités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {news.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant={getTypeColor(item.type, item.urgent)} className="text-xs">
                      {item.urgent && "🔴 "}{item.type}
                    </Badge>
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg leading-snug group-hover:text-accent transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-foreground/80 leading-relaxed">
                    {item.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(item.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground hover:bg-accent" asChild>
                      <Link to="/actualites">
                        Lire plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 p-8 bg-secondary rounded-lg">
          <h3 className="text-xl font-semibold text-primary mb-3">
            Restez informé des dernières actualités
          </h3>
          <p className="text-muted-foreground mb-6">
            Abonnez-vous à notre newsletter ou suivez notre flux RSS pour ne manquer aucune publication officielle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default">
              S'abonner à la newsletter
            </Button>
            <Button variant="outline">
              Flux RSS
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;