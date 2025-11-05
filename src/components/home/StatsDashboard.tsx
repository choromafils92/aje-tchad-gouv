import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Users, TrendingUp, Award, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsDashboard = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();
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
        setStats([]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats([]);
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
      Clock,
    };
    return icons[iconName] || FileText;
  };

  if (loading) return null;

  // Ne rien afficher si aucune statistique
  if (!stats || stats.length === 0) return null;

  return (
    <section ref={ref} className="py-8 bg-gradient-to-br from-secondary via-background to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            {t("stats.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("stats.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.icon_name);
            
            return (
              <Card 
                key={index}
                className="border-2 hover:shadow-xl hover:border-primary/50 transition-all duration-500"
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
                    <span className="text-muted-foreground font-normal ml-1">{t("stats.thisYear")}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            {t("stats.updated")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsDashboard;
