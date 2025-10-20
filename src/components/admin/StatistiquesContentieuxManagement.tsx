import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Statistique {
  id: string;
  titre: string;
  valeur: string;
  evolution: string;
  icon_name: string;
  ordre: number;
  published: boolean;
  created_at: string;
}

const iconOptions = [
  { value: "FileText", label: "Dossiers (FileText)" },
  { value: "TrendingUp", label: "Tendance (TrendingUp)" },
  { value: "Clock", label: "Horloge (Clock)" },
  { value: "Scale", label: "Balance (Scale)" },
  { value: "CheckCircle", label: "Validation (CheckCircle)" },
  { value: "AlertCircle", label: "Alerte (AlertCircle)" },
  { value: "Users", label: "Utilisateurs (Users)" },
  { value: "BarChart", label: "Graphique (BarChart)" }
];

const StatistiquesContentieuxManagement = () => {
  const [statistiques, setStatistiques] = useState<Statistique[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatistique, setEditingStatistique] = useState<Statistique | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    valeur: "",
    evolution: "",
    icon_name: "FileText",
    ordre: 0,
    published: true
  });

  useEffect(() => {
    fetchStatistiques();
  }, []);

  const fetchStatistiques = async () => {
    try {
      const { data, error } = await supabase
        .from("statistiques_contentieux")
        .select("*")
        .order("ordre");

      if (error) throw error;
      setStatistiques(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (editingStatistique) {
        const { error } = await supabase
          .from("statistiques_contentieux")
          .update(formData)
          .eq("id", editingStatistique.id);

        if (error) throw error;
        toast.success("Statistique mise à jour");
      } else {
        const { error } = await supabase
          .from("statistiques_contentieux")
          .insert({ ...formData, created_by: user.id });

        if (error) throw error;
        toast.success("Statistique créée");
      }

      setDialogOpen(false);
      resetForm();
      fetchStatistiques();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette statistique ?")) return;

    try {
      const { error } = await supabase
        .from("statistiques_contentieux")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Statistique supprimée");
      fetchStatistiques();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const handleEdit = (stat: Statistique) => {
    setEditingStatistique(stat);
    setFormData({
      titre: stat.titre,
      valeur: stat.valeur,
      evolution: stat.evolution,
      icon_name: stat.icon_name,
      ordre: stat.ordre,
      published: stat.published
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingStatistique(null);
    setFormData({
      titre: "",
      valeur: "",
      evolution: "",
      icon_name: "FileText",
      ordre: 0,
      published: true
    });
  };

  const updateOrdre = async (id: string, newOrdre: number) => {
    try {
      const { error } = await supabase
        .from("statistiques_contentieux")
        .update({ ordre: newOrdre })
        .eq("id", id);

      if (error) throw error;
      fetchStatistiques();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Statistiques Contentieux</CardTitle>
            <CardDescription>Gérer les statistiques affichées sur la page contentieux</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingStatistique ? "Modifier" : "Ajouter"} une statistique
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations de la statistique
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    placeholder="Ex: Dossiers traités (2024)"
                  />
                </div>
                <div>
                  <Label>Valeur</Label>
                  <Input
                    value={formData.valeur}
                    onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                    placeholder="Ex: 2,847"
                  />
                </div>
                <div>
                  <Label>Évolution</Label>
                  <Input
                    value={formData.evolution}
                    onChange={(e) => setFormData({ ...formData, evolution: e.target.value })}
                    placeholder="Ex: +15% ou -8 jours"
                  />
                </div>
                <div>
                  <Label>Icône</Label>
                  <Select value={formData.icon_name} onValueChange={(value) => setFormData({ ...formData, icon_name: value })}>
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
                <div>
                  <Label>Ordre d'affichage</Label>
                  <Input
                    type="number"
                    value={formData.ordre}
                    onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label>Publié</Label>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editingStatistique ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statistiques.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{stat.titre}</span>
                  {!stat.published && <span className="text-xs text-muted-foreground">(Non publié)</span>}
                </div>
                <div className="text-sm text-muted-foreground">
                  Valeur: {stat.valeur} | Évolution: {stat.evolution} | Icône: {stat.icon_name}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateOrdre(stat.id, stat.ordre - 1)}
                  disabled={stat.ordre === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateOrdre(stat.id, stat.ordre + 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEdit(stat)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(stat.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatistiquesContentieuxManagement;
