import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, Phone, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  ordre: number;
}

interface AssistanceContact {
  id: string;
  service_name: string;
  contact_label: string;
  contact_value: string;
  additional_info: string | null;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [contacts, setContacts] = useState<AssistanceContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [faqsResponse, contactsResponse] = await Promise.all([
        supabase
          .from("faq" as any)
          .select("*")
          .eq("published", true)
          .order("ordre", { ascending: true }),
        supabase
          .from("faq_assistance_contacts" as any)
          .select("*")
          .order("ordre", { ascending: true })
      ]);

      if (faqsResponse.error) throw faqsResponse.error;
      if (contactsResponse.error) throw contactsResponse.error;

      setFaqs(faqsResponse.data as any || []);
      setContacts(contactsResponse.data as any || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group FAQs by category
  const faqCategories = faqs.reduce((acc: any, faq) => {
    const category = faq.category || "Autres";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center p-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const oldFaqCategories = [
    {
      category: "Questions générales",
      questions: [
        {
          question: "Qu'est-ce que l'Agence Judiciaire de l'État (AJE) ?",
          answer: "L'AJE est l'institution chargée de représenter et défendre les intérêts de l'État du Tchad devant toutes les juridictions. Elle fournit également des conseils juridiques aux administrations publiques."
        },
        {
          question: "Qui peut saisir l'AJE ?",
          answer: "Seules les administrations publiques, les ministères et les établissements publics peuvent saisir l'AJE. Les particuliers ne peuvent pas directement saisir l'AJE."
        },
        {
          question: "Quels sont les horaires de l'AJE ?",
          answer: "L'AJE est ouverte du lundi au jeudi de 7h30 à 15h30 et le vendredi de 7h30 à 12h30. Un service de permanence est disponible pour les urgences contentieuses."
        }
      ]
    },
    {
      category: "Demandes d'avis juridique",
      questions: [
        {
          question: "Comment demander un avis juridique ?",
          answer: "Les administrations doivent soumettre une demande écrite accompagnée de tous les documents pertinents. Un formulaire de demande est disponible sur notre site ou auprès de nos services."
        },
        {
          question: "Quel est le délai de réponse pour un avis juridique ?",
          answer: "Le délai standard est de 15 jours ouvrables. Pour les demandes urgentes dûment justifiées, un délai réduit peut être accordé (24-48h)."
        },
        {
          question: "L'avis de l'AJE est-il contraignant ?",
          answer: "L'avis de l'AJE a une valeur consultative mais fait autorité en matière juridique. Il est fortement recommandé de le suivre pour sécuriser les décisions administratives."
        }
      ]
    },
    {
      category: "Contentieux et représentation",
      questions: [
        {
          question: "L'AJE peut-elle représenter l'État dans tous les types de contentieux ?",
          answer: "Oui, l'AJE représente l'État devant toutes les juridictions : civiles, commerciales, administratives, pénales, ainsi que devant les tribunaux arbitraux et internationaux."
        },
        {
          question: "Comment signaler un contentieux impliquant l'État ?",
          answer: "Toute administration ayant connaissance d'un contentieux impliquant l'État doit immédiatement en informer l'AJE en transmettant tous les documents utiles (assignation, requête, etc.)."
        },
        {
          question: "L'AJE gère-t-elle le recouvrement des créances de l'État ?",
          answer: "Oui, la Sous-Direction du Recouvrement de Créances Contentieuses est chargée du recouvrement des créances publiques par voie contentieuse."
        }
      ]
    },
    {
      category: "Procédures et documents",
      questions: [
        {
          question: "Quels documents fournir pour une saisine de l'AJE ?",
          answer: "Il faut fournir : une lettre de saisine officielle, un exposé des faits, tous les documents juridiques pertinents (contrats, correspondances, décisions), et les références réglementaires applicables."
        },
        {
          question: "Peut-on consulter les modèles de documents ?",
          answer: "Oui, des modèles de formulaires et de clauses juridiques sont disponibles dans la section 'Textes et Ressources' de notre site."
        },
        {
          question: "Comment obtenir une copie d'un dossier traité par l'AJE ?",
          answer: "Les administrations concernées peuvent demander une copie en adressant une demande écrite au service compétent de l'AJE."
        }
      ]
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
              <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
                Foire Aux Questions (FAQ)
              </h1>
              <p className="text-xl lg:text-2xl font-bold text-white drop-shadow-md">
                Trouvez rapidement les réponses à vos questions sur l'AJE
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {Object.keys(faqCategories).length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Aucune question fréquente disponible pour le moment.
                </p>
              ) : (
                Object.entries(faqCategories).map(([category, questions]: [string, any]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold text-primary mb-6">
                      {category}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {questions.map((faq: FAQ) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border rounded-lg px-6"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-semibold text-foreground">
                              {faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pt-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">
                      Vous n'avez pas trouvé de réponse ?
                    </h2>
                    <p className="text-muted-foreground">
                      Notre équipe est à votre disposition pour répondre à toutes vos questions
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contacts.length === 0 ? (
                      <div className="col-span-3 text-center py-8">
                        <p className="text-muted-foreground">
                          Informations de contact non disponibles
                        </p>
                      </div>
                    ) : (
                      <>
                        {contacts.map((contact) => (
                          <div key={contact.id} className="text-center p-4">
                            {contact.service_name.toLowerCase().includes("téléphone") ? (
                              <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                            ) : contact.service_name.toLowerCase().includes("email") ? (
                              <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                            ) : (
                              <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                            )}
                            <h3 className="font-semibold mb-2">{contact.service_name}</h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {contact.contact_label}
                            </p>
                            <p className="font-medium">{contact.contact_value}</p>
                            {contact.additional_info && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {contact.additional_info}
                              </p>
                            )}
                          </div>
                        ))}
                        <div className="text-center p-4">
                          <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                          <h3 className="font-semibold mb-2">Demande écrite</h3>
                          <Button variant="outline" size="sm" asChild className="mt-2">
                            <Link to="/contact">
                              Nous contacter
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
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

export default FAQ;
