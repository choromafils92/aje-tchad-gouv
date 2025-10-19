import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface JobOffer {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements?: string;
  published: boolean;
}

export default function JobOffersManagement() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emptyOffer: Partial<JobOffer> = {
    title: "",
    department: "",
    location: "N'Djamena, Tchad",
    type: "CDI",
    experience: "",
    description: "",
    requirements: "",
    published: true,
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("job_offers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des offres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!editingOffer) return;

      if (editingOffer.id) {
        const { error } = await (supabase as any)
          .from("job_offers")
          .update(editingOffer)
          .eq("id", editingOffer.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("job_offers")
          .insert([editingOffer]);
        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: editingOffer.id ? "Offre modifiée" : "Offre créée",
      });

      setIsDialogOpen(false);
      setEditingOffer(null);
      fetchOffers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette offre ?")) return;

    try {
      const { error } = await (supabase as any)
        .from("job_offers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Offre supprimée" });
      fetchOffers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from("job_offers")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Statut modifié",
        description: !currentStatus ? "Offre publiée" : "Offre dépubliée",
      });
      fetchOffers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des offres d'emploi</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOffer(emptyOffer as JobOffer)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle offre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffer?.id ? "Modifier l'offre" : "Nouvelle offre"}
              </DialogTitle>
            </DialogHeader>

            {editingOffer && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Titre du poste *</Label>
                  <Input
                    value={editingOffer.title}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Département *</Label>
                    <Input
                      value={editingOffer.department}
                      onChange={(e) => setEditingOffer({ ...editingOffer, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Localisation *</Label>
                    <Input
                      value={editingOffer.location}
                      onChange={(e) => setEditingOffer({ ...editingOffer, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type de contrat *</Label>
                    <Select value={editingOffer.type} onValueChange={(value) => setEditingOffer({ ...editingOffer, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CDI">CDI</SelectItem>
                        <SelectItem value="CDD">CDD</SelectItem>
                        <SelectItem value="Stage">Stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expérience requise *</Label>
                    <Input
                      value={editingOffer.experience}
                      onChange={(e) => setEditingOffer({ ...editingOffer, experience: e.target.value })}
                      placeholder="Ex: 3-5 ans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={editingOffer.description}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Exigences</Label>
                  <Textarea
                    value={editingOffer.requirements || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, requirements: e.target.value })}
                    className="min-h-24"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingOffer.published}
                    onCheckedChange={(checked) => setEditingOffer({ ...editingOffer, published: checked })}
                  />
                  <Label>Publier l'offre</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>Enregistrer</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offres d'emploi</CardTitle>
          <CardDescription>Gérez les offres d'emploi publiées sur le site</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.title}</TableCell>
                  <TableCell>{offer.department}</TableCell>
                  <TableCell>{offer.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(offer.id, offer.published)}
                    >
                      {offer.published ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingOffer(offer);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(offer.id)}
                      >
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
    </div>
  );
}
