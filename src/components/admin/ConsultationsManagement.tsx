import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, CheckCircle } from "lucide-react";

interface Consultation {
  id: string;
  numero_reference: string;
  organisme: string;
  nom_demandeur: string;
  fonction: string;
  email: string;
  telephone: string;
  objet: string;
  contexte: string;
  statut: string;
  date_consultation?: string;
  notes_internes?: string;
  created_at: string;
}

const ConsultationsManagement = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [notes, setNotes] = useState("");
  const [statut, setStatut] = useState("");
  const [dateConsultation, setDateConsultation] = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from("consultations_juridiques" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des consultations");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedConsultation) return;

    try {
      const { error } = await supabase
        .from("consultations_juridiques" as any)
        .update({
          statut,
          notes_internes: notes,
          date_consultation: dateConsultation || null,
          conseiller_assigne: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", selectedConsultation.id);

      if (error) throw error;
      toast.success("Consultation mise à jour");
      setSelectedConsultation(null);
      fetchConsultations();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const openDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setNotes(consultation.notes_internes || "");
    setStatut(consultation.statut);
    setDateConsultation(consultation.date_consultation ? 
      new Date(consultation.date_consultation).toISOString().split('T')[0] : "");
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "nouveau": return "bg-blue-500";
      case "planifie": return "bg-purple-500";
      case "en_cours": return "bg-yellow-500";
      case "termine": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "nouveau": return "Nouveau";
      case "planifie": return "Planifié";
      case "en_cours": return "En cours";
      case "termine": return "Terminé";
      default: return statut;
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Consultations Juridiques</CardTitle>
        <CardDescription>
          Suivi des demandes de consultation préventive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Référence</TableHead>
              <TableHead>Organisme</TableHead>
              <TableHead>Demandeur</TableHead>
              <TableHead>Objet</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date consultation</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((consultation) => (
              <TableRow key={consultation.id}>
                <TableCell className="font-medium">{consultation.numero_reference}</TableCell>
                <TableCell>{consultation.organisme}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{consultation.nom_demandeur}</div>
                    <div className="text-muted-foreground">{consultation.fonction}</div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{consultation.objet}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(consultation.statut)}>
                    {getStatusLabel(consultation.statut)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {consultation.date_consultation ? 
                    new Date(consultation.date_consultation).toLocaleDateString('fr-FR') : 
                    "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDetails(consultation)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Consultation {selectedConsultation?.numero_reference}</DialogTitle>
            </DialogHeader>
            {selectedConsultation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Organisme</Label>
                    <p className="text-sm font-medium">{selectedConsultation.organisme}</p>
                  </div>
                  <div>
                    <Label>Demandeur</Label>
                    <p className="text-sm font-medium">
                      {selectedConsultation.nom_demandeur} ({selectedConsultation.fonction})
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{selectedConsultation.email}</p>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <p className="text-sm">{selectedConsultation.telephone}</p>
                  </div>
                </div>

                <div>
                  <Label>Objet de la consultation</Label>
                  <p className="text-sm mt-1 font-medium">{selectedConsultation.objet}</p>
                </div>

                <div>
                  <Label>Contexte détaillé</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
                    {selectedConsultation.contexte}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="statut">Statut</Label>
                    <Select value={statut} onValueChange={setStatut}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nouveau">Nouveau</SelectItem>
                        <SelectItem value="planifie">Planifié</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Date de consultation</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={dateConsultation}
                      onChange={(e) => setDateConsultation(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes internes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez vos notes de suivi et compte-rendu..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedConsultation(null)}>
                    Fermer
                  </Button>
                  <Button onClick={handleUpdate}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mettre à jour
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ConsultationsManagement;
