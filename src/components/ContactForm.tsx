import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Send, User, Mail, Phone, Building } from "lucide-react";

interface ContactFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  organisation: string;
  poste: string;
  sujet: string;
  message: string;
  urgence: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    organisation: "",
    poste: "",
    sujet: "",
    message: "",
    urgence: "normal"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    setTimeout(() => {
      alert(`Votre message a été envoyé avec succès !
      
Détails de votre demande:
- Nom: ${formData.prenom} ${formData.nom}
- Organisation: ${formData.organisation}
- Sujet: ${formData.sujet}
- Niveau d'urgence: ${formData.urgence}

Nous vous contacterons dans les plus brefs délais à l'adresse: ${formData.email}`);
      
      // Reset form
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        organisation: "",
        poste: "",
        sujet: "",
        message: "",
        urgence: "normal"
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-primary" />
          <span>Formulaire de Contact</span>
        </CardTitle>
        <CardDescription>
          Contactez l'AJE pour toute demande d'information ou d'assistance juridique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="prenom"
                  placeholder="Votre prénom"
                  className="pl-10"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@organisation.td"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telephone"
                  placeholder="+235 XX XX XX XX"
                  className="pl-10"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Organisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organisation">Organisation *</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="organisation"
                  placeholder="Ministère, établissement public..."
                  className="pl-10"
                  value={formData.organisation}
                  onChange={(e) => handleInputChange("organisation", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poste">Fonction</Label>
              <Input
                id="poste"
                placeholder="Votre fonction/poste"
                value={formData.poste}
                onChange={(e) => handleInputChange("poste", e.target.value)}
              />
            </div>
          </div>

          {/* Sujet et urgence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sujet">Sujet de la demande *</Label>
              <Input
                id="sujet"
                placeholder="Objet de votre message"
                value={formData.sujet}
                onChange={(e) => handleInputChange("sujet", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgence">Niveau d'urgence</Label>
              <Select value={formData.urgence} onValueChange={(value) => handleInputChange("urgence", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (15 jours)</SelectItem>
                  <SelectItem value="urgent">Urgent (7 jours)</SelectItem>
                  <SelectItem value="tres-urgent">Très urgent (24-48h)</SelectItem>
                  <SelectItem value="immediat">Immédiat (même jour)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message détaillé *</Label>
            <Textarea
              id="message"
              placeholder="Décrivez précisément votre demande, le contexte, et les documents éventuellement annexés..."
              className="min-h-32"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Pour les demandes d'avis juridique, merci de joindre tous les documents pertinents
            </p>
          </div>

          {/* Bouton d'envoi */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Envoi en cours..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer la demande
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            * Champs obligatoires. Vos données sont traitées conformément à la politique de confidentialité de l'AJE.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;