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
      if (editingId) {
        const { error } = await supabase
          .from("resource_documents" as any)
          .update(formData)
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
            ...formData,
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
    setFormData({
      title: doc.title,
      description: doc.description,
      pdf_url: doc.pdf_url || "",
      word_url: doc.word_url || "",
      file_size: doc.file_size,
      ordre: doc.ordre,
      published: doc.published
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
        <CardHeader>
          <CardTitle>{editingId ? "Modifier" : "Ajouter"} un document</CardTitle>
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
                <Label htmlFor="pdf_url">URL du fichier PDF</Label>
                <Input
                  id="pdf_url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="/documents/fichier.pdf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="word_url">URL du fichier Word</Label>
                <Input
                  id="word_url"
                  value={formData.word_url}
                  onChange={(e) => setFormData({ ...formData, word_url: e.target.value })}
                  placeholder="/documents/fichier.docx"
                />
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
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingId ? "Modifier" : "Ajouter"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
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
          <CardTitle>Documents existants</CardTitle>
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
                        <a 
                          href={doc.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </a>
                      )}
                      {doc.word_url && (
                        <a 
                          href={doc.word_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Word
                        </a>
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
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
