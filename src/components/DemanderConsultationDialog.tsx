import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText } from "lucide-react";

export const DemanderConsultationDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organisme: "",
    nom: "",
    fonction: "",
    email: "",
    telephone: "",
    objet: "",
    contexte: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Générer la référence via la fonction
      const refResponse = await supabase.functions.invoke('generate-reference', {
        body: { formType: 'consultation', formCode: 'CJ' }
      });

      const numeroReference = refResponse.data?.reference || `CJ-${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase
        .from("consultations_juridiques" as any)
        .insert({
          numero_reference: numeroReference,
          organisme: formData.organisme,
          nom_demandeur: formData.nom,
          fonction: formData.fonction,
          email: formData.email,
          telephone: formData.telephone,
          objet: formData.objet,
          contexte: formData.contexte
        });

      if (error) throw error;

      // Envoyer l'email de confirmation automatique
      try {
        await supabase.functions.invoke('send-confirmation-email', {
          body: {
            type: 'consultation',
            email: formData.email,
            nom: formData.nom,
            reference: numeroReference,
            data: {
              organisme: formData.organisme,
              objet: formData.objet
            }
          }
        });
      } catch (emailError) {
        console.error('Erreur email confirmation:', emailError);
      }
      
      toast.success(`Consultation enregistrée!\nRéférence: ${numeroReference}\nNous vous contacterons sous 48h.`);
      setOpen(false);
      setFormData({
        organisme: "",
        nom: "",
        fonction: "",
        email: "",
        telephone: "",
        objet: "",
        contexte: ""
      });
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="w-full sm:w-auto">
          <FileText className="w-5 h-5 mr-2" />
          Demander une Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Demande de Consultation Juridique</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour demander une consultation juridique préventive. Nous vous répondrons sous 48h.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="organisme">Nom de votre organisme *</Label>
              <Input
                id="organisme"
                required
                value={formData.organisme}
                onChange={(e) => setFormData({ ...formData, organisme: e.target.value })}
                placeholder="Ex: Ministère de l'Économie"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Votre nom complet *</Label>
              <Input
                id="nom"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Prénom et nom"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fonction">Votre fonction *</Label>
              <Input
                id="fonction"
                required
                value={formData.fonction}
                onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
                placeholder="Ex: Directeur des Affaires Juridiques"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Votre email professionnel *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.td"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Votre téléphone *</Label>
              <Input
                id="telephone"
                type="tel"
                required
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+235 XX XX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objet">Objet de la consultation *</Label>
              <Input
                id="objet"
                required
                value={formData.objet}
                onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
                placeholder="Résumé en une ligne"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contexte">Contexte détaillé *</Label>
              <Textarea
                id="contexte"
                required
                value={formData.contexte}
                onChange={(e) => setFormData({ ...formData, contexte: e.target.value })}
                placeholder="Décrivez le contexte, les enjeux juridiques et les questions spécifiques..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
