import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ExternalLink } from "lucide-react";

const Modeles = () => {
  const modeles = [
    {
      title: "Modèle de demande d'avis juridique",
      description: "Formulaire type pour soumettre une demande d'avis juridique à l'AJE",
      file: "/documents/modele_demande_avis_juridique.html",
      icon: FileText
    },
    {
      title: "Modèle de transaction administrative",
      description: "Template pour la rédaction d'une transaction administrative",
      file: "/documents/modele_transaction_administrative.html",
      icon: FileText
    },
    {
      title: "Modèle de clause de règlement des différends",
      description: "Clauses types pour le règlement des différends dans les contrats",
      file: "/documents/modele_clause_reglement_differends.html",
      icon: FileText
    }
  ];

  const handleDownload = (file: string, title: string) => {
    window.open(file, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              Modèles de Documents
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Téléchargez les formulaires et modèles types pour vos démarches auprès de l'AJE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {modeles.map((modele, index) => {
              const IconComponent = modele.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl text-primary">
                      {modele.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-foreground/80 leading-relaxed">
                      {modele.description}
                    </CardDescription>
                    <div className="flex gap-2">
                      <Button 
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownload(modele.file, modele.title)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ouvrir
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={modele.file} download>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-secondary/50 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Comment utiliser ces modèles ?
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Téléchargez le modèle correspondant à votre besoin</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Remplissez tous les champs requis avec attention</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Imprimez le document ou sauvegardez-le en PDF</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Transmettez-le à l'AJE selon les modalités indiquées</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Modeles;