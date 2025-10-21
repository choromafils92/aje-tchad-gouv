import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Newspaper, Scale, Briefcase, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'actualite' | 'texte' | 'jurisprudence' | 'service';
  url: string;
  date?: string;
}

const Recherche = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    try {
      // Recherche dans les actualités
      const { data: actualites } = await supabase
        .from('actualites' as any)
        .select('id, title, description, created_at, type')
        .eq('published', true);

      actualites?.forEach((item: any) => {
        if (
          item.title?.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: item.id,
            title: item.title,
            description: item.description,
            type: 'actualite',
            url: `/actualites/${item.id}`,
            date: item.created_at,
          });
        }
      });

      // Recherche dans les textes juridiques
      const { data: textes } = await supabase
        .from('textes_juridiques' as any)
        .select('id, title, type, reference, date_publication')
        .eq('published', true);

      textes?.forEach((item: any) => {
        if (
          item.title?.toLowerCase().includes(lowerQuery) ||
          item.reference?.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: item.id,
            title: item.title,
            description: `${item.type} - ${item.reference || ''}`,
            type: 'texte',
            url: `/textes`,
            date: item.date_publication,
          });
        }
      });

      // Recherche dans les jurisprudences
      const { data: jurisprudences } = await supabase
        .from('jurisprudences' as any)
        .select('id, affaire, domaine, juridiction, date')
        .eq('published', true);

      jurisprudences?.forEach((item: any) => {
        if (
          item.affaire?.toLowerCase().includes(lowerQuery) ||
          item.domaine?.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: item.id,
            title: item.affaire,
            description: `${item.juridiction} - ${item.domaine}`,
            type: 'jurisprudence',
            url: `/textes`,
            date: item.date,
          });
        }
      });

      // Recherche dans les services
      const { data: services } = await supabase
        .from('services_juridiques' as any)
        .select('id, titre, description')
        .eq('published', true);

      services?.forEach((item: any) => {
        if (
          item.titre?.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: item.id,
            title: item.titre,
            description: item.description,
            type: 'service',
            url: `/services`,
          });
        }
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'actualite': return <Newspaper className="h-5 w-5" />;
      case 'texte': return <FileText className="h-5 w-5" />;
      case 'jurisprudence': return <Scale className="h-5 w-5" />;
      case 'service': return <Briefcase className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      actualite: 'Actualité',
      texte: 'Texte juridique',
      jurisprudence: 'Jurisprudence',
      service: 'Service',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Search className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
                Recherche
              </h1>
              <p className="text-xl lg:text-2xl font-bold mb-8 text-white drop-shadow-md">
                Trouvez rapidement l'information que vous cherchez
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="mb-12">
                <div className="flex gap-4">
                  <Input
                    type="search"
                    placeholder="Rechercher des actualités, textes juridiques, services..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 h-12 text-lg"
                    autoFocus
                  />
                  <Button type="submit" size="lg" disabled={loading}>
                    <Search className="h-5 w-5 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </form>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="mb-6">
                    <p className="text-lg text-muted-foreground">
                      <span className="font-semibold text-primary">{results.length}</span> résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {results.map((result) => (
                      <Card key={`${result.type}-${result.id}`} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getIcon(result.type)}
                                <Badge variant="secondary">{getTypeLabel(result.type)}</Badge>
                                {result.date && (
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(result.date).toLocaleDateString('fr-FR')}
                                  </span>
                                )}
                              </div>
                              <Link to={result.url}>
                                <CardTitle className="text-xl hover:text-primary transition-colors">
                                  {result.title}
                                </CardTitle>
                              </Link>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground/80 line-clamp-2">{result.description}</p>
                          <Link to={result.url}>
                            <Button variant="link" className="px-0 mt-2">
                              Voir plus →
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : query ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
                    <p className="text-muted-foreground">
                      Essayez avec d'autres mots-clés ou termes de recherche
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Recherche;
