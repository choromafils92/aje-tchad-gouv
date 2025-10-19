import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink, Loader2 } from 'lucide-react';

const MapboxMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    name: "Agence Judiciaire de l'État",
    address: "Avenue Félix Éboué, Quartier administratif",
    city: "N'Djamena, République du Tchad",
    lat: 12.1067,
    lng: 15.0444
  });

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('key, value')
        .in('key', ['gps_latitude', 'gps_longitude', 'location_name', 'location_address']);

      if (error) throw error;

      const newLocation = { ...location };
      data?.forEach((setting: any) => {
        switch (setting.key) {
          case 'gps_latitude':
            newLocation.lat = parseFloat(setting.value);
            break;
          case 'gps_longitude':
            newLocation.lng = parseFloat(setting.value);
            break;
          case 'location_name':
            newLocation.name = setting.value as string;
            break;
          case 'location_address':
            newLocation.address = setting.value as string;
            break;
        }
      });
      setLocation(newLocation);
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || loading) return;

    // Initialiser Mapbox avec le token public
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZS11c2VyIiwiYSI6ImNsZTEyMzQ1NiJ9.example-token';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.lng, location.lat],
      zoom: 15,
    });

    // Ajouter un marqueur
    new mapboxgl.Marker({ color: '#0066cc' })
      .setLngLat([location.lng, location.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 style="font-weight: bold; margin-bottom: 5px;">${location.name}</h3><p>${location.address}</p>`)
      )
      .addTo(map.current);

    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [location, loading]);

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(`${location.name}, ${location.address}, ${location.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div ref={mapContainer} className="h-[500px]" />
          
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-md">
              <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {location.name}
              </h3>
              <p className="text-foreground/80 text-sm mb-1">{location.address}</p>
              <p className="text-foreground/80 text-sm mb-3">{location.city}</p>
              <p className="text-xs text-muted-foreground mb-3">
                Coordonnées: {location.lat.toFixed(6)}° N, {location.lng.toFixed(6)}° E
              </p>
              
              <Button onClick={openInGoogleMaps} size="sm" className="w-full">
                <Navigation className="w-4 h-4 mr-2" />
                Ouvrir dans Google Maps
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapboxMap;
