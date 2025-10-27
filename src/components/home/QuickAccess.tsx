import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, HelpCircle, Send, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const QuickAccess = () => {
  const quickLinks = [
    {
      icon: BookOpen,
      title: "Textes fondamentaux",
      description: "Consultez les lois, décrets et conventions qui régissent l'action de l'AJE",
      action: "Consulter",
      link: "/textes",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: Download,
      title: "Modèles de saisine",
      description: "Téléchargez les formulaires types pour vos demandes d'avis juridique",
      action: "Télécharger",
      link: "/modeles",
      color: "bg-accent/10 text-accent"
    },
    {
      icon: HelpCircle,
      title: "FAQ Juridique",
      description: "Trouvez rapidement les réponses aux questions les plus fréquentes",
      action: "Parcourir",
      link: "/textes/faq",
      color: "bg-secondary/50 text-foreground"
    },
    {
      icon: Send,
      title: "Demande d'avis",
      description: "Soumettez votre demande d'avis juridique (réservé aux administrations)",
      action: "Demander",
      link: "/services/demande-avis",
      color: "bg-primary/10 text-primary"
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Accès rapide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les ressources et services dont vous avez besoin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full ${link.color} mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg text-primary">
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <CardDescription className="text-foreground/80 leading-relaxed text-sm">
                    {link.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-accent hover:text-accent-foreground hover:bg-accent group w-full"
                    asChild
                  >
                    <Link to={link.link}>
                      {link.action}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Workflow Section */}
        <div className="mt-16 p-8 bg-secondary rounded-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary mb-3">
              Comment l'AJE intervient-elle ?
            </h3>
            <p className="text-muted-foreground">
              Schéma simplifié du processus d'intervention de l'Agence Judiciaire de l'État
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-semibold text-primary">Administration</h4>
              <p className="text-sm text-muted-foreground">Saisit l'AJE</p>
            </div>

            <ArrowRight className="h-6 w-6 text-accent rotate-90 lg:rotate-0" />

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-semibold text-primary">AJE</h4>
              <p className="text-sm text-muted-foreground">Analyse et conseille</p>
            </div>

            <ArrowRight className="h-6 w-6 text-accent rotate-90 lg:rotate-0" />

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-semibold text-primary">Juridiction</h4>
              <p className="text-sm text-muted-foreground">Rend sa décision</p>
            </div>

            <ArrowRight className="h-6 w-6 text-accent rotate-90 lg:rotate-0" />

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-semibold text-primary">Exécution</h4>
              <p className="text-sm text-muted-foreground">Suivi et mise en œuvre</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;