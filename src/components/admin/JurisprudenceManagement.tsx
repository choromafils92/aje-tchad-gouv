import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Jurisprudence {
  id: string;
  date: string;
  juridiction: string;
  affaire: string;
  domaine: string;
  resultat: string;
  resume: string;
  published: boolean;
}

const JurisprudenceManagement = () => {
  const [jurisprudences, setJurisprudences] = useState<Jurisprudence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJurisprudence, setEditingJurisprudence] = useState<Jurisprudence | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    juridiction: "",
    affaire: "",
    domaine: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingJurisprudence) {
        const { error } = await supabase
          .from("jurisprudences")
          .update(formData)
          .eq("id", editingJurisprudence.id);

        if (error) throw error;
        toast.success("Jurisprudence modifiée avec succès");
      } else {
        const { error } = await supabase
          .from("jurisprudences")
          .insert({
            ...formData,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
        toast.success("Jurisprudence ajoutée avec succès");
      }

      setIsDialogOpen(false);
      setEditingJurisprudence(null);
      setFormData({
        date: "",
        juridiction: "",
        affaire: "",
        domaine: "",
        resultat: "",
        resume: "",
        published: true
      });
      fetchJurisprudences();
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (jurisprudence: Jurisprudence) => {
    setEditingJurisprudence(jurisprudence);
    setFormData({
      date: jurisprudence.date,
      juridiction: jurisprudence.juridiction,
      affaire: jurisprudence.affaire,
      domaine: jurisprudence.domaine,
      resultat: jurisprudence.resultat,
      resume: jurisprudence.resume,
      published: jurisprudence.published
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette jurisprudence ?")) return;

    try {
      const { error } = await supabase
        .from("jurisprudences")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Jurisprudence supprimée");
      fetchJurisprudences();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Jurisprudences</CardTitle>
        <CardDescription>
          Gérez les décisions de justice récentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4" onClick={() => {
              setEditingJurisprudence(null);
              setFormData({
                date: "",
                juridiction: "",
                affaire: "",
                domaine: "",
                resultat: "",
                resume: "",
                published: true
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une jurisprudence
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJurisprudence ? "Modifier la jurisprudence" : "Nouvelle jurisprudence"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="resultat">Résultat *</Label>
                  <Select
                    value={formData.resultat}
                    onValueChange={(value) => setFormData({ ...formData, resultat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le résultat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Favorable">Favorable</SelectItem>
                      <SelectItem value="Défavorable">Défavorable</SelectItem>
                      <SelectItem value="Transactionnel">Transactionnel</SelectItem>
                      <SelectItem value="Partiel">Partiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="juridiction">Juridiction *</Label>
                <Input
                  id="juridiction"
                  value={formData.juridiction}
                  onChange={(e) => setFormData({ ...formData, juridiction: e.target.value })}
                  placeholder="Ex: Cour Suprême du Tchad"
                  required
                />
              </div>

              <div>
                <Label htmlFor="affaire">Affaire *</Label>
                <Input
                  id="affaire"
                  value={formData.affaire}
                  onChange={(e) => setFormData({ ...formData, affaire: e.target.value })}
                  placeholder="Ex: État du Tchad c. Société X"
                  required
                />
              </div>

              <div>
                <Label htmlFor="domaine">Domaine *</Label>
                <Select
                  value={formData.domaine}
                  onValueChange={(value) => setFormData({ ...formData, domaine: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le domaine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marchés Publics">Marchés Publics</SelectItem>
                    <SelectItem value="Fiscal">Fiscal</SelectItem>
                    <SelectItem value="Responsabilité">Responsabilité</SelectItem>
                    <SelectItem value="Fonction Publique">Fonction Publique</SelectItem>
                    <SelectItem value="Urbanisme">Urbanisme</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Pénal">Pénal</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resume">Résumé *</Label>
                <Textarea
                  id="resume"
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  placeholder="Résumé de la décision et de son impact"
                  rows={4}
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
                  {editingJurisprudence ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Juridiction</TableHead>
              <TableHead>Affaire</TableHead>
              <TableHead>Domaine</TableHead>
              <TableHead>Résultat</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jurisprudences.map((jurisprudence) => (
              <TableRow key={jurisprudence.id}>
                <TableCell>{new Date(jurisprudence.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{jurisprudence.juridiction}</TableCell>
                <TableCell>{jurisprudence.affaire}</TableCell>
                <TableCell>
                  <Badge variant="outline">{jurisprudence.domaine}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={jurisprudence.resultat === "Favorable" ? "default" : "secondary"}>
                    {jurisprudence.resultat}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={jurisprudence.published ? "default" : "secondary"}>
                    {jurisprudence.published ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(jurisprudence)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(jurisprudence.id)}>
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

export default JurisprudenceManagement;
