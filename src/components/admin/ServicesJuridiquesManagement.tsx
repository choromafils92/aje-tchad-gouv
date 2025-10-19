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

interface ServiceJuridique {
  id: string;
  titre: string;
  description: string;
  delai: string;
  criteres: string[];
  icon_name: string;
  ordre: number;
  published: boolean;
}

const iconOptions = [
  { value: "FileText", label: "Fichier" },
  { value: "Users", label: "Utilisateurs" },
  { value: "CheckCircle", label: "Vérification" },
  { value: "AlertCircle", label: "Alerte" },
  { value: "Scale", label: "Balance" },
  { value: "Briefcase", label: "Mallette" },
  { value: "Shield", label: "Bouclier" },
  { value: "BookOpen", label: "Livre" }
];

const ServicesJuridiquesManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceJuridique[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceJuridique | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    delai: "",
    criteres: [] as string[],
    icon_name: "FileText",
    ordre: 0,
    published: true
  });
  const [newCritere, setNewCritere] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services_juridiques" as any)
        .select("*")
        .order("ordre", { ascending: true });

      if (error) throw error;
      setServices((data as any) || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      if (editingService) {
        const { error } = await supabase
          .from("services_juridiques" as any)
          .update({
            ...formData,
            criteres: formData.criteres
          })
          .eq("id", editingService.id);

        if (error) throw error;
        toast.success("Service mis à jour avec succès");
      } else {
        const { error } = await supabase
          .from("services_juridiques" as any)
          .insert({
            ...formData,
            criteres: formData.criteres,
            created_by: user.id
          });

        if (error) throw error;
        toast.success("Service créé avec succès");
      }

      setDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    try {
      const { error } = await supabase
        .from("services_juridiques" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Service supprimé avec succès");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (service: ServiceJuridique) => {
    setEditingService(service);
    setFormData({
      titre: service.titre,
      description: service.description,
      delai: service.delai,
      criteres: service.criteres || [],
      icon_name: service.icon_name,
      ordre: service.ordre,
      published: service.published
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      titre: "",
      description: "",
      delai: "",
      criteres: [],
      icon_name: "FileText",
      ordre: 0,
      published: true
    });
    setNewCritere("");
  };

  const addCritere = () => {
    if (newCritere.trim()) {
      setFormData({ ...formData, criteres: [...formData.criteres, newCritere.trim()] });
      setNewCritere("");
    }
  };

  const removeCritere = (index: number) => {
    setFormData({
      ...formData,
      criteres: formData.criteres.filter((_, i) => i !== index)
    });
  };

  const updateOrdre = async (id: string, newOrdre: number) => {
    try {
      const { error } = await supabase
        .from("services_juridiques" as any)
        .update({ ordre: newOrdre })
        .eq("id", id);

      if (error) throw error;
      fetchServices();
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
          <CardTitle>Gestion des Services Juridiques</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Modifier le service" : "Nouveau service"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre *</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
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
                  <Label htmlFor="delai">Délai *</Label>
                  <Input
                    id="delai"
                    value={formData.delai}
                    onChange={(e) => setFormData({ ...formData, delai: e.target.value })}
                    placeholder="Ex: 7-15 jours, Selon procédure..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Critères d'éligibilité</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCritere}
                      onChange={(e) => setNewCritere(e.target.value)}
                      placeholder="Ajouter un critère..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCritere())}
                    />
                    <Button type="button" onClick={addCritere}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.criteres.map((critere, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary p-2 rounded">
                        <span className="flex-1">{critere}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCritere(index)}
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
              <TableHead>Titre</TableHead>
              <TableHead>Délai</TableHead>
              <TableHead>Critères</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateOrdre(service.id, service.ordre - 1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateOrdre(service.id, service.ordre + 1)}
                      disabled={index === services.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{service.titre}</TableCell>
                <TableCell>{service.delai}</TableCell>
                <TableCell>{service.criteres?.length || 0} critères</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${service.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {service.published ? 'Publié' : 'Brouillon'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
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

export default ServicesJuridiquesManagement;
