import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DomaineContentieux {
  id: string;
  categorie: string;
  description: string;
  affaires: string[];
  statistiques: string;
  icon_name: string;
  ordre: number;
  published: boolean;
}

const iconOptions = [
  { value: "Building", label: "Bâtiment" },
  { value: "Scale", label: "Balance" },
  { value: "Briefcase", label: "Mallette" },
  { value: "Gavel", label: "Marteau" },
  { value: "UserCheck", label: "Utilisateur vérifié" },
  { value: "Shield", label: "Bouclier" },
  { value: "FileText", label: "Fichier" },
  { value: "Users", label: "Utilisateurs" }
];

const DomainesContentieuxManagement = () => {
  const { user } = useAuth();
  const [domaines, setDomaines] = useState<DomaineContentieux[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDomaine, setEditingDomaine] = useState<DomaineContentieux | null>(null);
  const [formData, setFormData] = useState({
    categorie: "",
    description: "",
    affaires: [] as string[],
    statistiques: "",
    icon_name: "Scale",
    ordre: 0,
    published: true
  });
  const [newAffaire, setNewAffaire] = useState("");

  useEffect(() => {
    fetchDomaines();
  }, []);

  const fetchDomaines = async () => {
    try {
      const { data, error } = await supabase
        .from("domaines_contentieux" as any)
        .select("*")
        .order("ordre", { ascending: true });

      if (error) throw error;
      setDomaines((data as any) || []);
    } catch (error) {
      console.error("Error fetching domaines:", error);
      toast.error("Erreur lors du chargement des domaines");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      if (editingDomaine) {
        const { error } = await supabase
          .from("domaines_contentieux" as any)
          .update({
            ...formData,
            affaires: formData.affaires
          })
          .eq("id", editingDomaine.id);

        if (error) throw error;
        toast.success("Domaine mis à jour avec succès");
      } else {
        const { error } = await supabase
          .from("domaines_contentieux" as any)
          .insert({
            ...formData,
            affaires: formData.affaires,
            created_by: user.id
          });

        if (error) throw error;
        toast.success("Domaine créé avec succès");
      }

      setDialogOpen(false);
      resetForm();
      fetchDomaines();
    } catch (error) {
      console.error("Error saving domaine:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce domaine ?")) return;

    try {
      const { error } = await supabase
        .from("domaines_contentieux" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Domaine supprimé avec succès");
      fetchDomaines();
    } catch (error) {
      console.error("Error deleting domaine:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (domaine: DomaineContentieux) => {
    setEditingDomaine(domaine);
    setFormData({
      categorie: domaine.categorie,
      description: domaine.description,
      affaires: domaine.affaires || [],
      statistiques: domaine.statistiques,
      icon_name: domaine.icon_name,
      ordre: domaine.ordre,
      published: domaine.published
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDomaine(null);
    setFormData({
      categorie: "",
      description: "",
      affaires: [],
      statistiques: "",
      icon_name: "Scale",
      ordre: 0,
      published: true
    });
    setNewAffaire("");
  };

  const addAffaire = () => {
    if (newAffaire.trim()) {
      setFormData({ ...formData, affaires: [...formData.affaires, newAffaire.trim()] });
      setNewAffaire("");
    }
  };

  const removeAffaire = (index: number) => {
    setFormData({
      ...formData,
      affaires: formData.affaires.filter((_, i) => i !== index)
    });
  };

  const updateOrdre = async (id: string, newOrdre: number) => {
    try {
      const { error } = await supabase
        .from("domaines_contentieux" as any)
        .update({ ordre: newOrdre })
        .eq("id", id);

      if (error) throw error;
      fetchDomaines();
    } catch (error) {
      console.error("Error updating ordre:", error);
      toast.error("Erreur lors de la mise à jour de l'ordre");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion des Domaines de Contentieux</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un domaine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDomaine ? "Modifier le domaine" : "Nouveau domaine"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categorie">Catégorie *</Label>
                  <Input
                    id="categorie"
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    placeholder="Ex: Contentieux Administratif"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statistiques">Statistiques *</Label>
                  <Input
                    id="statistiques"
                    value={formData.statistiques}
                    onChange={(e) => setFormData({ ...formData, statistiques: e.target.value })}
                    placeholder="Ex: 67% des dossiers"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Types d'affaires</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAffaire}
                      onChange={(e) => setNewAffaire(e.target.value)}
                      placeholder="Ajouter un type d'affaire..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAffaire())}
                    />
                    <Button type="button" onClick={addAffaire}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.affaires.map((affaire, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary p-2 rounded">
                        <span className="flex-1">{affaire}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAffaire(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icône</Label>
                    <Select
                      value={formData.icon_name}
                      onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ordre">Ordre d'affichage</Label>
                    <Input
                      id="ordre"
                      type="number"
                      value={formData.ordre}
                      onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Publié</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statistiques</TableHead>
              <TableHead>Affaires</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domaines.map((domaine, index) => (
              <TableRow key={domaine.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateOrdre(domaine.id, domaine.ordre - 1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateOrdre(domaine.id, domaine.ordre + 1)}
                      disabled={index === domaines.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{domaine.categorie}</TableCell>
                <TableCell>{domaine.statistiques}</TableCell>
                <TableCell>{domaine.affaires?.length || 0} types</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${domaine.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {domaine.published ? 'Publié' : 'Brouillon'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(domaine)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(domaine.id)}>
                      <Trash2 className="h-4 w-4" />
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

export default DomainesContentieuxManagement;
