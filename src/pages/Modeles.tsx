import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResourceDocument {
  id: string;
  title: string;
  description: string;
  pdf_url: string | null;
  word_url: string | null;
  file_size: string | null;
  ordre: number;
  published: boolean;
  file_url?: string;
  category?: string;
}

const Modeles = () => {
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Fetch from both tables
      const [resourceDocs, regularDocs] = await Promise.all([
        supabase
          .from('resource_documents' as any)
          .select('*')
          .eq('published', true)
          .order('ordre', { ascending: true }),
        supabase
          .from('documents' as any)
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
      ]);

      if (resourceDocs.error) throw resourceDocs.error;
      if (regularDocs.error) throw regularDocs.error;

      // Combine and normalize both document types
      const combinedDocs = [
        ...(resourceDocs.data || []),
        ...(regularDocs.data || []).map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          description: doc.description || '',
          pdf_url: doc.file_url,
          word_url: null,
          file_size: doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : null,
          ordre: 999,
          published: doc.published,
        }))
      ];

      setDocuments(combinedDocs as any);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (file: string) => {
    // Open document in new tab for preview
    window.open(file, '_blank');
  };

  const handleDownload = (url: string, filename: string) => {
    // Pour les fichiers HTML, ouvrir dans un nouvel onglet pour consultation/impression
    if (url.endsWith('.html')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Pour les PDF et autres fichiers, téléchargement direct
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              Modèles de Documents
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Téléchargez les formulaires et modèles types pour vos démarches auprès de l'AJE
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun document disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl text-primary">
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-foreground/80 leading-relaxed">
                      {doc.description}
                    </CardDescription>
                    {doc.file_size && (
                      <p className="text-sm text-muted-foreground">
                        Taille: {doc.file_size}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      {doc.pdf_url && (
                        <Button 
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDownload(doc.pdf_url!, `${doc.title}${doc.pdf_url.endsWith('.pdf') ? '.pdf' : ''}`)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {doc.pdf_url.endsWith('.html') ? 'Consulter le document' : 'Télécharger PDF'}
                        </Button>
                      )}
                      {doc.word_url && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDownload(doc.word_url!, `${doc.title}.docx`)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger Word
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 p-6 bg-secondary/50 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Comment télécharger en PDF ?
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">1.</span>
                <span>Cliquez sur <strong>"Aperçu"</strong> pour visualiser le formulaire, ou sur <strong>"PDF"</strong> pour télécharger directement</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">2.</span>
                <span>Dans la fenêtre d'impression qui s'ouvre, choisissez <strong>"Enregistrer au format PDF"</strong> ou <strong>"Microsoft Print to PDF"</strong> comme destination</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">3.</span>
                <span>Remplissez le formulaire téléchargé avec toutes les informations requises</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">4.</span>
                <span>Transmettez le document complété à l'AJE par email ou en personne</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-accent/10 rounded-md border border-accent/20">
              <p className="text-sm text-foreground">
                <strong className="text-accent">💡 Astuce :</strong> Vous pouvez également copier le texte du formulaire dans votre logiciel de traitement de texte préféré (Word, LibreOffice, etc.) pour le personnaliser avant de l'imprimer.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Modeles;