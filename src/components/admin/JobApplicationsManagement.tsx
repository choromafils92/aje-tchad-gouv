import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download } from "lucide-react";
import * as XLSX from 'xlsx';

interface JobApplication {
  id: string;
  job_offer_id?: string;
  is_spontaneous: boolean;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cv_url?: string;
  lettre_motivation: string;
  statut: string;
  notes_internes?: string;
  created_at: string;
  job_offers?: {
    title: string;
  };
}

export default function JobApplicationsManagement() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("job_applications")
        .select(`
          *,
          job_offers (title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des candidatures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, statut: string, notes?: string) => {
    try {
      const { error } = await (supabase as any)
        .from("job_applications")
        .update({ statut, notes_internes: notes })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: "La candidature a été mise à jour avec succès",
      });

      fetchApplications();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "nouveau":
        return "bg-blue-500";
      case "en_cours":
        return "bg-yellow-500";
      case "accepte":
        return "bg-green-500";
      case "refuse":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "nouveau":
        return "Nouveau";
      case "en_cours":
        return "En cours";
      case "accepte":
        return "Accepté";
      case "refuse":
        return "Refusé";
      default:
        return statut;
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = applications.map(app => ({
        'Prénom': app.prenom,
        'Nom': app.nom,
        'Email': app.email,
        'Téléphone': app.telephone,
        'Poste': app.is_spontaneous ? 'Candidature spontanée' : app.job_offers?.title || 'N/A',
        'Type': app.is_spontaneous ? 'Spontanée' : 'Offre',
        'Statut': getStatusLabel(app.statut),
        'CV URL': app.cv_url || 'Non fourni',
        'Date': new Date(app.created_at).toLocaleDateString('fr-FR'),
        'Notes internes': app.notes_internes || ''
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Candidatures');
      
      // Générer le fichier
      XLSX.writeFile(wb, `candidatures_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast({
        title: "Export réussi",
        description: "Les candidatures ont été exportées en Excel",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des candidatures</h2>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Candidatures reçues</CardTitle>
              <CardDescription>
                Gérez les candidatures aux offres d'emploi et les candidatures spontanées
              </CardDescription>
            </div>
            <Button onClick={exportToExcel} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter en Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    {app.prenom} {app.nom}
                  </TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>
                    {app.is_spontaneous ? (
                      <span className="text-muted-foreground italic">Spontanée</span>
                    ) : (
                      app.job_offers?.title || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={app.is_spontaneous ? "secondary" : "default"}>
                      {app.is_spontaneous ? "Spontanée" : "Offre"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(app.statut)}>
                      {getStatusLabel(app.statut)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(app.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApp(app);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Candidat
                  </Label>
                  <p className="text-lg font-medium">
                    {selectedApp.prenom} {selectedApp.nom}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Téléphone
                  </Label>
                  <p>{selectedApp.telephone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p>{selectedApp.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Date de candidature
                  </Label>
                  <p>{new Date(selectedApp.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Poste visé
                </Label>
                <p className="mt-1">
                  {selectedApp.is_spontaneous ? (
                    <Badge variant="secondary">Candidature spontanée</Badge>
                  ) : (
                    selectedApp.job_offers?.title || "N/A"
                  )}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Lettre de motivation
                </Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedApp.lettre_motivation}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={selectedApp.statut}
                  onValueChange={(value) =>
                    setSelectedApp({ ...selectedApp, statut: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nouveau">Nouveau</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="accepte">Accepté</SelectItem>
                    <SelectItem value="refuse">Refusé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes internes</Label>
                <Textarea
                  value={selectedApp.notes_internes || ""}
                  onChange={(e) =>
                    setSelectedApp({
                      ...selectedApp,
                      notes_internes: e.target.value,
                    })
                  }
                  placeholder="Ajoutez des notes internes..."
                  className="min-h-24"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Fermer
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedApp.id,
                      selectedApp.statut,
                      selectedApp.notes_internes
                    )
                  }
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
