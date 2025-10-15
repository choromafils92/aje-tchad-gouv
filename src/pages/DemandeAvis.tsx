import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AvisJuridiqueForm from "@/components/AvisJuridiqueForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DemandeAvis = () => {
  const requiredDocuments = [
    "Lettre de saisine officielle signée par l'autorité compétente",
    "Exposé détaillé des faits et de la problématique juridique",
    "Copies de tous les documents juridiques pertinents (contrats, correspondances, etc.)",
    "Références des textes légaux et réglementaires applicables",
    "Tout élément factuel ou juridique utile à l'analyse"
  ];

  const processSteps = [
    {
      title: "Soumission",
      description: "Remplissez le formulaire en ligne ou soumettez votre demande par courrier",
      icon: FileText
    },
    {
      title: "Examen de recevabilité",
      description: "Vérification de la complétude du dossier (24-48h)",
      icon: AlertCircle
    },
    {
      title: "Analyse juridique",
      description: "Étude approfondie par nos juristes spécialisés",
      icon: Clock
    },
    {
      title: "Remise de l'avis",
      description: "Transmission de l'avis motivé à l'administration demanderesse",
      icon: CheckCircle2
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <FileText className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Demande d'Avis Juridique
              </h1>
              <p className="text-xl lg:text-2xl opacity-90">
                Service réservé aux administrations publiques et établissements publics
              </p>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-8 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Information importante</AlertTitle>
                <AlertDescription>
                  Ce service est exclusivement réservé aux administrations publiques, ministères et établissements publics de l'État du Tchad.
                  Les demandes émanant de particuliers ou d'entités privées ne seront pas traitées.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Processus de traitement
                </h2>
                <p className="text-lg text-muted-foreground">
                  Votre demande sera traitée selon les étapes suivantes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardHeader>
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{step.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Required Documents */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Documents requis</CardTitle>
                  <CardDescription>
                    Pour un traitement rapide de votre demande, assurez-vous de fournir tous les documents suivants :
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {requiredDocuments.map((doc, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Formulaire de demande
                </h2>
                <p className="text-lg text-muted-foreground">
                  Remplissez le formulaire ci-dessous pour soumettre votre demande d'avis juridique
                </p>
              </div>
              <AvisJuridiqueForm />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Besoin d'assistance ?
              </h3>
              <p className="text-muted-foreground mb-6">
                Pour toute question concernant la procédure de demande d'avis juridique
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold">Téléphone :</span>
                  <span className="text-muted-foreground">+235 22 XX XX XX</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold">Email :</span>
                  <span className="text-muted-foreground">conseil.etudes@aje.td</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DemandeAvis;
