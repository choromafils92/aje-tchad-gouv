import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, FileText, AlertTriangle, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface Actualite {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  urgent: boolean;
}

const LatestNews = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [news, setNews] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const { data, error } = await supabase
          .from("actualites")
          .select("id, type, title, description, created_at, urgent")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        console.error("Error fetching actualites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActualites();
  }, []);

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

  if (loading) {
    return null; // Ne rien afficher pendant le chargement
  }

  if (news.length === 0) {
    return null; // Ne rien afficher si pas d'actualités
  }

  return (
    <section ref={ref} className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className={`flex justify-between items-center mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Dernières publications
            </h2>
            <p className="text-lg text-muted-foreground">
              Consultez nos derniers communiqués, notes et annonces officielles
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="hidden md:flex">
            <Link to="/actualites">
              Toutes les actualités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {news.map((item, index) => {
            const IconComponent = getTypeIcon(item.type);
            const delay = index * 150;
            return (
              <Card 
                key={item.id} 
                className={`group hover:shadow-lg transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant={getTypeColor(item.type, item.urgent)} className="text-xs">
                      {item.urgent && "🔴 "}{item.type}
                    </Badge>
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg leading-snug group-hover:text-accent transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-foreground/80 leading-relaxed">
                    {item.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(item.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground hover:bg-accent" asChild>
                      <Link to={`/actualites/${item.id}`}>
                        Lire plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;