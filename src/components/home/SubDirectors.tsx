import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface SubDirector {
  name: string;
  responsable: string;
  phone: string;
  email: string;
  photo?: string;
}

const SubDirectors = () => {
  const [loading, setLoading] = useState(true);
  const [subdirectors, setSubdirectors] = useState<SubDirector[]>([]);

  useEffect(() => {
    fetchSubdirectors();
  }, []);

  const fetchSubdirectors = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("value")
        .eq("key", "subdirections")
        .maybeSingle();

      if (error) throw error;

      setSubdirectors(data?.value || []);
    } catch (error) {
      console.error("Error fetching subdirectors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!subdirectors || subdirectors.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos Sous-Directeurs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            L'équipe de direction de l'Agence Judiciaire de l'État
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {subdirectors.map((subdirector, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Avatar className="w-40 h-40 border-4 border-primary/20 shadow-lg hover:scale-105 transition-transform duration-300">
                <AvatarImage
                  src={subdirector.photo}
                  alt={subdirector.responsable}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold">
                  {subdirector.responsable
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "SD"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {subdirector.responsable}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {subdirector.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubDirectors;
