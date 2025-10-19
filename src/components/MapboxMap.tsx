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
  const [mapboxToken, setMapboxToken] = useState('');
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
        .in('key', ['gps_latitude', 'gps_longitude', 'location_name', 'location_address', 'mapbox_token', 'google_place_id']);

      if (error) throw error;

      const newLocation = { ...location };
      let token = '';
      
      data?.forEach((setting: any) => {
        switch (setting.key) {
          case 'gps_latitude':
            const lat = parseFloat(setting.value);
            if (!isNaN(lat)) newLocation.lat = lat;
            break;
          case 'gps_longitude':
            const lng = parseFloat(setting.value);
            if (!isNaN(lng)) newLocation.lng = lng;
            break;
          case 'location_name':
            if (setting.value) newLocation.name = setting.value as string;
            break;
          case 'location_address':
            if (setting.value) newLocation.address = setting.value as string;
            break;
          case 'mapbox_token':
            if (setting.value) token = setting.value as string;
            break;
        }
      });
      
      setLocation(newLocation);
      if (token) {
        setMapboxToken(token);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || loading || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

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
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [location, loading, mapboxToken]);

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

  // Si pas de token configuré, afficher la carte simple (fallback)
  if (!mapboxToken) {
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
                    {location.name}
                  </h3>
                  <p className="text-foreground/80 mb-1">
                    {location.address}
                  </p>
                  <p className="text-foreground/80 mb-4">
                    {location.city}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Coordonnées: {location.lat.toFixed(6)}° N, {location.lng.toFixed(6)}° E
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
