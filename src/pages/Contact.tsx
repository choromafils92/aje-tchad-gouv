import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Clock, Send, Calendar } from "lucide-react";
import MapboxMap from "@/components/MapboxMap";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubDirection {
  nom: string;
  responsable: string;
  telephone: string;
  email: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState("");
  const [subdirections, setSubdirections] = useState<SubDirection[]>([]);

  const [contactForm, setContactForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    organisme: "",
    sujet: "",
    message: ""
  });

  const [rdvForm, setRdvForm] = useState({
    nom: "",
    fonction: "",
    organisme: "",
    service: "",
    date: "",
    heure: "",
    email: "",
    telephone: "",
    objet: ""
  });

  const [submittingContact, setSubmittingContact] = useState(false);
  const [submittingRdv, setSubmittingRdv] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "contact_address",
          "contact_phone",
          "contact_email",
          "contact_hours",
          "contact_subdirections"
        ]);

      if (error) throw error;

      data?.forEach((setting: any) => {
        switch (setting.key) {
          case "contact_address":
            setAddress(setting.value || "");
            break;
          case "contact_phone":
            setPhone(setting.value || "");
            break;
          case "contact_email":
            setEmail(setting.value || "");
            break;
          case "contact_hours":
            setHours(setting.value || "");
            break;
          case "contact_subdirections":
            setSubdirections(setting.value || []);
            break;
        }
      });
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);

    try {
      const { error } = await supabase
        .from("contacts" as any)
        .insert([{
          nom: contactForm.nom,
          email: contactForm.email,
          telephone: contactForm.telephone,
          sujet: contactForm.sujet,
          message: `Organisme: ${contactForm.organisme}\n\n${contactForm.message}`,
          statut: 'nouveau'
        }]);

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès !",
      });

      setContactForm({
        nom: "",
        email: "",
        telephone: "",
        organisme: "",
        sujet: "",
        message: ""
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'envoi",
        variant: "destructive",
      });
    } finally {
      setSubmittingContact(false);
    }
  };

  const handleRdvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRdv(true);

    try {
      const { error } = await supabase
        .from("contacts" as any)
        .insert([{
          nom: rdvForm.nom,
          email: rdvForm.email,
          telephone: rdvForm.telephone,
          sujet: `Demande de rendez-vous - ${rdvForm.service}`,
          message: `Fonction: ${rdvForm.fonction}\nOrganisme: ${rdvForm.organisme}\nService: ${rdvForm.service}\nDate souhaitée: ${rdvForm.date}\nHeure souhaitée: ${rdvForm.heure}\n\nObjet:\n${rdvForm.objet}`,
          statut: 'nouveau'
        }]);

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande de rendez-vous a été envoyée avec succès !",
      });

      setRdvForm({
        nom: "",
        fonction: "",
        organisme: "",
        service: "",
        date: "",
        heure: "",
        email: "",
        telephone: "",
        objet: ""
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'envoi",
        variant: "destructive",
      });
    } finally {
      setSubmittingRdv(false);
    }
  };

  const creneauxRendezVous = [
    "09h00 - 09h30",
    "09h30 - 10h00",
    "10h00 - 10h30",
    "10h30 - 11h00",
    "11h00 - 11h30",
    "14h00 - 14h30",
    "14h30 - 15h00",
    "15h00 - 15h30"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <MapPin className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Contact & Rendez-vous
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 mb-8">
                Contactez l'Agence Judiciaire de l'État du Tchad
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Coordonnées principales */}
              <div>
                <h2 className="text-3xl font-bold text-primary mb-8">
                  Nos coordonnées
                </h2>
                
                {loading ? (
                  <div className="p-6">Chargement...</div>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-primary mb-2">Adresse</h3>
                            <p className="text-foreground/80 whitespace-pre-line">{address}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-primary mb-1">Téléphone</h3>
                              <p className="text-foreground/80">{phone}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-primary mb-1">Email</h3>
                              <p className="text-foreground/80">{email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-primary mb-3">Horaires d'ouverture</h3>
                            <div className="space-y-1 text-foreground/80 whitespace-pre-line">
                              {hours}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Services spécialisés */}
              <div>
                <h2 className="text-3xl font-bold text-primary mb-8">
                  Contactez par sous-direction
                </h2>
                
                {loading ? (
                  <div className="p-6">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    {subdirections.map((service, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-primary">
                            {service.nom}
                          </CardTitle>
                          <CardDescription>
                            {service.responsable}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{service.telephone}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{service.email}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {subdirections.length === 0 && (
                      <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                          Aucune sous-direction configurée
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Forms */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="contact" className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Nous contacter</span>
                  </TabsTrigger>
                  <TabsTrigger value="rendez-vous" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Prendre rendez-vous</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-primary">
                        Formulaire de contact
                      </CardTitle>
                      <CardDescription className="text-base">
                        Pour toute question ou demande d'information générale
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleContactSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="nom">Nom complet *</Label>
                            <Input 
                              id="nom" 
                              placeholder="Votre nom et prénom"
                              value={contactForm.nom}
                              onChange={(e) => setContactForm({...contactForm, nom: e.target.value})}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="organisme">Organisme/Entreprise</Label>
                            <Input 
                              id="organisme" 
                              placeholder="Nom de votre organisme"
                              value={contactForm.organisme}
                              onChange={(e) => setContactForm({...contactForm, organisme: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email-contact">Email *</Label>
                            <Input 
                              id="email-contact" 
                              type="email" 
                              placeholder="votre.email@exemple.com"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="telephone-contact">Téléphone</Label>
                            <Input 
                              id="telephone-contact" 
                              placeholder="+235 XX XX XX XX"
                              value={contactForm.telephone}
                              onChange={(e) => setContactForm({...contactForm, telephone: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sujet">Sujet de votre message *</Label>
                          <Select 
                            value={contactForm.sujet}
                            onValueChange={(value) => setContactForm({...contactForm, sujet: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez un sujet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="information">Demande d'information</SelectItem>
                              <SelectItem value="rdv">Prise de rendez-vous</SelectItem>
                              <SelectItem value="formation">Formation juridique</SelectItem>
                              <SelectItem value="presse">Demande presse/média</SelectItem>
                              <SelectItem value="carriere">Opportunité de carrière</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea 
                            id="message" 
                            placeholder="Décrivez votre demande ou question..."
                            rows={6}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            required
                          />
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={submittingContact}>
                          <Send className="mr-2 h-5 w-5" />
                          {submittingContact ? "Envoi..." : "Envoyer le message"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rendez-vous">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-primary">
                        Demande de rendez-vous
                      </CardTitle>
                      <CardDescription className="text-base">
                        Planifiez un entretien avec nos services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="nom-rdv">Nom complet *</Label>
                            <Input id="nom-rdv" placeholder="Votre nom et prénom" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fonction-rdv">Fonction/Qualité *</Label>
                            <Input id="fonction-rdv" placeholder="Votre fonction" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="organisme-rdv">Organisme représenté *</Label>
                            <Input id="organisme-rdv" placeholder="Nom de votre organisme" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="service-rdv">Sous-direction concernée *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisissez une sous-direction" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="direction">Agent judiciaire de l'État</SelectItem>
                                <SelectItem value="contentieux-judiciaire">Sous-Direction du Contentieux Judiciaire</SelectItem>
                                <SelectItem value="contentieux-administratif">Sous-Direction du Contentieux Administratif</SelectItem>
                                <SelectItem value="conseil-etudes">Sous-Direction du Conseil et des Etudes Juridiques</SelectItem>
                                <SelectItem value="recouvrement">Sous-Direction du Recouvrement de Créances Contentieuses</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="date-rdv">Date souhaitée *</Label>
                            <Input id="date-rdv" type="date" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="heure-rdv">Créneau horaire *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisissez un créneau" />
                              </SelectTrigger>
                              <SelectContent>
                                {creneauxRendezVous.map((creneau, index) => (
                                  <SelectItem key={index} value={creneau}>
                                    {creneau}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email-rdv">Email *</Label>
                            <Input id="email-rdv" type="email" placeholder="votre.email@exemple.com" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="telephone-rdv">Téléphone *</Label>
                            <Input id="telephone-rdv" placeholder="+235 XX XX XX XX" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="objet-rdv">Objet du rendez-vous *</Label>
                          <Textarea 
                            id="objet-rdv" 
                            placeholder="Décrivez brièvement l'objet de votre demande de rendez-vous..."
                            rows={4}
                          />
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg">
                          <h4 className="font-medium text-primary mb-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Informations importantes
                          </h4>
                          <ul className="text-sm text-foreground/80 space-y-1">
                            <li>• Les rendez-vous sont confirmés sous 48h par email</li>
                            <li>• Prévoir 30 minutes à 1 heure selon la complexité</li>
                            <li>• Apporter tous les documents pertinents</li>
                            <li>• En cas d'empêchement, prévenir 24h à l'avance</li>
                          </ul>
                        </div>

                        <Button size="lg" className="w-full">
                          <Calendar className="mr-2 h-5 w-5" />
                          Demander le rendez-vous
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Comment nous trouver
              </h2>
              <p className="text-lg text-muted-foreground">
                Localisation de nos bureaux dans le quartier administratif de N'Djamena
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <MapboxMap />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;