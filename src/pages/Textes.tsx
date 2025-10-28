import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Download, FileText, Scale, BookOpen, HelpCircle, Calendar, Filter, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Textes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqItems, setFaqItems] = useState<Array<{question: string; answer: string}>>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("faq")
        .select("*")
        .eq("published", true)
        .order("ordre", { ascending: true });

      if (error) throw error;
      
      setFaqItems(((data as any) || []).map((item: any) => ({
        question: item.question,
        answer: item.answer
      })));
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les FAQ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const textesFoundamentaux = [
    {
      title: "Decert N0 2155/PT/PM/MFBCP/2023 portant creation de l'Agence Judiciaire de l'Etat",
      type: "Décret",
      date: "2019-03-20",
      description: "Creation, organisation interne et attributions spécifiques des services de l'AJE",
      downloadUrl: "/documents/Loi_AJE.pdf",
      category: "Organisation"
    }
  ];

  const [modelesTypes, setModelesTypes] = useState<any[]>([]);
  const [loadingModeles, setLoadingModeles] = useState(true);

  useEffect(() => {
    const fetchModeles = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("resource_documents")
          .select("*")
          .eq("published", true)
          .order("ordre", { ascending: true });

        if (error) throw error;
        setModelesTypes(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des modèles:", error);
      } finally {
        setLoadingModeles(false);
      }
    };

    fetchModeles();
  }, []);

  const filteredTextes = textesFoundamentaux.filter(texte =>
    texte.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    texte.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    texte.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
                Textes & Références
              </h1>
              <p className="text-xl lg:text-2xl font-bold mb-8 text-white drop-shadow-md">
                Bibliothèque juridique et ressources documentaires de l'AJE
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher dans les textes juridiques..."
                  className="pl-10 py-6 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="textes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="textes" className="flex items-center space-x-2">
                  <Scale className="h-4 w-4" />
                  <span>Textes fondamentaux</span>
                </TabsTrigger>
                <TabsTrigger value="modeles" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Modèles & Formulaires</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>FAQ Juridique</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="textes" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-4">
                    Textes fondamentaux
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Décrets, codes et conventions régissant l'action de l'AJE
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  {filteredTextes.map((texte, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {texte.type}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(texte.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-snug">
                          {texte.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-foreground/80">
                          {texte.description}
                        </CardDescription>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <Badge variant="secondary" className="text-xs">
                            {texte.category}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            asChild
                          >
                            <a href={texte.downloadUrl} download={texte.title + '.pdf'}>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="modeles" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-4">
                    Modèles et formulaires
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Documents types pour faciliter vos démarches avec l'AJE
                  </p>
                </div>

                {loadingModeles ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Chargement des modèles...</p>
                  </div>
                ) : modelesTypes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun modèle disponible pour le moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modelesTypes.map((modele: any) => (
                      <Card key={modele.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="outline" className="text-xs">
                              {modele.pdf_url ? 'PDF' : modele.word_url ? 'WORD' : 'Document'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {modele.file_size || 'N/A'}
                            </span>
                          </div>
                          <CardTitle className="text-lg">
                            {modele.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="text-foreground/80">
                            {modele.description}
                          </CardDescription>
                          <div className="flex gap-2">
                            {modele.pdf_url && (
                              <>
                                <Button 
                                  className="flex-1"
                                  variant="outline"
                                  onClick={() => window.open(modele.pdf_url, '_blank')}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Aperçu PDF
                                </Button>
                                <Button 
                                  className="flex-1"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = modele.pdf_url;
                                    link.download = `${modele.title}.pdf`;
                                    link.click();
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger PDF
                                </Button>
                              </>
                            )}
                            {modele.word_url && (
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = modele.word_url;
                                  link.download = `${modele.title}.docx`;
                                  link.click();
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger Word
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="faq" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-4">
                    Questions fréquentes
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Réponses aux questions les plus courantes sur l'AJE
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqItems.map((item, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`}
                        className="border border-border rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-6">
                          <span className="text-primary font-medium">
                            {item.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-foreground/80 leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Besoin d'assistance juridique ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Notre équipe d'experts est à votre disposition pour vous accompagner 
                dans vos démarches juridiques et administratives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/services/demande-avis">
                    Demander un avis juridique
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/contact">
                    Nous contacter
                  </a>
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

export default Textes;