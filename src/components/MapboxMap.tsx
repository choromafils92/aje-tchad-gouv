import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MapboxMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
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

      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
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

  if (showTokenInput || !mapboxToken) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Pour afficher la carte interactive, veuillez configurer votre token Mapbox.
              Obtenez votre token sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Token Mapbox Public</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZS11c2VyIiwiYSI6ImNsZTEyMzQ1NiJ9..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
          </div>

          <Button onClick={() => setShowTokenInput(false)} className="w-full">
            Afficher la carte
          </Button>

          <div className="pt-4 border-t">
            <Button onClick={openInGoogleMaps} variant="outline" className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              Ouvrir dans Google Maps à la place
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
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
