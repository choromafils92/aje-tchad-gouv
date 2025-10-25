import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Scale, FileText, Download, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface AvisFormData {
  organisation: string;
  demandeur: string;
  fonction: string;
  email: string;
  telephone: string;
  objet: string;
  contexte: string;
  questionJuridique: string;
  urgence: string;
  documentsFournis: string[];
  delaiSouhaite: string;
  budgetEstime: string;
  confirmationLecture: boolean;
}

const avisSchema = z.object({
  organisation: z.string().trim().min(1, "L'organisation est requise").max(200, "L'organisation ne peut pas dépasser 200 caractères"),
  demandeur: z.string().trim().min(1, "Le nom du demandeur est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  fonction: z.string().trim().min(1, "La fonction est requise").max(100, "La fonction ne peut pas dépasser 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  telephone: z.string().trim().max(20, "Le téléphone ne peut pas dépasser 20 caractères").optional(),
  objet: z.string().trim().min(1, "L'objet est requis").max(300, "L'objet ne peut pas dépasser 300 caractères"),
  contexte: z.string().trim().min(10, "Le contexte doit contenir au moins 10 caractères").max(5000, "Le contexte ne peut pas dépasser 5000 caractères"),
  questionJuridique: z.string().trim().min(10, "La question juridique doit contenir au moins 10 caractères").max(3000, "La question ne peut pas dépasser 3000 caractères"),
  urgence: z.enum(['normal', 'urgent', 'tres-urgent', 'immediat']),
  delaiSouhaite: z.string().trim().max(100).optional(),
  budgetEstime: z.string().trim().max(50).optional(),
  confirmationLecture: z.boolean().refine(val => val === true, "Vous devez accepter les conditions")
});

const AvisJuridiqueForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AvisFormData>({
    organisation: "",
    demandeur: "",
    fonction: "",
    email: "",
    telephone: "",
    objet: "",
    contexte: "",
    questionJuridique: "",
    urgence: "normal",
    documentsFournis: [],
    delaiSouhaite: "",
    budgetEstime: "",
    confirmationLecture: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof AvisFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (document: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documentsFournis: checked 
        ? [...prev.documentsFournis, document]
        : prev.documentsFournis.filter(d => d !== document)
    }));
  };

  const generatePDF = async (numeroReference?: string) => {
    const reference = numeroReference || `DA-${Date.now().toString().slice(-8)}`;
    const pdfContent = `
DEMANDE D'AVIS JURIDIQUE
Agence Judiciaire de l'État du Tchad

=====================================

RÉFÉRENCE: ${reference}

=====================================

INFORMATIONS DU DEMANDEUR
Organisation: ${formData.organisation}
Demandeur: ${formData.demandeur}
Fonction: ${formData.fonction}
Email: ${formData.email}
Téléphone: ${formData.telephone}

=====================================

OBJET DE LA DEMANDE
${formData.objet}

CONTEXTE FACTUEL
${formData.contexte}

QUESTION JURIDIQUE PRÉCISE
${formData.questionJuridique}

=====================================

INFORMATIONS COMPLÉMENTAIRES
Niveau d'urgence: ${formData.urgence}
Délai souhaité: ${formData.delaiSouhaite}
Budget estimé: ${formData.budgetEstime}

Documents fournis:
${formData.documentsFournis.map(doc => `- ${doc}`).join('\n')}

=====================================

Date de la demande: ${new Date().toLocaleDateString('fr-FR')}

Cette demande sera traitée conformément aux procédures de l'AJE.
Pour toute question, merci de mentionner la référence ci-dessus.
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Demande_Avis_Juridique_${reference}.txt`;
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation côté client
      const validatedData = avisSchema.parse({
        organisation: formData.organisation,
        demandeur: formData.demandeur,
        fonction: formData.fonction,
        email: formData.email,
        telephone: formData.telephone || undefined,
        objet: formData.objet,
        contexte: formData.contexte,
        questionJuridique: formData.questionJuridique,
        urgence: formData.urgence,
        delaiSouhaite: formData.delaiSouhaite || undefined,
        budgetEstime: formData.budgetEstime || undefined,
        confirmationLecture: formData.confirmationLecture
      });

      // Générer la référence via la fonction
      const refResponse = await supabase.functions.invoke('generate-reference', {
        body: { formType: 'demande_avis', formCode: 'DA' }
      });

      const numeroReference = refResponse.data?.reference || `DA-${Date.now().toString().slice(-6)}`;

      const { error } = await (supabase as any).from('demandes_avis').insert({
        nom_complet: validatedData.demandeur,
        email: validatedData.email,
        telephone: validatedData.telephone,
        organisme: validatedData.organisation,
        objet: validatedData.objet,
        description: `${validatedData.contexte}\n\nQuestion juridique: ${validatedData.questionJuridique}`,
        numero_reference: numeroReference,
        statut: 'en_attente'
      });

      if (error) throw error;

      toast({
        title: "Demande enregistrée",
        description: `Votre demande a été enregistrée avec succès!\nRéférence: ${numeroReference}`,
      });
      
      generatePDF(numeroReference);
      
      setFormData({
        organisation: "",
        demandeur: "",
        fonction: "",
        email: "",
        telephone: "",
        objet: "",
        contexte: "",
        questionJuridique: "",
        urgence: "normal",
        documentsFournis: [],
        delaiSouhaite: "",
        budgetEstime: "",
        confirmationLecture: false
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

  const documentsTypes = [
    "Projet de contrat/convention",
    "Décision administrative contestée", 
    "Correspondances litigieuses",
    "Textes juridiques applicables",
    "Jurisprudence pertinente",
    "Rapports d'expertise",
    "Pièces comptables/financières",
    "Autres documents (préciser en commentaire)"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="w-6 h-6 text-primary" />
            <span>Demande d'Avis Juridique</span>
          </CardTitle>
          <CardDescription>
            Formulaire officiel pour solliciter un avis juridique de l'Agence Judiciaire de l'État
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations du demandeur */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Identification du demandeur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organisation">Organisation/Administration *</Label>
                <Input
                  id="organisation"
                  placeholder="Ministère, établissement public, collectivité..."
                  value={formData.organisation}
                  onChange={(e) => handleInputChange("organisation", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demandeur">Nom du demandeur *</Label>
                <Input
                  id="demandeur"
                  placeholder="Nom et prénom"
                  value={formData.demandeur}
                  onChange={(e) => handleInputChange("demandeur", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fonction">Fonction *</Label>
                <Input
                  id="fonction"
                  placeholder="Directeur, Chef de service..."
                  value={formData.fonction}
                  onChange={(e) => handleInputChange("fonction", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@organisation.td"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  placeholder="+235 XX XX XX XX"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nature de la demande */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Objet de la demande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="objet">Objet précis de la demande *</Label>
              <Input
                id="objet"
                placeholder="Ex: Validité d'une clause contractuelle, légalité d'une procédure..."
                value={formData.objet}
                onChange={(e) => handleInputChange("objet", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contexte">Contexte factuel détaillé *</Label>
              <Textarea
                id="contexte"
                placeholder="Décrivez la situation, les faits, l'historique du dossier..."
                className="min-h-32"
                value={formData.contexte}
                onChange={(e) => handleInputChange("contexte", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionJuridique">Question juridique précise *</Label>
              <Textarea
                id="questionJuridique"
                placeholder="Formulez clairement la ou les questions juridiques à trancher..."
                className="min-h-24"
                value={formData.questionJuridique}
                onChange={(e) => handleInputChange("questionJuridique", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents et urgence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Documents et délais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Documents fournis (cocher les cases appropriées)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {documentsTypes.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`doc-${index}`}
                      checked={formData.documentsFournis.includes(doc)}
                      onCheckedChange={(checked) => handleDocumentChange(doc, checked as boolean)}
                    />
                    <Label htmlFor={`doc-${index}`} className="text-sm">
                      {doc}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urgence">Niveau d'urgence *</Label>
                <Select value={formData.urgence} onValueChange={(value) => handleInputChange("urgence", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (30 jours)</SelectItem>
                    <SelectItem value="urgent">Urgent (15 jours)</SelectItem>
                    <SelectItem value="tres-urgent">Très urgent (7 jours)</SelectItem>
                    <SelectItem value="immediat">Immédiat (24-48h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delaiSouhaite">Délai souhaité</Label>
                <Input
                  id="delaiSouhaite"
                  placeholder="Date limite souhaitée"
                  value={formData.delaiSouhaite}
                  onChange={(e) => handleInputChange("delaiSouhaite", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetEstime">Enjeu financier (FCFA)</Label>
                <Input
                  id="budgetEstime"
                  placeholder="Montant estimé du litige"
                  value={formData.budgetEstime}
                  onChange={(e) => handleInputChange("budgetEstime", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirmation"
                checked={formData.confirmationLecture}
                onCheckedChange={(checked) => handleInputChange("confirmationLecture", checked as boolean)}
                required
              />
              <Label htmlFor="confirmation" className="text-sm leading-relaxed">
                Je certifie que les informations fournies sont exactes et complètes. J'ai pris connaissance des conditions de traitement des demandes d'avis juridique par l'AJE et accepte que cette demande soit traitée selon les procédures en vigueur. *
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="submit" 
            className="flex-1" 
            size="lg"
            disabled={!formData.confirmationLecture || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Calendar className="w-4 h-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Soumettre la demande
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => generatePDF()}
            disabled={!formData.objet}
          >
            <Download className="w-4 h-4 mr-2" />
            Générer PDF
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Information importante :</p>
              <ul className="space-y-1 text-xs">
                <li>• Les demandes incomplètes ne seront pas traitées</li>
                <li>• Joindre tous les documents mentionnés par email après soumission</li>
                <li>• Un accusé de réception sera envoyé sous 24h</li>
                <li>• Les délais courent à compter de la réception du dossier complet</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AvisJuridiqueForm;