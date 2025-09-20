import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Map = () => {
  const ajeLocation = {
    name: "Agence Judiciaire de l'État",
    address: "Avenue Félix Éboué, Quartier administratif",
    city: "N'Djamena, République du Tchad",
    coordinates: "12.1067° N, 15.0444° E"
  };

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(`${ajeLocation.name}, ${ajeLocation.address}, ${ajeLocation.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Notre Localisation
            </h2>
            <p className="text-lg text-muted-foreground">
              Trouvez-nous dans le quartier administratif de N'Djamena
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carte visuelle */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  <div className="text-center space-y-4 z-10">
                    <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto">
                      <MapPin className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">
                      N'Djamena, Tchad
                    </h3>
                    <p className="text-muted-foreground">
                      Quartier administratif
                    </p>
                    <Button onClick={openInGoogleMaps} className="mt-4">
                      <Navigation className="w-4 h-4 mr-2" />
                      Voir sur Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Informations de Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Adresse Principale</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>{ajeLocation.name}</p>
                    <p>{ajeLocation.address}</p>
                    <p>{ajeLocation.city}</p>
                    <p className="text-sm">Coordonnées: {ajeLocation.coordinates}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">Horaires d'ouverture</h4>
                  <div className="space-y-1 text-muted-foreground text-sm">
                    <p>Lundi - Jeudi: 7h30 - 15h30</p>
                    <p>Vendredi: 7h30 - 12h30</p>
                    <p>Samedi - Dimanche: Fermé</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">Contact d'urgence</h4>
                  <div className="space-y-1 text-muted-foreground text-sm">
                    <p>📞 +235 22 51 44 19</p>
                    <p>✉️ urgence@aje.td</p>
                    <p className="text-xs italic">Service 24h/24 pour les urgences contentieuses</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">Accès</h4>
                  <div className="text-muted-foreground text-sm">
                    <p>• Proche de la Présidence de la République</p>
                    <p>• À 5 minutes du Ministère de la Justice</p>
                    <p>• Parking disponible pour les visiteurs officiels</p>
                    <p>• Accès PMR (Personnes à Mobilité Réduite)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;