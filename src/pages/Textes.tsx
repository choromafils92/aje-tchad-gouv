import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Download, FileText, Scale, BookOpen, HelpCircle, Calendar, Filter } from "lucide-react";
import { useState } from "react";

const Textes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const textesFoundamentaux = [
    {
      title: "Décret n° 1205/PR/PM/MJ/2019 portant organisation de l'AJE",
      type: "Décret",
      date: "2019-03-20",
      description: "Creation, organisation interne et attributions spécifiques des services de l'AJE",
      downloadUrl: "#",
      category: "Organisation"
    }
  ];

  const modelesTypes = [
    {
      title: "Modèle de demande d'avis juridique",
      description: "Formulaire type pour saisir l'AJE en demande d'avis",
      format: "DOCX",
      size: "45 KB",
      downloadUrl: "#"
    },
    {
      title: "Modèle de clause de règlement des différends",
      description: "Clauses types pour les contrats publics",
      format: "PDF",
      size: "120 KB",
      downloadUrl: "#"
    },
    {
      title: "Check-list pré-contentieuse",
      description: "Liste de vérification avant engagement d'une procédure",
      format: "PDF",
      size: "80 KB",
      downloadUrl: "#"
    },
    {
      title: "Modèle de transaction administrative",
      description: "Cadre type pour les accords transactionnels",
      format: "DOCX",
      size: "55 KB",
      downloadUrl: "#"
    }
  ];

  const faqItems = [
    {
      question: "Qui peut saisir l'Agence Judiciaire de l'État ?",
      answer: "Seules les administrations publiques (ministères, établissements publics, collectivités territoriales) peuvent saisir l'AJE. Les particuliers ne peuvent pas directement saisir l'AJE mais doivent passer par leur administration de tutelle."
    },
    {
      question: "Quels sont les délais de réponse de l'AJE ?",
      answer: "Les délais varient selon l'urgence : 24h pour les urgences absolues, 7 jours pour les dossiers urgents, 15 jours pour les avis standards, et 30 jours pour les dossiers complexes nécessitant une analyse approfondie."
    },
    {
      question: "L'avis de l'AJE est-il obligatoire ?",
      answer: "Oui, l'avis de l'AJE est obligatoire pour tous les contrats publics d'un montant supérieur à 50 millions FCFA, les projets de lois et décrets, et avant tout engagement d'une procédure contentieuse."
    },
    {
      question: "Comment suivre l'avancement de ma demande ?",
      answer: "Chaque demande reçoit un numéro de suivi. Vous pouvez suivre l'avancement en contactant notre service client au +235 22 XX XX XX ou par email à suivi@aje.td (service en cours de développement)."
    },
    {
      question: "L'AJE peut-elle représenter les collectivités territoriales ?",
      answer: "Oui, l'AJE peut représenter les collectivités territoriales dans leurs contentieux, sous réserve d'une convention spécifique et du respect des procédures de saisine appropriées."
    },
    {
      question: "Quelle est la différence entre avis et représentation ?",
      answer: "L'avis est un conseil juridique préventif donné avant une action, tandis que la représentation est l'intervention directe de l'AJE devant une juridiction pour défendre les intérêts de l'État."
    },
    {
      question: "L'AJE intervient-elle en matière pénale ?",
      answer: "L'AJE peut intervenir dans les procédures pénales lorsque l'État est partie civile ou lorsque ses intérêts patrimoniaux sont en jeu, mais elle ne se substitue pas au ministère public."
    },
    {
      question: "Comment obtenir une copie d'un jugement impliquant l'État ?",
      answer: "Les administrations peuvent demander copie des jugements auprès de l'AJE en justifiant de leur intérêt légitime. La demande doit être adressée par écrit au service contentieux."
    }
  ];

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
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Textes & Références
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 mb-8">
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
                            onClick={() => {
                              // Simule le téléchargement du document
                              const link = document.createElement('a');
                              link.href = `data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAsSGVsdmV0aWNhCi9FbmNvZGluZyAvTWFjUm9tYW5FbmNvZGluZwo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihIZWxsbyBXb3JsZCEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQ1IDAwMDAwIG4gCjAwMDAwMDAzMzQgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0MTAKJSVFT0Y=`;
                              link.download = texte.title + '.pdf';
                              link.click();
                              alert(`Téléchargement de "${texte.title}" en cours...`);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modelesTypes.map((modele, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {modele.format}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {modele.size}
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
                        <Button 
                          className="w-full"
                          onClick={() => {
                            // Simule le téléchargement du modèle
                            const link = document.createElement('a');
                            link.href = `data:application/${modele.format.toLowerCase()};base64,UEsDBBQAAAAIAB4bLkIAAAAAAAAAAAAAAAAQAAAAZG9jUHJvcHMvYXBwLnhtbFBLAQIUABQAAAAIAB4bLkIAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAABQSwUGAAAAAAEAAQA+AAAAIAA=`;
                            link.download = modele.title + '.' + modele.format.toLowerCase();
                            link.click();
                            alert(`Téléchargement de "${modele.title}" en cours...`);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger le modèle
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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