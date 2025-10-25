import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Send, User, Mail, Phone, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

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

const contactSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  prenom: z.string().trim().min(1, "Le prénom est requis").max(100, "Le prénom ne peut pas dépasser 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  telephone: z.string().trim().max(20, "Le téléphone ne peut pas dépasser 20 caractères").optional(),
  organisation: z.string().trim().min(1, "L'organisation est requise").max(200, "L'organisation ne peut pas dépasser 200 caractères"),
  poste: z.string().trim().max(100, "Le poste ne peut pas dépasser 100 caractères").optional(),
  sujet: z.string().trim().min(1, "Le sujet est requis").max(200, "Le sujet ne peut pas dépasser 200 caractères"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(2000, "Le message ne peut pas dépasser 2000 caractères"),
  urgence: z.enum(['normal', 'urgent', 'tres-urgent', 'immediat'])
});

const ContactForm = () => {
  const { toast } = useToast();
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

    try {
      // Validation côté client
      const validatedData = contactSchema.parse({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone || undefined,
        organisation: formData.organisation,
        poste: formData.poste || undefined,
        sujet: formData.sujet,
        message: formData.message,
        urgence: formData.urgence
      });

      // Générer la référence via la fonction
      const refResponse = await supabase.functions.invoke('generate-reference', {
        body: { formType: 'contact', formCode: 'CT' }
      });

      const numeroReference = refResponse.data?.reference || `CT-${Date.now().toString().slice(-6)}`;

      const { error } = await (supabase as any).from('contacts').insert({
        nom: `${validatedData.prenom} ${validatedData.nom}`,
        email: validatedData.email,
        telephone: validatedData.telephone,
        sujet: validatedData.sujet,
        message: validatedData.message,
        numero_reference: numeroReference,
        statut: 'nouveau'
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: `Votre message a été envoyé avec succès!\nRéférence: ${numeroReference}`,
      });
      
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Erreur de validation",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de l'envoi. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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