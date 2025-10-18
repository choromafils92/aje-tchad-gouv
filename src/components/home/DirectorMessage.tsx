import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import directeurImage from "@/assets/directeur-aje.png";

const DirectorMessage = () => {
  const [loading, setLoading] = useState(true);
  const [directorName, setDirectorName] = useState("MAHAMAT TADJADINE");
  const [directorTitle, setDirectorTitle] = useState("Agent Judiciaire de l'État");
  const [directorGrade, setDirectorGrade] = useState("MAGISTRAT");
  const [directorPhoto, setDirectorPhoto] = useState(directeurImage);
  const [directorMessage, setDirectorMessage] = useState<string[]>([]);

  useEffect(() => {
    fetchDirectorInfo();
  }, []);

  const fetchDirectorInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["director_name", "director_title", "director_grade", "director_photo", "director_message"]);

      if (error) throw error;

      data?.forEach((setting) => {
        switch (setting.key) {
          case "director_name":
            setDirectorName(setting.value);
            break;
          case "director_title":
            setDirectorTitle(setting.value);
            break;
          case "director_grade":
            setDirectorGrade(setting.value);
            break;
          case "director_photo":
            setDirectorPhoto(setting.value);
            break;
          case "director_message":
            setDirectorMessage(setting.value);
            break;
        }
      });
    } catch (error) {
      console.error("Error fetching director info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="space-y-8">
                <div className="relative">
                  <div className="float-left mr-8 mb-6 w-64 flex-shrink-0">
                    <div className="relative w-full h-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={directorPhoto}
                        alt={`${directorName} - ${directorTitle}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4 text-center space-y-2">
                      <p className="text-base font-medium text-foreground">
                        {directorTitle}
                      </p>
                      <h3 className="text-2xl font-bold text-foreground whitespace-nowrap">
                        {directorName}
                      </h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-900 uppercase tracking-wide">
                        ({directorGrade})
                      </p>
                    </div>
                  </div>

                  <div className="text-foreground leading-relaxed space-y-4">
                    {directorMessage.map((paragraph, index) => (
                      <p key={index} className={index === 0 ? "text-lg" : ""}>
                        "{paragraph}"
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;