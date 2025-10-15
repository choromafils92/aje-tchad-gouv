import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapInitialized) return;

    try {
      // Initialize map with N'Djamena coordinates
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [15.0444, 12.1067], // N'Djamena coordinates [lng, lat]
        zoom: 15,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add marker for AJE location
      new mapboxgl.Marker({ color: '#0066cc' })
        .setLngLat([15.0444, 12.1067])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              '<h3 style="font-weight: bold; margin-bottom: 8px;">Agence Judiciaire de l\'État</h3>' +
              '<p style="margin: 0;">Avenue Félix Éboué<br/>Quartier administratif<br/>N\'Djamena, Tchad</p>'
            )
        )
        .addTo(map.current);

      setMapInitialized(true);

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }, [mapboxToken, mapInitialized]);

  return (
    <div className="w-full space-y-4">
      {!mapInitialized && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration de la carte</CardTitle>
            <CardDescription>
              Entrez votre clé publique Mapbox pour afficher la carte interactive.
              Obtenez-la gratuitement sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      <div 
        ref={mapContainer} 
        className={`w-full rounded-lg shadow-lg ${mapInitialized ? 'h-[500px]' : 'h-0'}`}
      />
    </div>
  );
};

export default Map;
