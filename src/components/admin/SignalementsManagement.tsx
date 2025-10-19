import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, CheckCircle } from "lucide-react";

interface Signalement {
  id: string;
  numero_dossier: string;
  organisme: string;
  nom_demandeur: string;
  email: string;
  telephone: string;
  description: string;
  statut: string;
  priorite: string;
  notes_internes?: string;
  created_at: string;
}

const SignalementsManagement = () => {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignalement, setSelectedSignalement] = useState<Signalement | null>(null);
  const [notes, setNotes] = useState("");
  const [statut, setStatut] = useState("");

  useEffect(() => {
    fetchSignalements();
  }, []);

  const fetchSignalements = async () => {
    try {
      const { data, error } = await supabase
        .from("signalements_contentieux" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSignalements(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des signalements");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedSignalement) return;

    try {
      const { error } = await supabase
        .from("signalements_contentieux" as any)
        .update({
          statut,
          notes_internes: notes,
          traite_par: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", selectedSignalement.id);

      if (error) throw error;
      toast.success("Signalement mis à jour");
      setSelectedSignalement(null);
      fetchSignalements();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const openDetails = (signalement: Signalement) => {
    setSelectedSignalement(signalement);
    setNotes(signalement.notes_internes || "");
    setStatut(signalement.statut);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "nouveau": return "bg-blue-500";
      case "en_cours": return "bg-yellow-500";
      case "traite": return "bg-green-500";
      case "clos": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "nouveau": return "Nouveau";
      case "en_cours": return "En cours";
      case "traite": return "Traité";
      case "clos": return "Clos";
      default: return statut;
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Signalements Urgents</CardTitle>
        <CardDescription>
          Suivi des contentieux signalés par les administrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Dossier</TableHead>
              <TableHead>Organisme</TableHead>
              <TableHead>Demandeur</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signalements.map((signalement) => (
              <TableRow key={signalement.id}>
                <TableCell className="font-medium">{signalement.numero_dossier}</TableCell>
                <TableCell>{signalement.organisme}</TableCell>
                <TableCell>{signalement.nom_demandeur}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{signalement.email}</div>
                    <div className="text-muted-foreground">{signalement.telephone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={signalement.priorite === "tres_urgent" ? "destructive" : "default"}>
                    {signalement.priorite === "tres_urgent" ? "Très urgent" : "Urgent"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(signalement.statut)}>
                    {getStatusLabel(signalement.statut)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(signalement.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDetails(signalement)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!selectedSignalement} onOpenChange={() => setSelectedSignalement(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du signalement {selectedSignalement?.numero_dossier}</DialogTitle>
            </DialogHeader>
            {selectedSignalement && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Organisme</Label>
                    <p className="text-sm font-medium">{selectedSignalement.organisme}</p>
                  </div>
                  <div>
                    <Label>Demandeur</Label>
                    <p className="text-sm font-medium">{selectedSignalement.nom_demandeur}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{selectedSignalement.email}</p>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <p className="text-sm">{selectedSignalement.telephone}</p>
                  </div>
                </div>

                <div>
                  <Label>Description du contentieux</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                    {selectedSignalement.description}
                  </p>
                </div>

                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={statut} onValueChange={setStatut}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouveau">Nouveau</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="traite">Traité</SelectItem>
                      <SelectItem value="clos">Clos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes internes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez vos notes de suivi..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedSignalement(null)}>
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

export default SignalementsManagement;
