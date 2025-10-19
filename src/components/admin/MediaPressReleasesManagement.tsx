import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

export default function MediaPressReleasesManagement() {
  const [loading, setLoading] = useState(false);
  const [releases, setReleases] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Communiqué',
    excerpt: '',
    content: '',
    date_publication: new Date().toISOString().split('T')[0],
    published: true,
  });

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('media_press_releases')
        .select('*')
        .order('date_publication', { ascending: false });

      if (error) throw error;
      setReleases(data || []);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `press-releases/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media-files')
        .getPublicUrl(filePath);

      return { url: publicUrl, size: file.size };
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (fileData?: { url: string; size: number } | null) => {
    try {
      const dataToSave = {
        ...formData,
        created_by: user?.id,
        file_url: fileData?.url,
        file_size: fileData?.size,
      };

      if (editingRelease) {
        const { error } = await (supabase as any)
          .from('media_press_releases')
          .update(dataToSave)
          .eq('id', editingRelease.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('media_press_releases')
          .insert([dataToSave]);
        if (error) throw error;
      }

      toast({
        title: 'Succès',
        description: editingRelease ? 'Communiqué modifié' : 'Communiqué ajouté',
      });
      
      setDialogOpen(false);
      resetForm();
      fetchReleases();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce communiqué ?')) return;

    try {
      const { error } = await (supabase as any)
        .from('media_press_releases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Communiqué supprimé',
      });
      fetchReleases();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('media_press_releases')
        .update({ published: !published })
        .eq('id', id);

      if (error) throw error;
      fetchReleases();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Communiqué',
      excerpt: '',
      content: '',
      date_publication: new Date().toISOString().split('T')[0],
      published: true,
    });
    setEditingRelease(null);
  };

  const openEditDialog = (release: any) => {
    setEditingRelease(release);
    setFormData({
      title: release.title,
      category: release.category,
      excerpt: release.excerpt,
      content: release.content || '',
      date_publication: release.date_publication,
      published: release.published,
    });
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Communiqués de Presse</CardTitle>
              <CardDescription>
                Gérez les communiqués et rapports officiels
              </CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un communiqué
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.map((release) => (
                  <TableRow key={release.id}>
                    <TableCell>{release.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{release.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(release.date_publication).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {release.published ? (
                        <Badge>Publié</Badge>
                      ) : (
                        <Badge variant="outline">Brouillon</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublished(release.id, release.published)}
                        >
                          {release.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(release)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(release.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRelease ? 'Modifier le communiqué' : 'Ajouter un communiqué'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Communiqué">Communiqué</SelectItem>
                  <SelectItem value="Rapport">Rapport</SelectItem>
                  <SelectItem value="Note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="content">Contenu complet (optionnel)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="date">Date de publication</Label>
              <Input
                id="date"
                type="date"
                value={formData.date_publication}
                onChange={(e) => setFormData({ ...formData, date_publication: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="file">Fichier PDF (optionnel)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={async (e) => {
                  const fileData = await handleFileUpload(e);
                  if (fileData) {
                    await handleSubmit(fileData);
                  }
                }}
                disabled={uploading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleSubmit()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upload...
                  </>
                ) : (
                  editingRelease ? 'Modifier' : 'Ajouter'
                )}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
