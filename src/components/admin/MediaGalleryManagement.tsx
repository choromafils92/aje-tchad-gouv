import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

export default function MediaGalleryManagement() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'photo',
    resolution: '',
    published: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('media_gallery_items')
        .select('*')
        .order('ordre', { ascending: true });

      if (error) throw error;
      setItems(data || []);
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
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media-files')
        .getPublicUrl(filePath);

      const dataToSave = {
        ...formData,
        file_url: publicUrl,
        thumbnail_url: publicUrl,
        file_size: file.size,
        created_by: user?.id,
        ordre: items.length,
      };

      if (editingItem) {
        const { error } = await (supabase as any)
          .from('media_gallery_items')
          .update(dataToSave)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('media_gallery_items')
          .insert([dataToSave]);
        if (error) throw error;
      }

      toast({
        title: 'Succès',
        description: editingItem ? 'Élément modifié' : 'Élément ajouté',
      });
      
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const { error } = await (supabase as any)
        .from('media_gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Élément supprimé',
      });
      fetchItems();
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
        .from('media_gallery_items')
        .update({ published: !published })
        .eq('id', id);

      if (error) throw error;
      fetchItems();
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
      description: '',
      type: 'photo',
      resolution: '',
      published: true,
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      resolution: item.resolution || '',
      published: item.published,
    });
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Galerie Média</CardTitle>
              <CardDescription>
                Gérez les photos et vidéos de la galerie
              </CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un média
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <Badge variant="secondary" className="mt-1">
                          {item.type}
                        </Badge>
                      </div>
                      {item.published ? (
                        <Badge>Publié</Badge>
                      ) : (
                        <Badge variant="outline">Masqué</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(item.id, item.published)}
                      >
                        {item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifier le média' : 'Ajouter un média'}
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
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="pdf">Document PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="resolution">Résolution (ex: 1920x1080)</Label>
              <Input
                id="resolution"
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                type="file"
                accept={formData.type === 'pdf' ? 'application/pdf' : 'image/*,video/*'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, title: formData.title || file.name });
                  }
                }}
                disabled={uploading}
              />
              {formData.type === 'pdf' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Seuls les fichiers PDF sont acceptés pour ce type
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={async () => {
                  const fileInput = document.getElementById('file') as HTMLInputElement;
                  if (fileInput?.files?.[0]) {
                    await handleFileUpload({ target: { files: fileInput.files } } as any);
                  }
                }}
                disabled={uploading || !formData.title}
              >
                {uploading ? 'Sauvegarde...' : 'Sauvegarder'}
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
