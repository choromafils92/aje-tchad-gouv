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
}

const Actualites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const { data, error } = await supabase
          .from("actualites")
          .select("id, type, title, description, created_at, urgent")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setActualites(data || []);
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
    { value: "Annonce", label: "Annonce" }
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
                                {new Date(actu.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                            <CardTitle className="text-xl lg:text-2xl leading-tight">
                              {actu.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CardDescription className="text-base text-foreground/80 leading-relaxed">
                              {actu.description}
                            </CardDescription>
                            <div className="pt-4 border-t">
                              <Button 
                                variant="outline" 
                                className="group"
                                asChild
                              >
                                <Link to={`/actualites/${actu.id}`}>
                                  Lire l'article complet
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