import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Jurisprudence {
  id: string;
  affaire: string;
  juridiction: string;
  domaine: string;
  date: string;
  resultat: string;
  resume: string;
  published: boolean;
  created_at: string;
}

const JurisprudencesManagement = () => {
  const [jurisprudences, setJurisprudences] = useState<Jurisprudence[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJurisprudence, setEditingJurisprudence] = useState<Jurisprudence | null>(null);
  const [formData, setFormData] = useState({
    affaire: "",
    juridiction: "",
    domaine: "",
    date: "",
    resultat: "",
    resume: "",
    published: true
  });

  useEffect(() => {
    fetchJurisprudences();
  }, []);

  const fetchJurisprudences = async () => {
    try {
      const { data, error } = await supabase
        .from("jurisprudences")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setJurisprudences(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des jurisprudences");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (editingJurisprudence) {
        const { error } = await supabase
          .from("jurisprudences")
          .update(formData)
          .eq("id", editingJurisprudence.id);

        if (error) throw error;
        toast.success("Jurisprudence mise à jour");
      } else {
        const { error } = await supabase
          .from("jurisprudences")
          .insert({ ...formData, created_by: user.id });

        if (error) throw error;
        toast.success("Jurisprudence créée");
      }

      setDialogOpen(false);
      resetForm();
      fetchJurisprudences();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette jurisprudence ?")) return;

    try {
      const { error } = await supabase
        .from("jurisprudences")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Jurisprudence supprimée");
      fetchJurisprudences();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const handleEdit = (juris: Jurisprudence) => {
    setEditingJurisprudence(juris);
    setFormData({
      affaire: juris.affaire,
      juridiction: juris.juridiction,
      domaine: juris.domaine,
      date: juris.date,
      resultat: juris.resultat,
      resume: juris.resume,
      published: juris.published
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingJurisprudence(null);
    setFormData({
      affaire: "",
      juridiction: "",
      domaine: "",
      date: "",
      resultat: "",
      resume: "",
      published: true
    });
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
            <CardTitle>Jurisprudences</CardTitle>
            <CardDescription>Gérer les jurisprudences affichées sur la page contentieux</CardDescription>
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingJurisprudence ? "Modifier" : "Ajouter"} une jurisprudence
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations de la jurisprudence
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Affaire</Label>
                  <Input
                    value={formData.affaire}
                    onChange={(e) => setFormData({ ...formData, affaire: e.target.value })}
                    placeholder="Ex: État du Tchad c. Société ALPHA"
                  />
                </div>
                <div>
                  <Label>Juridiction</Label>
                  <Input
                    value={formData.juridiction}
                    onChange={(e) => setFormData({ ...formData, juridiction: e.target.value })}
                    placeholder="Ex: Cour Suprême du Tchad"
                  />
                </div>
                <div>
                  <Label>Domaine</Label>
                  <Input
                    value={formData.domaine}
                    onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
                    placeholder="Ex: Marchés Publics"
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Résultat</Label>
                  <Input
                    value={formData.resultat}
                    onChange={(e) => setFormData({ ...formData, resultat: e.target.value })}
                    placeholder="Ex: Favorable ou Transactionnel"
                  />
                </div>
                <div>
                  <Label>Résumé</Label>
                  <Textarea
                    value={formData.resume}
                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                    placeholder="Résumé de la jurisprudence"
                    rows={4}
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
                  {editingJurisprudence ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jurisprudences.map((juris) => (
            <div key={juris.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{juris.affaire}</span>
                  {!juris.published && <span className="text-xs text-muted-foreground">(Non publié)</span>}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {juris.juridiction} - {juris.date}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Domaine:</span> {juris.domaine} | 
                  <span className="font-medium"> Résultat:</span> {juris.resultat}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {juris.resume}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="icon" onClick={() => handleEdit(juris)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(juris.id)}>
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

export default JurisprudencesManagement;
