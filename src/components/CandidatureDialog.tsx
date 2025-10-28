import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { z } from "zod";

interface CandidatureDialogProps {
  jobId?: string;
  jobTitle?: string;
  isSpontaneous?: boolean;
  children: React.ReactNode;
}

const candidatureSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne doit pas dépasser 100 caractères"),
  prenom: z.string().trim().min(1, "Le prénom est requis").max(100, "Le prénom ne doit pas dépasser 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne doit pas dépasser 255 caractères"),
  telephone: z.string().trim().min(1, "Le téléphone est requis").max(20, "Le téléphone ne doit pas dépasser 20 caractères"),
  lettre_motivation: z.string().trim().min(10, "La lettre doit contenir au moins 10 caractères").max(5000, "La lettre ne doit pas dépasser 5000 caractères"),
});

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
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = candidatureSchema.parse(formData);

      // Upload CV file if provided
      let cvUrl = null;
      if (cvFile) {
        setIsUploading(true);
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `cv-files/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('documents-files')
          .upload(filePath, cvFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents-files')
          .getPublicUrl(filePath);

        cvUrl = publicUrl;
        setIsUploading(false);
      }

      const { error } = await (supabase as any).from("job_applications").insert({
        job_offer_id: jobId || null,
        is_spontaneous: isSpontaneous,
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        email: validatedData.email,
        telephone: validatedData.telephone,
        lettre_motivation: validatedData.lettre_motivation,
        cv_url: cvUrl,
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
      setCvFile(null);
      setOpen(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de l'envoi de votre candidature.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
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

          <div className="space-y-2">
            <Label htmlFor="cv">Documents (CV, Lettre de motivation, etc.) - Format PDF</Label>
            <Input
              id="cv"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.type !== 'application/pdf') {
                    toast({
                      title: "Format invalide",
                      description: "Veuillez sélectionner un fichier PDF",
                      variant: "destructive",
                    });
                    e.target.value = '';
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    toast({
                      title: "Fichier trop volumineux",
                      description: "La taille maximale est de 5 MB",
                      variant: "destructive",
                    });
                    e.target.value = '';
                    return;
                  }
                  setCvFile(file);
                }
              }}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Téléchargez vos documents en un seul fichier PDF (max 5 MB)
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Téléchargement..." : "Envoyer ma candidature"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
