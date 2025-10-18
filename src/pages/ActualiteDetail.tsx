import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft, FileText, AlertTriangle, Megaphone, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Actualite {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string | null;
  urgent: boolean;
  published: boolean;
  created_at: string;
  photos: string[] | null;
  videos: string[] | null;
  pdfs: string[] | null;
}

const ActualiteDetail = () => {
  const { id } = useParams();
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActualite = async () => {
      try {
        const { data, error } = await supabase
          .from("actualites")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setActualite(data as unknown as Actualite);
        }
      } catch (error) {
        console.error("Error fetching actualite:", error);
        toast.error("Erreur lors du chargement de l'actualité");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActualite();
    }
  }, [id]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Communiqué":
        return FileText;
      case "Note au public":
        return AlertTriangle;
      case "Annonce":
        return Megaphone;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string, urgent: boolean) => {
    if (urgent) return "destructive";
    switch (type) {
      case "Communiqué":
        return "default";
      case "Note au public":
        return "secondary";
      case "Annonce":
        return "outline";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Chargement...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!actualite) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">Actualité non trouvée</p>
          <Button asChild>
            <Link to="/actualites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux actualités
            </Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const IconComponent = getTypeIcon(actualite.type);

  return (
    <>
      <Header />
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/actualites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux actualités
            </Link>
          </Button>

          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={getTypeColor(actualite.type, actualite.urgent)}>
                  {actualite.urgent && "🔴 "}
                  {actualite.type}
                </Badge>
                <IconComponent className="h-5 w-5 text-muted-foreground" />
              </div>

              <h1 className="text-4xl font-bold text-primary mb-4">
                {actualite.title}
              </h1>

              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(actualite.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-lg text-foreground/90 mb-6 font-medium">
                  {actualite.description}
                </p>

                {actualite.content && (
                  <div
                    className="prose prose-lg max-w-none text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: actualite.content }}
                  />
                )}
              </CardContent>
            </Card>

            {actualite.photos && actualite.photos.length > 0 && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {actualite.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {actualite.videos && actualite.videos.length > 0 && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">Vidéos</h3>
                  <div className="space-y-4">
                    {actualite.videos.map((video, index) => (
                      <video key={index} controls className="w-full rounded-lg">
                        <source src={video} />
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {actualite.pdfs && actualite.pdfs.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Documents joints
                  </h3>
                  <div className="space-y-3">
                    {actualite.pdfs.map((pdf, index) => (
                      <a
                        key={index}
                        href={pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <Download className="h-5 w-5 text-primary" />
                        <span className="font-medium">Document {index + 1}.pdf</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ActualiteDetail;
