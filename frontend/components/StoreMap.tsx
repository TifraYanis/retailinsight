'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type StorePoint = {
  store_id: number; name: string; lat: number; lon: number;
  total_sales: number; trend_30: number;
};

export default function StoreMap({ data }: { data: StorePoint[] }) {
  const center: [number, number] = [46.5, 2.5]; // France approx.

  return (
    <div className="card">
      <div className="mb-2 subtle">Stores map</div>
      <MapContainer center={center} zoom={5.5} style={{ height: 500, width: '100%', borderRadius: 16 }}>
        <TileLayer
          // Light/dark tiles (Carto) - gratuit
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap & CartoDB'
        />
        {data.map((s) => {
          const color = s.trend_30 >= 0 ? '#34d399' : '#fb7185'; // green/red
          const radius = Math.max(6, Math.min(20, (s.total_sales / 2000))); // scale
          return (
            <CircleMarker key={s.store_id} center={[s.lat, s.lon]} radius={radius} pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{s.name}</div>
                  <div>Total sales: {Math.round(s.total_sales).toLocaleString()}</div>
                  <div>Trend 30d: {s.trend_30.toFixed(1)}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
