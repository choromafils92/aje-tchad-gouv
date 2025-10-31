import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, Megaphone, FileText, AlertTriangle, Users, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Actualite {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  urgent: boolean;
  original_id?: string;
  category?: 'job' | 'press' | string;
  videos?: string[];
  photos?: string[];
}

const Actualites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        // Fetch actualites, job offers, and press releases
        const [actualitesRes, jobOffersRes, pressReleasesRes] = await Promise.all([
          supabase
            .from("actualites")
            .select("id, type, title, description, created_at, urgent, videos, photos")
            .eq("published", true),
          (supabase as any)
            .from("job_offers")
            .select("id, title, department, type, created_at, description")
            .eq("published", true),
          (supabase as any)
            .from("media_press_releases")
            .select("id, title, category, excerpt, date_publication, created_at")
            .eq("published", true)
        ]);

        if (actualitesRes.error) throw actualitesRes.error;
        if (jobOffersRes.error) throw jobOffersRes.error;
        if (pressReleasesRes.error) throw pressReleasesRes.error;

        // Transform job offers to actualite format
        const jobOffersFormatted = (jobOffersRes.data || []).map((job: any) => ({
          id: `job-${job.id}`,
          type: "Offre d'emploi",
          title: `${job.title} - ${job.department}`,
          description: job.description || `Poste de type ${job.type} disponible`,
          created_at: job.created_at,
          urgent: false,
          original_id: job.id,
          category: 'job'
        }));

        // Transform press releases to actualite format
        const pressReleasesFormatted = (pressReleasesRes.data || []).map((press: any) => ({
          id: `press-${press.id}`,
          type: "Communiqué de Presse",
          title: press.title,
          description: press.excerpt,
          created_at: press.created_at,
          urgent: false,
          original_id: press.id,
          category: 'press'
        }));

        // Combine all and sort by date (most recent first)
        const allNews = [
          ...(actualitesRes.data || []),
          ...jobOffersFormatted,
          ...pressReleasesFormatted
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setActualites(allNews);
      } catch (error) {
        console.error("Error fetching actualites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActualites();
  }, []);

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "Communiqué", label: "Communiqué" },
    { value: "Note au public", label: "Note au public" },
    { value: "Annonce", label: "Annonce" },
    { value: "Offre d'emploi", label: "Offres d'emploi" },
    { value: "Communiqué de Presse", label: "Communiqués de Presse" }
  ];

  const getTypeColor = (type: string, urgent: boolean) => {
    if (urgent) return "destructive";
    switch (type) {
      case "Communiqué": return "default";
      case "Note au public": return "secondary";
      case "Annonce": return "outline";
      default: return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Communiqué": return FileText;
      case "Note au public": return AlertTriangle;
      case "Annonce": return Megaphone;
      case "Offre d'emploi": return Users;
      case "Communiqué de Presse": return FileText;
      default: return FileText;
    }
  };

  const filteredActualites = actualites.filter(actu => {
    const matchesSearch = actu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actu.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || actu.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex items-center justify-center py-20">
          <p className="text-lg text-muted-foreground">Chargement des actualités...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Megaphone className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
                Actualités & Publications
              </h1>
              <p className="text-xl lg:text-2xl font-bold mb-8 text-white drop-shadow-md">
                Communiqués, notes officielles et annonces de l'AJE
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher dans les actualités..."
                    className="pl-10 py-6"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="lg:w-64">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="py-6">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {filteredActualites.length} publication{filteredActualites.length > 1 ? 's' : ''} trouvée{filteredActualites.length > 1 ? 's' : ''}
                </h2>
                <p className="text-muted-foreground">
                  Triées par date de publication, de la plus récente à la plus ancienne
                </p>
              </div>

              <div className="space-y-8">
                {filteredActualites.map((actu) => {
                  const IconComponent = getTypeIcon(actu.type);
                  const hasVideo = actu.videos && actu.videos.length > 0;
                  const hasPhoto = actu.photos && actu.photos.length > 0;
                  
                  const getVideoEmbedUrl = (url: string) => {
                    if (url.includes("youtube.com/watch")) {
                      const videoId = url.split("v=")[1]?.split("&")[0];
                      return `https://www.youtube.com/embed/${videoId}`;
                    } else if (url.includes("youtu.be/")) {
                      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
                      return `https://www.youtube.com/embed/${videoId}`;
                    } else if (url.includes("vimeo.com/")) {
                      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
                      return `https://player.vimeo.com/video/${videoId}`;
                    } else if (url.includes("facebook.com")) {
                      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
                    }
                    return url;
                  };

                  return (
                    <Card key={actu.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                        <div className="lg:col-span-3">
                          <CardHeader className="space-y-4">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                              <div className="flex items-center space-x-3">
                                <Badge variant={getTypeColor(actu.type, actu.urgent)} className="text-xs">
                                  {actu.urgent && "🔴 "}{actu.type}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span className="font-digital tracking-wider">
                                  {new Date(actu.created_at).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                            <CardTitle className="text-xl lg:text-2xl leading-tight">
                              {actu.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-base text-foreground/80 leading-relaxed">
                              {actu.description}
                            </p>
                            
                            {hasVideo && (
                              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                {actu.videos![0]?.endsWith('.mp4') || actu.videos![0]?.endsWith('.webm') || actu.videos![0]?.endsWith('.ogg') || actu.videos![0]?.includes('supabase.co/storage') ? (
                                  <video
                                    controls
                                    className="w-full h-full object-cover"
                                    preload="metadata"
                                    crossOrigin="anonymous"
                                  >
                                    <source src={actu.videos![0]} type="video/mp4" />
                                    <source src={actu.videos![0]} type="video/webm" />
                                    <source src={actu.videos![0]} type="video/ogg" />
                                    Votre navigateur ne supporte pas la lecture de vidéos.
                                  </video>
                                ) : (
                                  <iframe
                                    src={getVideoEmbedUrl(actu.videos![0])}
                                    title={actu.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                )}
                              </div>
                            )}

                            {hasPhoto && !hasVideo && (
                              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                <img 
                                  src={actu.photos![0]} 
                                  alt={actu.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="pt-4 border-t">
                            <Button 
                              variant="outline" 
                              className="group"
                              asChild
                            >
                              <Link to={
                                actu.category === 'job' 
                                  ? `/carrieres#${actu.original_id}` 
                                  : actu.category === 'press'
                                  ? `/medias#${actu.original_id}`
                                  : `/actualites/${actu.id}`
                              }>
                                {actu.category === 'job' ? 'Voir l\'offre' : 'Lire l\'article complet'}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                            </div>
                          </CardContent>
                        </div>
                        <div className="bg-secondary/50 p-6 flex items-center justify-center">
                          <IconComponent className="h-16 w-16 text-muted-foreground" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredActualites.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Aucune actualité trouvée
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Essayez de modifier vos critères de recherche ou de filtrage
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Restez informé
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Abonnez-vous pour recevoir nos dernières publications et communiqués officiels
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Votre email professionnel"
                  className="flex-1"
                />
                <Button
                  onClick={() => alert('Inscription à la newsletter confirmée ! Vous recevrez nos dernières publications par email.')}
                >
                  S'abonner
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Vous pouvez également suivre notre flux RSS pour une mise à jour automatique
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;