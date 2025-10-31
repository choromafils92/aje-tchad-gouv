import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, FileText, Image as ImageIcon, Video } from 'lucide-react';
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

interface PdfWithDescription {
  url: string;
  description: string;
}

interface Actualite {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string | null;
  urgent: boolean;
  published: boolean;
  created_at: string;
  photos?: string[];
  videos?: string[];
  pdfs?: PdfWithDescription[];
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
  
  const [enablePhotos, setEnablePhotos] = useState(false);
  const [enableVideos, setEnableVideos] = useState(false);
  const [enablePdfs, setEnablePdfs] = useState(false);
  
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [uploadingPdfs, setUploadingPdfs] = useState(false);
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [pdfs, setPdfs] = useState<PdfWithDescription[]>([]);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleFileUpload = async (file: File, type: 'photos' | 'videos' | 'pdfs') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('actualites-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('actualites-media')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingPhotos(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(e.target.files)) {
        const url = await handleFileUpload(file, 'photos');
        uploadedUrls.push(url);
      }
      setPhotos([...photos, ...uploadedUrls]);
      setEnablePhotos(true); // Activer automatiquement les photos
      toast({
        title: 'Photos uploadées',
        description: `${uploadedUrls.length} photo(s) ajoutée(s) avec succès.`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader les photos.',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleVideosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingVideos(true);
    try {
      const uploadedUrls: string[] = [];
      const files = Array.from(e.target.files);
      
      // Vérifier la taille des fichiers (limite à 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB en bytes
      for (const file of files) {
        if (file.size > maxSize) {
          toast({
            title: 'Fichier trop volumineux',
            description: `${file.name} dépasse la limite de 50MB.`,
            variant: 'destructive',
          });
          continue;
        }
        
        try {
          const url = await handleFileUpload(file, 'videos');
          uploadedUrls.push(url);
          toast({
            title: 'Vidéo uploadée',
            description: `${file.name} a été uploadée avec succès.`,
          });
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast({
            title: 'Erreur d\'upload',
            description: `Impossible d'uploader ${file.name}. Vérifiez que le bucket storage est configuré.`,
            variant: 'destructive',
          });
        }
      }
      
      if (uploadedUrls.length > 0) {
        setVideos([...videos, ...uploadedUrls]);
        setEnableVideos(true);
      }
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader les vidéos. Vérifiez votre connexion et la configuration du storage.',
        variant: 'destructive',
      });
    } finally {
      setUploadingVideos(false);
      // Réinitialiser l'input file
      e.target.value = '';
    }
  };

  const handlePdfsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingPdfs(true);
    try {
      const uploadedPdfs: PdfWithDescription[] = [];
      for (const file of Array.from(e.target.files)) {
        const url = await handleFileUpload(file, 'pdfs');
        uploadedPdfs.push({ url, description: '' });
      }
      setPdfs([...pdfs, ...uploadedPdfs]);
      setEnablePdfs(true); // Activer automatiquement les PDFs
      toast({
        title: 'PDFs uploadés',
        description: `${uploadedPdfs.length} PDF(s) ajouté(s) avec succès.`,
      });
    } catch (error) {
      console.error('Error uploading pdfs:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader les PDFs.',
        variant: 'destructive',
      });
    } finally {
      setUploadingPdfs(false);
    }
  };

  const removeMedia = (type: 'photos' | 'videos' | 'pdfs', index: number) => {
    if (type === 'photos') {
      setPhotos(photos.filter((_, i) => i !== index));
    } else if (type === 'videos') {
      setVideos(videos.filter((_, i) => i !== index));
    } else {
      setPdfs(pdfs.filter((_, i) => i !== index));
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number, type: 'photos' | 'videos' | 'pdfs') => {
    if (draggedIndex === null) return;

    const reorder = <T,>(list: T[]) => {
      const result = [...list];
      const [removed] = result.splice(draggedIndex, 1);
      result.splice(targetIndex, 0, removed);
      return result;
    };

    if (type === 'photos') {
      setPhotos(reorder(photos));
    } else if (type === 'videos') {
      setVideos(reorder(videos));
    } else {
      setPdfs(reorder(pdfs));
    }

    setDraggedIndex(null);
  };

  const updatePdfDescription = (index: number, description: string) => {
    const updatedPdfs = [...pdfs];
    updatedPdfs[index].description = description;
    setPdfs(updatedPdfs);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const dataToSave = {
        ...formData,
        photos: enablePhotos ? photos : [],
        videos: enableVideos ? videos : [],
        pdfs: enablePdfs ? pdfs : [],
      };

      if (editingId) {
        const { error } = await supabase
          .from('actualites')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Actualité mise à jour',
          description: 'L\'actualité a été modifiée avec succès.',
        });
      } else {
        const { error } = await supabase
          .from('actualites')
          .insert({ ...dataToSave, created_by: user.id });

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
    
    // Charger les médias existants
    const hasPhotos = actualite.photos && actualite.photos.length > 0;
    const hasVideos = actualite.videos && actualite.videos.length > 0;
    const hasPdfs = actualite.pdfs && actualite.pdfs.length > 0;
    
    setEnablePhotos(hasPhotos);
    setEnableVideos(hasVideos);
    setEnablePdfs(hasPdfs);
    
    setPhotos(actualite.photos || []);
    setVideos(actualite.videos || []);
    setPdfs(actualite.pdfs || []);
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
    setEnablePhotos(false);
    setEnableVideos(false);
    setEnablePdfs(false);
    setPhotos([]);
    setVideos([]);
    setPdfs([]);
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

            {/* Section Galerie Médias */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-lg font-semibold">Galerie Médias</h3>
              
              {/* Photos */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-photos"
                    checked={enablePhotos}
                    onCheckedChange={setEnablePhotos}
                  />
                  <Label htmlFor="enable-photos" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Ajouter des photos
                  </Label>
                </div>
                
                {enablePhotos && (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosUpload}
                      disabled={uploadingPhotos}
                    />
                    {photos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Glissez-déposez pour réordonner les photos
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {photos.map((url, index) => (
                            <div
                              key={index}
                              draggable
                              onDragStart={() => handleDragStart(index)}
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop(index, 'photos')}
                              onDragEnd={handleDragEnd}
                              className={`relative group cursor-move transition-opacity ${
                                draggedIndex === index ? 'opacity-50' : ''
                              }`}
                            >
                              <img 
                                src={url} 
                                alt={`Photo ${index + 1}`} 
                                className="w-full h-24 object-cover rounded border-2 border-dashed border-transparent hover:border-primary"
                              />
                              <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMedia('photos', index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vidéos */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-videos"
                    checked={enableVideos}
                    onCheckedChange={setEnableVideos}
                  />
                  <Label htmlFor="enable-videos" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Ajouter des vidéos
                  </Label>
                </div>
                
                {enableVideos && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-url">Ajouter une URL de vidéo (YouTube, Vimeo, etc.)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="video-url"
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.currentTarget;
                              if (input.value.trim()) {
                                setVideos([...videos, input.value.trim()]);
                                setEnableVideos(true);
                                input.value = '';
                                toast({
                                  title: 'URL ajoutée',
                                  description: 'L\'URL de la vidéo a été ajoutée.',
                                });
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('video-url') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              setVideos([...videos, input.value.trim()]);
                              setEnableVideos(true);
                              input.value = '';
                              toast({
                                title: 'URL ajoutée',
                                description: 'L\'URL de la vidéo a été ajoutée.',
                              });
                            }
                          }}
                        >
                          Ajouter
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Formats supportés : YouTube, Vimeo, ou fichiers vidéo directs (.mp4, .webm)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="video-file">Ou uploader un fichier vidéo local</Label>
                      <div className="flex gap-2">
                        <Input
                          id="video-file"
                          type="file"
                          accept="video/mp4,video/webm,video/ogg"
                          onChange={handleVideosUpload}
                          disabled={uploadingVideos}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingVideos}
                          onClick={() => {
                            const input = document.getElementById('video-file') as HTMLInputElement;
                            input?.click();
                          }}
                        >
                          {uploadingVideos ? 'Upload...' : 'Parcourir'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fichiers acceptés : .mp4, .webm, .ogg (max 50MB recommandé)
                      </p>
                    </div>
                    
                    {videos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Glissez-déposez pour réordonner les vidéos
                        </p>
                        {videos.map((url, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index, 'videos')}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between p-3 border-2 rounded cursor-move transition-all ${
                              draggedIndex === index 
                                ? 'opacity-50 border-dashed' 
                                : 'border-solid hover:border-primary'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm font-medium">Vidéo {index + 1}</span>
                              <span className="text-xs text-muted-foreground truncate ml-2">
                                {url.includes('youtube.com') || url.includes('youtu.be') ? '(YouTube)' : 
                                 url.includes('vimeo.com') ? '(Vimeo)' : 
                                 url.includes('.mp4') || url.includes('.webm') ? '(Fichier)' : 
                                 '(URL)'}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMedia('videos', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PDFs */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-pdfs"
                    checked={enablePdfs}
                    onCheckedChange={setEnablePdfs}
                  />
                  <Label htmlFor="enable-pdfs" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Ajouter des PDFs
                  </Label>
                </div>
                
                {enablePdfs && (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handlePdfsUpload}
                      disabled={uploadingPdfs}
                    />
                    {pdfs.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Glissez-déposez pour réordonner les PDFs
                        </p>
                        {pdfs.map((pdf, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index, 'pdfs')}
                            onDragEnd={handleDragEnd}
                            className={`space-y-2 p-3 border-2 rounded cursor-move transition-all ${
                              draggedIndex === index 
                                ? 'opacity-50 border-dashed' 
                                : 'border-solid hover:border-primary'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">PDF {index + 1}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMedia('pdfs', index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`pdf-description-${index}`} className="text-xs">
                                Description du PDF
                              </Label>
                              <Textarea
                                id={`pdf-description-${index}`}
                                value={pdf.description}
                                onChange={(e) => updatePdfDescription(index, e.target.value)}
                                placeholder="Décrivez ce document PDF..."
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Sauvegarder l\'actualité' : 'Ajouter une nouvelle actualité'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler la modification
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
