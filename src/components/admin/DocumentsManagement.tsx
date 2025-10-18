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
import { Trash2, Edit, Upload } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  category: string;
  file_type: string | null;
  published: boolean;
  created_at: string;
}

export default function DocumentsManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    category: 'modele',
    published: true,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments((data as unknown as Document[]) || []);
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

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: 'Erreur d\'upload',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      let uploadedFileUrl = formData.file_url;

      if (selectedFile) {
        const uploadedUrl = await handleFileUpload(selectedFile);
        if (!uploadedUrl) return;
        uploadedFileUrl = uploadedUrl;
      }

      if (!uploadedFileUrl && !editingId) {
        toast({
          title: 'Erreur',
          description: 'Veuillez sélectionner un fichier',
          variant: 'destructive',
        });
        return;
      }

      const dataToSubmit = {
        ...formData,
        file_url: uploadedFileUrl,
      };

      if (editingId) {
        const { error } = await supabase
          .from('documents' as any)
          .update(dataToSubmit)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Document mis à jour avec succès',
        });
      } else {
        const { error } = await supabase
          .from('documents' as any)
          .insert([{ ...dataToSubmit, created_by: user.id }]);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Document ajouté avec succès',
        });
      }

      setFormData({
        title: '',
        description: '',
        file_url: '',
        category: 'modele',
        published: true,
      });
      setEditingId(null);
      setSelectedFile(null);
      fetchDocuments();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (doc: Document) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      description: doc.description || '',
      file_url: doc.file_url,
      category: doc.category,
      published: doc.published,
    });
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    try {
      const { error } = await supabase
        .from('documents' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Document supprimé avec succès',
      });
      fetchDocuments();
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
            {editingId ? 'Modifier le document' : 'Ajouter un document'}
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">
                <Upload className="inline mr-2 h-4 w-4" />
                Fichier (PDF, DOCX, etc.)
              </Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Fichier sélectionné: {selectedFile.name}
                </p>
              )}
              {editingId && formData.file_url && !selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Fichier actuel conservé (choisissez un nouveau fichier pour le remplacer)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modele">Modèle</SelectItem>
                  <SelectItem value="texte_fondamental">Texte fondamental</SelectItem>
                  <SelectItem value="formulaire">Formulaire</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
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
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Upload en cours...' : editingId ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setSelectedFile(null);
                    setFormData({
                      title: '',
                      description: '',
                      file_url: '',
                      category: 'modele',
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
          <CardTitle>Documents existants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>
                    <span className={doc.published ? 'text-green-600' : 'text-gray-600'}>
                      {doc.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
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
