import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ResourceDocument {
  id: string;
  title: string;
  description: string;
  pdf_url: string | null;
  word_url: string | null;
  file_size: string;
}

interface AssistanceContact {
  id: string;
  service_name: string;
  contact_label: string;
  contact_value: string;
  additional_info: string | null;
}

interface ServiceJuridique {
  id: string;
  titre: string;
  description: string;
  delai: string;
  criteres: string[];
  icon_name: string;
  ordre: number;
  published: boolean;
}

interface DomaineContentieux {
  id: string;
  categorie: string;
  description: string;
  affaires: string[];
  statistiques: string;
  icon_name: string;
  ordre: number;
  published: boolean;
}

const Services = () => {
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  const [contacts, setContacts] = useState<AssistanceContact[]>([]);
  const [servicesJuridiques, setServicesJuridiques] = useState<ServiceJuridique[]>([]);
  const [domainesContentieux, setDomainesContentieux] = useState<DomaineContentieux[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docsResponse, contactsResponse, servicesResponse, domainesResponse] = await Promise.all([
        supabase
          .from("resource_documents" as any)
          .select("*")
          .eq("published", true)
          .order("ordre", { ascending: true }),
        supabase
          .from("faq_assistance_contacts" as any)
          .select("*")
          .order("ordre", { ascending: true }),
        supabase
          .from("services_juridiques" as any)
          .select("*")
          .eq("published", true)
          .order("ordre", { ascending: true }),
        supabase
          .from("domaines_contentieux" as any)
          .select("*")
          .eq("published", true)
          .order("ordre", { ascending: true })
      ]);

      if (docsResponse.error) throw docsResponse.error;
      if (contactsResponse.error) throw contactsResponse.error;
      if (servicesResponse.error) throw servicesResponse.error;
      if (domainesResponse.error) throw domainesResponse.error;

      setDocuments(docsResponse.data as any || []);
      setContacts(contactsResponse.data as any || []);
      setServicesJuridiques(servicesResponse.data as any || []);
      setDomainesContentieux(domainesResponse.data as any || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <LucideIcons.Users className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
                Services aux Administrations
              </h1>
              <p className="text-xl lg:text-2xl font-bold mb-8 text-white drop-shadow-md">
                Accompagnement juridique et conseil pour les organismes publics
              </p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Nos services
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                L'AJE met à disposition des administrations une gamme complète de services 
                juridiques pour sécuriser leur action et prévenir les contentieux.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {servicesJuridiques.map((service) => {
                const IconComponent = (LucideIcons as any)[service.icon_name] || LucideIcons.FileText;
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl text-primary mb-2">
                            {service.titre}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mb-3">
                            <LucideIcons.Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Délai : {service.delai}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-foreground/80 leading-relaxed">
                        {service.description}
                      </CardDescription>
                      <div>
                        <h4 className="font-medium text-primary mb-2">Critères d'éligibilité :</h4>
                        <div className="space-y-2">
                          {service.criteres.map((critere, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <LucideIcons.CheckCircle className="h-4 w-4 text-accent" />
                              <span className="text-sm text-foreground/80">{critere}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Types de Contentieux */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Domaines de Contentieux
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                L'AJE intervient dans tous les types de contentieux impliquant l'État et les administrations publiques.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domainesContentieux.map((domaine) => {
                const IconComponent = (LucideIcons as any)[domaine.icon_name] || LucideIcons.Scale;
                return (
                  <Card key={domaine.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-primary mb-2">
                            {domaine.categorie}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {domaine.statistiques}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-foreground/80 leading-relaxed">
                        {domaine.description}
                      </CardDescription>
                      <div>
                        <h4 className="font-medium text-primary mb-2 text-sm">Types d'affaires :</h4>
                        <div className="space-y-1.5">
                          {domaine.affaires.map((affaire, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <LucideIcons.CheckCircle className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                              <span className="text-sm text-foreground/80">{affaire}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="demande" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
                <TabsTrigger value="demande" className="flex items-center space-x-2">
                  <LucideIcons.Send className="h-4 w-4" />
                  <span>Demande d'avis</span>
                </TabsTrigger>
                <TabsTrigger value="ressources" className="flex items-center space-x-2">
                  <LucideIcons.Download className="h-4 w-4" />
                  <span>Ressources</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="demande">
                <div className="max-w-4xl mx-auto">
                  <Card>
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="text-2xl text-primary">
                        Formulaire de demande d'avis juridique
                      </CardTitle>
                      <CardDescription className="text-base">
                        Réservé aux administrations publiques et organismes de l'État
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="ministere">Ministère/Organisme *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre organisme" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="finances">Ministère des Finances</SelectItem>
                                <SelectItem value="justice">Ministère de la Justice</SelectItem>
                                <SelectItem value="interieur">Ministère de l'Intérieur</SelectItem>
                                <SelectItem value="education">Ministère de l'Éducation</SelectItem>
                                <SelectItem value="sante">Ministère de la Santé</SelectItem>
                                <SelectItem value="autre">Autre (préciser)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="urgence">Niveau d'urgence *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le niveau" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="urgent">Urgent (24h)</SelectItem>
                                <SelectItem value="prioritaire">Prioritaire (7 jours)</SelectItem>
                                <SelectItem value="normal">Normal (15 jours)</SelectItem>
                                <SelectItem value="etude">Étude approfondie (30 jours)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="demandeur">Nom du demandeur *</Label>
                            <Input id="demandeur" placeholder="Nom et prénom" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fonction">Fonction *</Label>
                            <Input id="fonction" placeholder="Votre fonction" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email professionnel *</Label>
                            <Input id="email" type="email" placeholder="email@ministere.td" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="telephone">Téléphone *</Label>
                            <Input id="telephone" placeholder="+235 XX XX XX XX" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="objet">Objet de la demande *</Label>
                          <Input id="objet" placeholder="Résumé en une ligne de votre demande" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contexte">Contexte et description détaillée *</Label>
                          <Textarea 
                            id="contexte" 
                            placeholder="Décrivez le contexte, les enjeux et la nature exacte de votre demande d'avis juridique..."
                            rows={6}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pieces">Pièces jointes</Label>
                          <Input id="pieces" type="file" multiple accept=".pdf,.doc,.docx" />
                          <p className="text-sm text-muted-foreground">
                            Formats acceptés : PDF, Word. Taille max : 10 MB par fichier.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start space-x-2">
                            <Checkbox id="certifie" />
                            <Label htmlFor="certifie" className="text-sm leading-relaxed">
                              Je certifie que cette demande émane d'une administration publique habilitée 
                              et que les informations fournies sont exactes et complètes.
                            </Label>
                          </div>

                          <div className="flex items-start space-x-2">
                            <Checkbox id="confidentialite" />
                            <Label htmlFor="confidentialite" className="text-sm leading-relaxed">
                              J'accepte que les données de cette demande soient traitées dans le cadre 
                              de la mission de conseil juridique de l'AJE, dans le respect de la confidentialité.
                            </Label>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                          <Button size="lg" className="flex-1">
                            <LucideIcons.Send className="mr-2 h-5 w-5" />
                            Envoyer la demande
                          </Button>
                          <Button size="lg" variant="outline" type="button">
                            Sauvegarder le brouillon
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ressources">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-4">
                      Ressources documentaires
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Téléchargez les modèles et guides pour faciliter vos démarches
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <LucideIcons.Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {documents.length === 0 ? (
                        <div className="col-span-2 text-center py-8">
                          <p className="text-muted-foreground">
                            Aucun document disponible pour le moment
                          </p>
                        </div>
                      ) : (
                        documents.map((doc) => (
                          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg leading-snug mb-2">
                                    {doc.title}
                                  </CardTitle>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    {doc.pdf_url && doc.word_url && (
                                      <Badge variant="outline">PDF/Word</Badge>
                                    )}
                                    {doc.pdf_url && !doc.word_url && (
                                      <Badge variant="outline">PDF</Badge>
                                    )}
                                    {!doc.pdf_url && doc.word_url && (
                                      <Badge variant="outline">Word</Badge>
                                    )}
                                    <span>{doc.file_size}</span>
                                  </div>
                                </div>
                                <LucideIcons.FileText className="h-8 w-8 text-muted-foreground" />
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <CardDescription className="text-foreground/80">
                                {doc.description}
                              </CardDescription>
                              <div className="flex gap-2">
                                {doc.pdf_url && (
                                  <Button 
                                    className="flex-1"
                                    onClick={() => {
                                      // Check if it's an HTML file (template) or a real PDF
                                      if (doc.pdf_url!.endsWith('.html')) {
                                        // Extract filename for template preview
                                        const fileName = doc.pdf_url!.split('/').pop()?.replace('.html', '');
                                        window.open(`/modeles?file=${fileName}`, '_blank');
                                      } else {
                                        // Open PDF in new tab for viewing
                                        window.open(doc.pdf_url!, '_blank');
                                      }
                                    }}
                                  >
                                    <LucideIcons.Download className="mr-2 h-4 w-4" />
                                    {doc.pdf_url!.endsWith('.html') ? 'Voir & Télécharger' : 'Visualiser'}
                                  </Button>
                                )}
                                {doc.word_url && (
                                  <Button 
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                      window.open(doc.word_url!, '_blank');
                                    }}
                                  >
                                    <LucideIcons.Download className="mr-2 h-4 w-4" />
                                    Word
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-primary">
                    Besoin d'assistance ?
                  </CardTitle>
                  <CardDescription className="text-base">
                    Notre équipe est à votre disposition pour vous accompagner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <LucideIcons.Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {contacts.length === 0 ? (
                        <div className="col-span-2 text-center py-8">
                          <p className="text-muted-foreground">
                            Informations de contact non disponibles
                          </p>
                        </div>
                      ) : (
                        contacts.map((contact) => (
                          <div key={contact.id} className="text-center">
                            {contact.service_name.toLowerCase().includes("téléphone") ? (
                              <LucideIcons.Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                            ) : (
                              <LucideIcons.Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                            )}
                            <h3 className="font-semibold text-primary mb-2">
                              {contact.service_name}
                            </h3>
                            <p className="text-muted-foreground mb-2">
                              {contact.contact_label}
                            </p>
                            <p className="font-medium">{contact.contact_value}</p>
                            {contact.additional_info && (
                              <p className="text-sm text-muted-foreground">
                                {contact.additional_info}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;