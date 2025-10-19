import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ExternalLink } from "lucide-react";

const Modeles = () => {
  const modeles = [
    {
      title: "Formulaire de demande d'avis juridique",
      description: "Modèle de formulaire pour soumettre une demande d'avis juridique à l'AJE",
      file: "/documents/modele_demande_avis_juridique.html",
      pdfFileName: "Formulaire_Demande_Avis_Juridique.pdf",
      icon: FileText
    },
    {
      title: "Modèle de clause de règlement des différends",
      description: "Clause type à intégrer dans les contrats administratifs pour le règlement des différends",
      file: "/documents/modele_clause_reglement_differends.html",
      pdfFileName: "Modele_Clause_Reglement_Differends.pdf",
      icon: FileText
    },
    {
      title: "Check-list pré-contentieuse",
      description: "Liste de vérification pour évaluer la solidité d'un dossier avant une procédure contentieuse",
      file: "/documents/checklist_pre_contentieuse.html",
      pdfFileName: "Checklist_Pre_Contentieuse.pdf",
      icon: FileText
    },
    {
      title: "Modèle de transaction administrative",
      description: "Template pour la rédaction d'une transaction administrative",
      file: "/documents/modele_transaction_administrative.html",
      pdfFileName: "Modele_Transaction_Administrative.pdf",
      icon: FileText
    },
    {
      title: "Guide des marchés publics",
      description: "Guide complet sur la réglementation des marchés publics au Tchad avec procédures et seuils",
      file: "/documents/guide_marches_publics.html",
      pdfFileName: "Guide_Marches_Publics.pdf",
      icon: FileText
    }
  ];

  const handlePreview = (file: string) => {
    // Open document in new tab for preview
    window.open(file, '_blank');
  };

  const handleDownloadPDF = (file: string, pdfFileName: string) => {
    // Open in new window and trigger print dialog
    const printWindow = window.open(file, '_blank');
    if (printWindow) {
      printWindow.document.title = pdfFileName;
      printWindow.onload = () => {
        // Trigger print dialog after content loads
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
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
                        onClick={() => handlePreview(modele.file)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Aperçu
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownloadPDF(modele.file, modele.pdfFileName)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-secondary/50 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Comment télécharger en PDF ?
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">1.</span>
                <span>Cliquez sur <strong>"Aperçu"</strong> pour visualiser le formulaire, ou sur <strong>"PDF"</strong> pour télécharger directement</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">2.</span>
                <span>Dans la fenêtre d'impression qui s'ouvre, choisissez <strong>"Enregistrer au format PDF"</strong> ou <strong>"Microsoft Print to PDF"</strong> comme destination</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">3.</span>
                <span>Remplissez le formulaire téléchargé avec toutes les informations requises</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">4.</span>
                <span>Transmettez le document complété à l'AJE par email ou en personne</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-accent/10 rounded-md border border-accent/20">
              <p className="text-sm text-foreground">
                <strong className="text-accent">💡 Astuce :</strong> Vous pouvez également copier le texte du formulaire dans votre logiciel de traitement de texte préféré (Word, LibreOffice, etc.) pour le personnaliser avant de l'imprimer.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Modeles;