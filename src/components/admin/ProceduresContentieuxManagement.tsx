import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Procedure {
  id: string;
  etape: string;
  description: string;
  delai: string;
  documents: string[] | string;
  ordre: number;
  published: boolean;
  created_by: string;
}

const ProceduresContentieuxManagement = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    etape: '',
    description: '',
    delai: '',
    documents: '',
    ordre: 0,
    published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    try {
      const { data, error } = await supabase
        .from('procedures_contentieux' as any)
        .select('*')
        .order('ordre', { ascending: true });

      if (error) {
        console.error('Erreur chargement procédures:', error);
        throw error;
      }
      setProcedures((data as unknown as Procedure[]) || []);
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de charger les procédures: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Erreur',
          description: 'Vous devez être connecté',
          variant: 'destructive',
        });
        return;
      }

      const documentsArray = formData.documents
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      const dataToSave = {
        ...formData,
        documents: JSON.stringify(documentsArray),
      };

      if (editingId) {
        const { error } = await supabase
          .from('procedures_contentieux' as any)
          .update(dataToSave)
          .eq('id', editingId);

        if (error) {
          console.error('Erreur mise à jour procédure:', error);
          throw error;
        }

        toast({
          title: 'Succès',
          description: 'Procédure mise à jour avec succès',
        });
      } else {
        const { error } = await supabase
          .from('procedures_contentieux' as any)
          .insert([{ ...dataToSave, created_by: user.id }]);

        if (error) {
          console.error('Erreur ajout procédure:', error);
          throw error;
        }

        toast({
          title: 'Succès',
          description: 'Procédure ajoutée avec succès',
        });
      }

      setIsDialogOpen(false);
      resetForm();
      await fetchProcedures();
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        title: 'Erreur',
        description: `Opération échouée: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (procedure: Procedure) => {
    setEditingId(procedure.id);
    const docs = Array.isArray(procedure.documents) 
      ? procedure.documents 
      : JSON.parse(procedure.documents || '[]');
    
    setFormData({
      etape: procedure.etape,
      description: procedure.description,
      delai: procedure.delai,
      documents: docs.join('\n'),
      ordre: procedure.ordre,
      published: procedure.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette procédure ?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Erreur',
          description: 'Vous devez être connecté pour supprimer une procédure',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('procedures_contentieux' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur suppression procédure:', error);
        throw error;
      }

      toast({
        title: 'Succès',
        description: 'Procédure supprimée avec succès',
      });
      await fetchProcedures();
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de supprimer: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      etape: '',
      description: '',
      delai: '',
      documents: '',
      ordre: 0,
      published: true,
    });
    setEditingId(null);
  };

  const updateOrdre = async (id: string, newOrdre: number) => {
    try {
      const { error } = await supabase
        .from('procedures_contentieux' as any)
        .update({ ordre: newOrdre })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Ordre mis à jour',
      });
      await fetchProcedures();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const removeDuplicates = async () => {
    if (!confirm('Supprimer les procédures en double ? Cette action est irréversible.')) return;

    try {
      // Récupérer toutes les procédures
      const { data: allProcedures, error: fetchError } = await supabase
        .from('procedures_contentieux' as any)
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Identifier les doublons basés sur l'étape
      const seen = new Map<string, string>();
      const duplicateIds: string[] = [];

      allProcedures?.forEach((proc: any) => {
        if (seen.has(proc.etape)) {
          duplicateIds.push(proc.id);
        } else {
          seen.set(proc.etape, proc.id);
        }
      });

      if (duplicateIds.length === 0) {
        toast({
          title: 'Information',
          description: 'Aucun doublon trouvé',
        });
        return;
      }

      // Supprimer les doublons
      const { error: deleteError } = await supabase
        .from('procedures_contentieux' as any)
        .delete()
        .in('id', duplicateIds);

      if (deleteError) throw deleteError;

      toast({
        title: 'Succès',
        description: `${duplicateIds.length} doublon(s) supprimé(s)`,
      });
      await fetchProcedures();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Procédures Contentieux</CardTitle>
            <CardDescription>
              Gérer les étapes du processus de traitement contentieux
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={removeDuplicates}>
              Supprimer les doublons
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? 'Modifier' : 'Ajouter'} une procédure
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations de la procédure contentieuse
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="etape">Étape *</Label>
                      <Input
                        id="etape"
                        value={formData.etape}
                        onChange={(e) => setFormData({ ...formData, etape: e.target.value })}
                        placeholder="Ex: 1. Saisine"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez cette étape..."
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="delai">Délai *</Label>
                      <Input
                        id="delai"
                        value={formData.delai}
                        onChange={(e) => setFormData({ ...formData, delai: e.target.value })}
                        placeholder="Ex: 2-5 jours"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="documents">Documents (un par ligne)</Label>
                      <Textarea
                        id="documents"
                        value={formData.documents}
                        onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                        placeholder="Dossier complet&#10;Pièces justificatives"
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ordre">Ordre d'affichage</Label>
                      <Input
                        id="ordre"
                        type="number"
                        value={formData.ordre}
                        onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
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
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Sauvegarder</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {procedures.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune procédure. Cliquez sur "Ajouter" pour commencer.
            </p>
          ) : (
            procedures.map((procedure) => {
              const docs = Array.isArray(procedure.documents) 
                ? procedure.documents 
                : JSON.parse(procedure.documents || '[]');
              
              return (
                <Card key={procedure.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{procedure.etape}</CardTitle>
                          {!procedure.published && (
                            <Badge variant="secondary">Non publié</Badge>
                          )}
                        </div>
                        <CardDescription>{procedure.description}</CardDescription>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            <strong>Délai:</strong> {procedure.delai}
                          </p>
                          {docs.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Documents:</strong>
                              <ul className="list-disc list-inside ml-2">
                                {docs.map((doc: string, i: number) => (
                                  <li key={i}>{doc}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrdre(procedure.id, procedure.ordre - 1)}
                            disabled={procedure.ordre === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrdre(procedure.id, procedure.ordre + 1)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(procedure)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(procedure.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProceduresContentieuxManagement;
