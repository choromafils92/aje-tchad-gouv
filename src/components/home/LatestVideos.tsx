import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Actualite {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  videos: string[];
  urgent: boolean;
}

const LatestVideos = () => {
  const [videos, setVideos] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("actualites")
          .select("id, type, title, description, created_at, videos, urgent")
          .eq("published", true)
          .not("videos", "is", null)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        
        // Filter to only include items with actual video URLs
        const videosWithContent = (data || []).filter(
          (item: any) => item.videos && Array.isArray(item.videos) && item.videos.length > 0
        );
        
        setVideos(videosWithContent);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getVideoEmbedUrl = (url: string) => {
    // Convert various video URL formats to embed URLs
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Return as-is if already an embed URL or for direct video files
    return url;
  };

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Dernières vidéos
          </h2>
          <p className="text-lg text-muted-foreground">
            Retrouvez nos dernières publications vidéo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {videos.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-500">
              <CardHeader className="p-0">
                <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {item.videos[0]?.endsWith('.mp4') || item.videos[0]?.endsWith('.webm') ? (
                    <video
                      src={item.videos[0]}
                      controls
                      className="w-full h-full object-cover"
                      poster=""
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  ) : (
                    <iframe
                      src={getVideoEmbedUrl(item.videos[0])}
                      title={item.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  {item.urgent && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      🔴 Urgent
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Vidéo
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-snug group-hover:text-accent transition-colors">
                  {item.title}
                </CardTitle>
                <p className="text-sm leading-relaxed line-clamp-2 text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground pt-2 border-t">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(item.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestVideos;
