import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';

interface Actualite {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string | null;
  urgent: boolean;
  published: boolean;
  created_at: string;
}

const ActualitesManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'communique',
    title: '',
    description: '',
    content: '',
    urgent: false,
    published: false,
  });

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActualites(data || []);
    } catch (error) {
      console.error('Error fetching actualites:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les actualités.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      if (editingId) {
        const { error } = await supabase
          .from('actualites')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Actualité mise à jour',
          description: 'L\'actualité a été modifiée avec succès.',
        });
      } else {
        const { error } = await supabase
          .from('actualites')
          .insert({ ...formData, created_by: user.id });

        if (error) throw error;

        toast({
          title: 'Actualité créée',
          description: 'L\'actualité a été ajoutée avec succès.',
        });
      }

      resetForm();
      fetchActualites();
    } catch (error) {
      console.error('Error saving actualite:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'actualité.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (actualite: Actualite) => {
    setEditingId(actualite.id);
    setFormData({
      type: actualite.type,
      title: actualite.title,
      description: actualite.description,
      content: actualite.content || '',
      urgent: actualite.urgent,
      published: actualite.published,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;

    try {
      const { error } = await supabase
        .from('actualites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Actualité supprimée',
        description: 'L\'actualité a été supprimée avec succès.',
      });

      fetchActualites();
    } catch (error) {
      console.error('Error deleting actualite:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'actualité.',
        variant: 'destructive',
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('actualites')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchActualites();
    } catch (error) {
      console.error('Error toggling published:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut de publication.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      type: 'communique',
      title: '',
      description: '',
      content: '',
      urgent: false,
      published: false,
    });
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Modifier' : 'Ajouter'} une actualité</CardTitle>
          <CardDescription>
            Gérer les actualités, ateliers et formations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="communique">Communiqué</SelectItem>
                    <SelectItem value="atelier">Atelier</SelectItem>
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="annonce">Annonce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu détaillé (optionnel)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="urgent"
                  checked={formData.urgent}
                  onCheckedChange={(checked) => setFormData({ ...formData, urgent: checked })}
                />
                <Label htmlFor="urgent">Urgent</Label>
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

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Modifier' : 'Ajouter'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des actualités</CardTitle>
          <CardDescription>
            {actualites.length} actualité{actualites.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actualites.map((actualite) => (
                <TableRow key={actualite.id}>
                  <TableCell className="capitalize">{actualite.type}</TableCell>
                  <TableCell>
                    {actualite.title}
                    {actualite.urgent && (
                      <span className="ml-2 text-xs text-destructive font-semibold">
                        URGENT
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(actualite.id, actualite.published)}
                    >
                      {actualite.published ? (
                        <><Eye className="h-4 w-4 mr-1" /> Publié</>
                      ) : (
                        <><EyeOff className="h-4 w-4 mr-1" /> Brouillon</>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(actualite)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(actualite.id)}
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
};

export default ActualitesManagement;
