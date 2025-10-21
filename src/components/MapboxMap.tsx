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

  // Si pas de token configuré, afficher Google Maps iframe (gratuit et sans token)
  if (!mapboxToken) {
    const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA4JzA1LjMiTiAxNcKwMDMnMjAuNSJF!5e0!3m2!1sfr!2std!4v1234567890!5m2!1sfr!2std&zoom=16`;
    
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-[500px]">
            {/* Google Maps iframe */}
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation Agence Juridique de l'État"
            />
            
            {/* Info overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
              <div className="bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-md pointer-events-auto">
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
