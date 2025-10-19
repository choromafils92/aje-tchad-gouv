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

const Contact = () => {
  const coordonnees = {
    adresse: "Avenue Félix Éboué, Quartier administratif",
    ville: "N'Djamena, République du Tchad",
    telephone: "+235 22 XX XX XX",
    fax: "+235 22 XX XX XX",
    email: "contact@aje.td",
    horaires: {
      lunVen: "Lundi au Jeudi : 7h30 - 15h30",
      vendredi: "Vendredi : 7h30 - 12h30",
      weekend: "Weekend : Fermé"
    }
  };

  const services = [
    {
      nom: "Agent judiciaire de l'État",
      telephone: "+235 22 XX XX XX",
      email: "direction@aje.td",
      responsable: "Agent judiciaire de l'État"
    },
    {
      nom: "Sous-Direction du Contentieux Judiciaire",
      telephone: "+235 22 XX XX XX",
      email: "contentieux.judiciaire@aje.td",
      responsable: "Sous-Directeur du Contentieux Judiciaire"
    },
    {
      nom: "Sous-Direction du Contentieux Administratif",
      telephone: "+235 22 XX XX XX",
      email: "contentieux.administratif@aje.td",
      responsable: "Sous-Directeur du Contentieux Administratif"
    },
    {
      nom: "Sous-Direction du Conseil et des Etudes Juridiques",
      telephone: "+235 22 XX XX XX",
      email: "conseil.etudes@aje.td",
      responsable: "Sous-Directeur du Conseil et des Etudes Juridiques"
    },
    {
      nom: "Sous-Direction du Recouvrement de Créances Contentieuses",
      telephone: "+235 22 XX XX XX",
      email: "recouvrement@aje.td",
      responsable: "Sous-Directeur du Recouvrement de Créances Contentieuses"
    }
  ];

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
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-primary mb-2">Adresse</h3>
                          <p className="text-foreground/80">{coordonnees.adresse}</p>
                          <p className="text-foreground/80">{coordonnees.ville}</p>
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
                            <p className="text-foreground/80">{coordonnees.telephone}</p>
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
                            <p className="text-foreground/80">{coordonnees.email}</p>
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
                          <div className="space-y-1 text-foreground/80">
                            <p>{coordonnees.horaires.lunVen}</p>
                            <p>{coordonnees.horaires.vendredi}</p>
                            <p className="text-muted-foreground">{coordonnees.horaires.weekend}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Services spécialisés */}
              <div>
                <h2 className="text-3xl font-bold text-primary mb-8">
                  Contactez par sous-direction
                </h2>
                
                <div className="space-y-4">
                  {services.map((service, index) => (
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
                </div>
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
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="nom">Nom complet *</Label>
                            <Input id="nom" placeholder="Votre nom et prénom" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="organisme">Organisme/Entreprise</Label>
                            <Input id="organisme" placeholder="Nom de votre organisme" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email-contact">Email *</Label>
                            <Input id="email-contact" type="email" placeholder="votre.email@exemple.com" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="telephone-contact">Téléphone</Label>
                            <Input id="telephone-contact" placeholder="+235 XX XX XX XX" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sujet">Sujet de votre message *</Label>
                          <Select>
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
                          />
                        </div>

                        <Button size="lg" className="w-full">
                          <Send className="mr-2 h-5 w-5" />
                          Envoyer le message
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