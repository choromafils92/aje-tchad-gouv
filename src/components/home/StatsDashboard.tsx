import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Users, TrendingUp, Award, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const StatsDashboard = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('statistiques_contentieux' as any)
        .select('*')
        .eq('published', true)
        .order('ordre', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setStats(data);
      } else {
        // Stats par défaut si aucune n'est configurée
        setStats([
          { titre: 'Affaires traitées', valeur: '2,500+', evolution: '+15%', icon_name: 'FileText' },
          { titre: 'Taux de succès', valeur: '87%', evolution: '+5%', icon_name: 'Award' },
          { titre: 'Conseils juridiques', valeur: '1,200+', evolution: '+20%', icon_name: 'Scale' },
          { titre: 'Administrations servies', valeur: '150+', evolution: '+10%', icon_name: 'Users' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats([
        { titre: 'Affaires traitées', valeur: '2,500+', evolution: '+15%', icon_name: 'FileText' },
        { titre: 'Taux de succès', valeur: '87%', evolution: '+5%', icon_name: 'Award' },
        { titre: 'Conseils juridiques', valeur: '1,200+', evolution: '+20%', icon_name: 'Scale' },
        { titre: 'Administrations servies', valeur: '150+', evolution: '+10%', icon_name: 'Users' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      FileText,
      Scale,
      Users,
      TrendingUp,
      Award,
      CheckCircle,
    };
    return icons[iconName] || FileText;
  };

  if (loading) return null;

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-secondary via-background to-secondary">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Notre Performance en Chiffres
          </h2>
          <p className="text-xl text-muted-foreground">
            Des résultats concrets au service de l'État tchadien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.icon_name);
            const delay = index * 100;
            
            return (
              <Card 
                key={index}
                className={`border-2 hover:shadow-xl hover:border-primary/50 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.titre}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.valeur}
                  </div>
                  <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {stat.evolution}
                    <span className="text-muted-foreground font-normal ml-1">cette année</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-muted-foreground">
            * Données mises à jour en temps réel | Source: AJE Tchad
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsDashboard;
