import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export const SignalerContentieuxDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organisme: "",
    nom: "",
    email: "",
    telephone: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Générer la référence via la fonction
      const refResponse = await supabase.functions.invoke('generate-reference', {
        body: { formType: 'signalement', formCode: 'SC' }
      });

      const numeroReference = refResponse.data?.reference || `SC-${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase
        .from("signalements_contentieux" as any)
        .insert({
          numero_dossier: numeroReference,
          organisme: formData.organisme,
          nom_demandeur: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          description: formData.description,
          priorite: "urgent"
        });

      if (error) throw error;
      
      toast.success(`Contentieux signalé avec succès!\nRéférence: ${numeroReference}`);
      setOpen(false);
      setFormData({
        organisme: "",
        nom: "",
        email: "",
        telephone: "",
        description: ""
      });
    } catch (error: any) {
      toast.error("Erreur lors du signalement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="lg" className="w-full sm:w-auto">
          <AlertCircle className="w-5 h-5 mr-2" />
          Signaler un Contentieux
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Signalement d'un Contentieux Urgent</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour signaler un contentieux urgent. Nous traiterons votre demande dans les plus brefs délais.
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
              <Label htmlFor="telephone">Votre téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+235 XX XX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du contentieux urgent *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez le contentieux, les parties impliquées, les enjeux et l'urgence..."
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
              {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
