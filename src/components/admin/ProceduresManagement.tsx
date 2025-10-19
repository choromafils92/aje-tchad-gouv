import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Procedure {
  id: string;
  ordre: number;
  etape: string;
  description: string;
  delai: string;
  documents: string[];
  published: boolean;
}

const ProceduresManagement = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [formData, setFormData] = useState({
    etape: "",
    description: "",
    delai: "",
    documents: "",
    published: true
  });

  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    try {
      const { data, error } = await supabase
        .from("procedures_contentieux")
        .select("*")
        .order("ordre", { ascending: true });

      if (error) throw error;
      setProcedures(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des procédures");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const documentsArray = formData.documents.split(",").map(d => d.trim()).filter(d => d);
      
      if (editingProcedure) {
        const { error } = await supabase
          .from("procedures_contentieux")
          .update({
            etape: formData.etape,
            description: formData.description,
            delai: formData.delai,
            documents: documentsArray,
            published: formData.published
          })
          .eq("id", editingProcedure.id);

        if (error) throw error;
        toast.success("Procédure modifiée avec succès");
      } else {
        const maxOrdre = procedures.length > 0 ? Math.max(...procedures.map(p => p.ordre)) : 0;
        
        const { error } = await supabase
          .from("procedures_contentieux")
          .insert({
            ordre: maxOrdre + 1,
            etape: formData.etape,
            description: formData.description,
            delai: formData.delai,
            documents: documentsArray,
            published: formData.published,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
        toast.success("Procédure ajoutée avec succès");
      }

      setIsDialogOpen(false);
      setEditingProcedure(null);
      setFormData({ etape: "", description: "", delai: "", documents: "", published: true });
      fetchProcedures();
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (procedure: Procedure) => {
    setEditingProcedure(procedure);
    setFormData({
      etape: procedure.etape,
      description: procedure.description,
      delai: procedure.delai,
      documents: procedure.documents.join(", "),
      published: procedure.published
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette procédure ?")) return;

    try {
      const { error } = await supabase
        .from("procedures_contentieux")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Procédure supprimée");
      fetchProcedures();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const moveOrder = async (procedure: Procedure, direction: "up" | "down") => {
    const currentIndex = procedures.findIndex(p => p.id === procedure.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= procedures.length) return;

    const targetProcedure = procedures[targetIndex];

    try {
      await supabase
        .from("procedures_contentieux")
        .update({ ordre: targetProcedure.ordre })
        .eq("id", procedure.id);

      await supabase
        .from("procedures_contentieux")
        .update({ ordre: procedure.ordre })
        .eq("id", targetProcedure.id);

      fetchProcedures();
      toast.success("Ordre modifié");
    } catch (error: any) {
      toast.error("Erreur lors du changement d'ordre");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Procédures de Contentieux</CardTitle>
        <CardDescription>
          Gérez les étapes de traitement des dossiers contentieux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4" onClick={() => {
              setEditingProcedure(null);
              setFormData({ etape: "", description: "", delai: "", documents: "", published: true });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une procédure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProcedure ? "Modifier la procédure" : "Nouvelle procédure"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="etape">Étape *</Label>
                <Input
                  id="etape"
                  value={formData.etape}
                  onChange={(e) => setFormData({ ...formData, etape: e.target.value })}
                  placeholder="Ex: 1. Saisine"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de l'étape"
                  required
                />
              </div>
              <div>
                <Label htmlFor="delai">Délai *</Label>
                <Input
                  id="delai"
                  value={formData.delai}
                  onChange={(e) => setFormData({ ...formData, delai: e.target.value })}
                  placeholder="Ex: 2-5 jours"
                  required
                />
              </div>
              <div>
                <Label htmlFor="documents">Documents (séparés par des virgules) *</Label>
                <Textarea
                  id="documents"
                  value={formData.documents}
                  onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                  placeholder="Ex: Dossier complet, Pièces justificatives"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Publié</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingProcedure ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordre</TableHead>
              <TableHead>Étape</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Délai</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.map((procedure, index) => (
              <TableRow key={procedure.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{procedure.ordre}</span>
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOrder(procedure, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOrder(procedure, "down")}
                        disabled={index === procedures.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{procedure.etape}</TableCell>
                <TableCell>{procedure.description}</TableCell>
                <TableCell>{procedure.delai}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {procedure.documents.join(", ")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={procedure.published ? "default" : "secondary"}>
                    {procedure.published ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(procedure)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(procedure.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProceduresManagement;
