import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, Megaphone, FileText, AlertTriangle, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

const Actualites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const actualites = [
    {
      id: 1,
      type: "Communiqué",
      category: "Réglementation",
      title: "Nouvelle procédure de saisine de l'AJE pour les contrats publics supérieurs à 100 millions FCFA",
      description: "À compter du 1er février 2024, toutes les administrations publiques devront obligatoirement saisir l'AJE pour validation juridique préalable de leurs projets de contrats publics d'une valeur supérieure à 100 millions de francs CFA. Cette mesure vise à renforcer la sécurité juridique des engagements de l'État.",
      content: "Cette nouvelle procédure, instituée par la circulaire n° 001/PR/AJE/2024, s'inscrit dans le cadre de la modernisation de l'action publique et de la prévention des contentieux. Les administrations disposent désormais d'un délai de 15 jours ouvrables pour recevoir l'avis de l'AJE. Un formulaire dématérialisé sera prochainement mis en ligne pour faciliter les démarches.",
      date: "2024-01-25",
      urgent: false,
      icon: FileText,
      author: "Direction de l'AJE"
    },
    {
      id: 2,
      type: "Note au public",
      category: "Procédure",
      title: "Rappel important : Délais de prescription en matière de contentieux administratif",
      description: "Suite à plusieurs cas de forclusion observés, l'AJE rappelle aux administrations et aux justiciables les délais impératifs de recours gracieux (2 mois) et contentieux (4 mois) applicables aux décisions administratives. Ces délais courent à compter de la notification ou de la publication de la décision.",
      content: "Il est essentiel de respecter ces délais pour préserver les droits de l'État et des administrés. L'AJE recommande la mise en place d'un système de suivi des délais dans chaque administration. Des formations sur la gestion des délais contentieux seront organisées au premier trimestre 2024.",
      date: "2024-01-20",
      urgent: true,
      icon: AlertTriangle,
      author: "Service Contentieux"
    },
    {
      id: 3,
      type: "Annonce",
      category: "Formation",
      title: "Lancement du programme de formation juridique continue pour les administrations",
      description: "L'AJE annonce le lancement de son programme de formation juridique continue destiné aux cadres des administrations publiques. Ces formations porteront sur la rédaction des actes administratifs, la prévention des contentieux et la gestion des marchés publics.",
      content: "Le programme comprend 12 modules thématiques répartis sur l'année 2024. Les inscriptions sont ouvertes jusqu'au 15 février. Priorité sera donnée aux administrations ayant eu le plus de contentieux en 2023. Certificat de formation délivré en fin de parcours.",
      date: "2024-01-18",
      urgent: false,
      icon: Users,
      author: "Direction des Affaires Juridiques"
    },
    {
      id: 4,
      type: "Communiqué",
      category: "Résultats",
      title: "Bilan 2023 : L'AJE enregistre un taux de succès de 87% dans ses contentieux",
      description: "L'Agence Judiciaire de l'État présente un bilan positif pour l'exercice 2023 avec 2,847 dossiers traités et un taux de succès de 87% dans les affaires contentieuses. Ces résultats témoignent de l'efficacité de l'action juridique menée au service de l'État.",
      content: "Les domaines les plus actifs ont été les marchés publics (34% des dossiers), le contentieux fiscal (28%) et les différends fonciers (19%). L'AJE a également fourni 1,250 avis juridiques préventifs, contribuant à éviter de nombreux contentieux. Le montant total des enjeux financiers préservés s'élève à 15,7 milliards FCFA.",
      date: "2024-01-15",
      urgent: false,
      icon: FileText,
      author: "Direction Générale AJE"
    },
    {
      id: 5,
      type: "Note au public",
      category: "Information",
      title: "Mise à jour des coordonnées de contact de l'AJE",
      description: "L'AJE informe ses partenaires de la mise à jour de ses coordonnées de contact suite au déménagement de certains services dans les nouveaux locaux du quartier administratif.",
      content: "Nouvelles coordonnées : Siège social - Avenue Félix Éboué, Quartier administratif, N'Djamena. Téléphone : +235 22 XX XX XX. Email : contact@aje.td. Les horaires d'ouverture restent inchangés : 7h30-15h30 du lundi au jeudi, 7h30-12h30 le vendredi.",
      date: "2024-01-12",
      urgent: false,
      icon: Megaphone,
      author: "Secrétariat Général"
    },
    {
      id: 6,
      type: "Communiqué",
      category: "Jurisprudence",
      title: "Victoire importante de l'État dans l'affaire du contentieux électoral de 2021",
      description: "La Cour Suprême a confirmé la validité des décisions de la Commission Électorale Nationale Indépendante, donnant raison aux arguments développés par l'AJE. Cette décision fait jurisprudence en matière de contentieux électoral.",
      content: "Cette victoire juridique, obtenue après 18 mois de procédure, confirme la solidité de l'argumentation juridique développée par l'équipe de l'AJE. Elle établit des précédents importants pour les futures consultations électorales et renforce la sécurité juridique du processus démocratique tchadien.",
      date: "2024-01-08",
      urgent: false,
      icon: FileText,
      author: "Service Contentieux Constitutionnel"
    }
  ];

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "Réglementation", label: "Réglementation" },
    { value: "Procédure", label: "Procédure" },
    { value: "Formation", label: "Formation" },
    { value: "Résultats", label: "Résultats" },
    { value: "Information", label: "Information" },
    { value: "Jurisprudence", label: "Jurisprudence" }
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

  const filteredActualites = actualites.filter(actu => {
    const matchesSearch = actu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actu.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || actu.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Megaphone className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Actualités & Publications
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 mb-8">
                Communiqués, notes officielles et annonces de l'AJE
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher dans les actualités..."
                    className="pl-10 py-6"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="lg:w-64">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="py-6">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {filteredActualites.length} publication{filteredActualites.length > 1 ? 's' : ''} trouvée{filteredActualites.length > 1 ? 's' : ''}
                </h2>
                <p className="text-muted-foreground">
                  Triées par date de publication, de la plus récente à la plus ancienne
                </p>
              </div>

              <div className="space-y-8">
                {filteredActualites.map((actu) => {
                  const IconComponent = actu.icon;
                  return (
                    <Card key={actu.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                        <div className="lg:col-span-3">
                          <CardHeader className="space-y-4">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                              <div className="flex items-center space-x-3">
                                <Badge variant={getTypeColor(actu.type, actu.urgent)} className="text-xs">
                                  {actu.urgent && "🔴 "}{actu.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {actu.category}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(actu.date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                            <CardTitle className="text-xl lg:text-2xl leading-tight">
                              {actu.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CardDescription className="text-base text-foreground/80 leading-relaxed">
                              {actu.description}
                            </CardDescription>
                            <div className="pt-4 border-t">
                              <p className="text-sm text-muted-foreground mb-4">
                                <strong>Source :</strong> {actu.author}
                              </p>
                              <Button 
                                variant="outline" 
                                className="group"
                                onClick={() => {
                                  alert(`Ouverture de l'article: "${actu.title}"\n\nContenu: ${actu.content}`);
                                }}
                              >
                                Lire l'article complet
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                        <div className="bg-secondary/50 p-6 flex items-center justify-center">
                          <IconComponent className="h-16 w-16 text-muted-foreground" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredActualites.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Aucune actualité trouvée
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Essayez de modifier vos critères de recherche ou de filtrage
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Restez informé
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Abonnez-vous pour recevoir nos dernières publications et communiqués officiels
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Votre email professionnel"
                  className="flex-1"
                />
                <Button
                  onClick={() => alert('Inscription à la newsletter confirmée ! Vous recevrez nos dernières publications par email.')}
                >
                  S'abonner
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Vous pouvez également suivre notre flux RSS pour une mise à jour automatique
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;