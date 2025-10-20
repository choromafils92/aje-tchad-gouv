import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash2, Save, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";

interface ResourceDocument {
  id: string;
  title: string;
  description: string;
  pdf_url: string | null;
  word_url: string | null;
  file_size: string;
  ordre: number;
  published: boolean;
}

const ResourceDocumentsManagement = () => {
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf_url: "",
    word_url: "",
    file_size: "",
    ordre: 0,
    published: true
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("resource_documents" as any)
        .select("*")
        .order("ordre", { ascending: true });

      if (error) throw error;
      setDocuments(data as any || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'pdf' | 'word') => {
    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
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
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur d'upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload files if selected
      let pdfUrl = formData.pdf_url;
      let wordUrl = formData.word_url;

      if (pdfFile) {
        const uploadedPdfUrl = await handleFileUpload(pdfFile, 'pdf');
        if (uploadedPdfUrl) pdfUrl = uploadedPdfUrl;
      }

      if (wordFile) {
        const uploadedWordUrl = await handleFileUpload(wordFile, 'word');
        if (uploadedWordUrl) wordUrl = uploadedWordUrl;
      }

      if (editingId) {
        const { error } = await supabase
          .from("resource_documents" as any)
          .update({
            title: formData.title,
            description: formData.description,
            pdf_url: pdfUrl,
            word_url: wordUrl,
            file_size: formData.file_size,
            ordre: formData.ordre,
            published: formData.published
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Document modifié avec succès",
        });
      } else {
        const { error } = await supabase
          .from("resource_documents" as any)
          .insert([{
            title: formData.title,
            description: formData.description,
            pdf_url: pdfUrl,
            word_url: wordUrl,
            file_size: formData.file_size,
            ordre: formData.ordre,
            published: formData.published,
            created_by: user.id
          }]);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Document ajouté avec succès",
        });
      }

      setFormData({
        title: "",
        description: "",
        pdf_url: "",
        word_url: "",
        file_size: "",
        ordre: 0,
        published: true
      });
      setPdfFile(null);
      setWordFile(null);
      setEditingId(null);
      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (doc: ResourceDocument) => {
    setEditingId(doc.id);
    setPdfFile(null);
    setWordFile(null);
    setFormData({
      title: doc.title,
      description: doc.description,
      pdf_url: doc.pdf_url || "",
      word_url: doc.word_url || "",
      file_size: doc.file_size,
      ordre: doc.ordre,
      published: doc.published
    });
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    toast({
      title: "Mode édition",
      description: `Modification de "${doc.title}"`,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      const { error } = await supabase
        .from("resource_documents" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Document supprimé",
      });
      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className={editingId ? "bg-primary/5 border-l-4 border-primary" : ""}>
          <CardTitle>
            {editingId ? "✏️ Modifier" : "➕ Ajouter"} un document
            {editingId && <span className="ml-2 text-sm text-muted-foreground">(Mode édition actif)</span>}
          </CardTitle>
          <CardDescription>
            Gérez les documents téléchargeables (PDF et Word) sur la page Services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du document *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Formulaire de demande d'avis juridique"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du document"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pdf_url">URL du fichier PDF ou Upload</Label>
                <Input
                  id="pdf_url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="/documents/fichier.pdf"
                  className="mb-2"
                />
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  disabled={uploadingFile}
                />
                <p className="text-sm text-muted-foreground">
                  {pdfFile ? `Fichier sélectionné: ${pdfFile.name}` : 'Ou saisissez une URL ci-dessus'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="word_url">URL du fichier Word ou Upload</Label>
                <Input
                  id="word_url"
                  value={formData.word_url}
                  onChange={(e) => setFormData({ ...formData, word_url: e.target.value })}
                  placeholder="/documents/fichier.docx"
                  className="mb-2"
                />
                <Input
                  type="file"
                  accept=".doc,.docx"
                  onChange={(e) => setWordFile(e.target.files?.[0] || null)}
                  disabled={uploadingFile}
                />
                <p className="text-sm text-muted-foreground">
                  {wordFile ? `Fichier sélectionné: ${wordFile.name}` : 'Ou saisissez une URL ci-dessus'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_size">Taille du fichier</Label>
                <Input
                  id="file_size"
                  value={formData.file_size}
                  onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                  placeholder="Ex: 120 KB"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ordre">Ordre d'affichage</Label>
                <Input
                  id="ordre"
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                />
              </div>
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
              <Button type="submit" disabled={loading || uploadingFile} className={editingId ? "bg-primary" : ""}>
                <Save className="mr-2 h-4 w-4" />
                {uploadingFile ? '⏳ Upload en cours...' : editingId ? '✅ Enregistrer les modifications' : '➕ Ajouter le document'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setPdfFile(null);
                    setWordFile(null);
                    setFormData({
                      title: "",
                      description: "",
                      pdf_url: "",
                      word_url: "",
                      file_size: "",
                      ordre: 0,
                      published: true
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
          <div className="flex justify-between items-center">
            <CardTitle>Documents existants</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (!confirm("⚠️ Voulez-vous supprimer tous les doublons ?\n\nSeule la première occurrence de chaque titre sera conservée.\nCette action est irréversible !")) return;
                
                try {
                  // Count duplicates first
                  const titleCounts: Record<string, number> = {};
                  documents.forEach(doc => {
                    titleCounts[doc.title] = (titleCounts[doc.title] || 0) + 1;
                  });
                  
                  const hasDuplicates = Object.values(titleCounts).some(count => count > 1);
                  
                  if (!hasDuplicates) {
                    toast({
                      title: "✅ Aucun doublon",
                      description: "Tous les documents ont des titres uniques",
                    });
                    return;
                  }

                  // Group by title and keep only first occurrence
                  const seen = new Set<string>();
                  const toDelete: string[] = [];
                  
                  documents.forEach(doc => {
                    if (seen.has(doc.title)) {
                      toDelete.push(doc.id);
                    } else {
                      seen.add(doc.title);
                    }
                  });

                  toast({
                    title: "🔄 Suppression en cours...",
                    description: `${toDelete.length} doublon(s) détecté(s)`,
                  });

                  // Delete duplicates
                  let deletedCount = 0;
                  for (const id of toDelete) {
                    const { error } = await supabase
                      .from("resource_documents" as any)
                      .delete()
                      .eq("id", id);
                    
                    if (error) {
                      console.error("Erreur de suppression:", error);
                      throw error;
                    }
                    deletedCount++;
                  }

                  toast({
                    title: "✅ Succès",
                    description: `${deletedCount} doublon(s) supprimé(s) avec succès`,
                  });
                  
                  await fetchDocuments();
                } catch (error: any) {
                  console.error("Erreur lors de la suppression des doublons:", error);
                  toast({
                    title: "❌ Erreur",
                    description: error.message || "Impossible de supprimer les doublons",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              🗑️ Supprimer les doublons
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun document configuré
              </p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                    <div className="flex gap-4 mt-2">
                      {doc.pdf_url && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={async () => {
                            try {
                              const link = document.createElement('a');
                              link.href = doc.pdf_url!;
                              link.download = doc.title + '.pdf';
                              link.target = '_blank';
                              link.rel = 'noopener noreferrer';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } catch (error) {
                              window.open(doc.pdf_url!, '_blank');
                            }
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      )}
                      {doc.word_url && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={async () => {
                            try {
                              const link = document.createElement('a');
                              link.href = doc.word_url!;
                              link.download = doc.title + '.docx';
                              link.target = '_blank';
                              link.rel = 'noopener noreferrer';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } catch (error) {
                              window.open(doc.word_url!, '_blank');
                            }
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Word
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">{doc.file_size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ordre: {doc.ordre} | {doc.published ? "Publié" : "Non publié"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(doc)}
                      title="Modifier ce document"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      title="Supprimer ce document"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceDocumentsManagement;
