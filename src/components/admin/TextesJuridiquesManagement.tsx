import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit } from 'lucide-react';

interface TexteJuridique {
  id: string;
  title: string;
  reference: string | null;
  type: string;
  date_publication: string | null;
  content: string | null;
  file_url: string | null;
  published: boolean;
  created_at: string;
}

export default function TextesJuridiquesManagement() {
  const [textes, setTextes] = useState<TexteJuridique[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    reference: '',
    type: 'loi',
    date_publication: '',
    content: '',
    file_url: '',
    published: true,
  });

  useEffect(() => {
    fetchTextes();
  }, []);

  const fetchTextes = async () => {
    try {
      const { data, error } = await supabase
        .from('textes_juridiques' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTextes((data as unknown as TexteJuridique[]) || []);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
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
      if (!user) throw new Error("Non authentifié");

      const dataToSend = {
        ...formData,
        date_publication: formData.date_publication || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('textes_juridiques' as any)
          .update(dataToSend)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Texte juridique mis à jour avec succès',
        });
      } else {
        const { error } = await supabase
          .from('textes_juridiques' as any)
          .insert([{ ...dataToSend, created_by: user.id }]);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Texte juridique ajouté avec succès',
        });
      }

      setFormData({
        title: '',
        reference: '',
        type: 'loi',
        date_publication: '',
        content: '',
        file_url: '',
        published: true,
      });
      setEditingId(null);
      fetchTextes();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (texte: TexteJuridique) => {
    setEditingId(texte.id);
    setFormData({
      title: texte.title,
      reference: texte.reference || '',
      type: texte.type,
      date_publication: texte.date_publication || '',
      content: texte.content || '',
      file_url: texte.file_url || '',
      published: texte.published,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce texte juridique ?')) return;

    try {
      const { error } = await supabase
        .from('textes_juridiques' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Texte juridique supprimé avec succès',
      });
      fetchTextes();
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? 'Modifier le texte juridique' : 'Ajouter un texte juridique'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                />
              </div>

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
                    <SelectItem value="loi">Loi</SelectItem>
                    <SelectItem value="decret">Décret</SelectItem>
                    <SelectItem value="arrete">Arrêté</SelectItem>
                    <SelectItem value="ordonnance">Ordonnance</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_publication">Date de publication</Label>
              <Input
                id="date_publication"
                type="date"
                value={formData.date_publication}
                onChange={(e) => setFormData({ ...formData, date_publication: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_url">URL du fichier PDF</Label>
              <Input
                id="file_url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
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

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      title: '',
                      reference: '',
                      type: 'loi',
                      date_publication: '',
                      content: '',
                      file_url: '',
                      published: true,
                    });
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Textes juridiques existants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textes.map((texte) => (
                <TableRow key={texte.id}>
                  <TableCell>{texte.title}</TableCell>
                  <TableCell>{texte.type}</TableCell>
                  <TableCell>{texte.reference}</TableCell>
                  <TableCell>
                    {texte.date_publication ? new Date(texte.date_publication).toLocaleDateString('fr-FR') : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={texte.published ? 'text-green-600' : 'text-gray-600'}>
                      {texte.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(texte)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(texte.id)}
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