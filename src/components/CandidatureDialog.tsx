import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CandidatureDialogProps {
  jobId?: string;
  jobTitle?: string;
  isSpontaneous?: boolean;
  children: React.ReactNode;
}

export default function CandidatureDialog({ jobId, jobTitle, isSpontaneous = false, children }: CandidatureDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    lettre_motivation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await (supabase as any).from("job_applications").insert({
        job_offer_id: jobId || null,
        is_spontaneous: isSpontaneous,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        lettre_motivation: formData.lettre_motivation,
        statut: "nouveau",
      });

      if (error) throw error;

      toast({
        title: "Candidature envoyée",
        description: "Votre candidature a été envoyée avec succès. Nous vous contacterons prochainement.",
      });

      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        lettre_motivation: "",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre candidature.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isSpontaneous ? "Candidature spontanée" : `Postuler - ${jobTitle}`}
          </DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour soumettre votre candidature
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lettre_motivation">Lettre de motivation *</Label>
            <Textarea
              id="lettre_motivation"
              value={formData.lettre_motivation}
              onChange={(e) => setFormData({ ...formData, lettre_motivation: e.target.value })}
              placeholder="Expliquez votre motivation et vos compétences..."
              className="min-h-32"
              required
            />
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-1">Note importante :</p>
            <p>Après validation de ce formulaire, vous recevrez un email avec les instructions pour envoyer votre CV.</p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer ma candidature
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
