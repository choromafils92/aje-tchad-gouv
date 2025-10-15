import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Map = () => {
  const ajeLocation = {
    name: "Agence Judiciaire de l'État",
    address: "Avenue Félix Éboué, Quartier administratif",
    city: "N'Djamena, République du Tchad",
    lat: 12.1067,
    lng: 15.0444
  };

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(`${ajeLocation.name}, ${ajeLocation.address}, ${ajeLocation.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-[500px] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
          {/* Decorative grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Center marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6 z-10">
              <div className="relative">
                <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                  <MapPin className="w-12 h-12" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-primary/30 rounded-full blur-sm" />
              </div>
              
              <div className="bg-background/95 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-md">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Agence Judiciaire de l'État
                </h3>
                <p className="text-foreground/80 mb-1">
                  Avenue Félix Éboué
                </p>
                <p className="text-foreground/80 mb-1">
                  Quartier administratif
                </p>
                <p className="text-foreground/80 mb-4">
                  N'Djamena, République du Tchad
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Coordonnées: {ajeLocation.lat}° N, {ajeLocation.lng}° E
                </p>
                
                <Button onClick={openInGoogleMaps} className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  Ouvrir dans Google Maps
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 text-primary/20">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="absolute top-4 right-4 text-primary/20">
            <Navigation className="w-8 h-8" />
          </div>
          <div className="absolute bottom-4 left-4 text-primary/20">
            <Navigation className="w-8 h-8 transform rotate-180" />
          </div>
          <div className="absolute bottom-4 right-4 text-primary/20">
            <MapPin className="w-8 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Map;
