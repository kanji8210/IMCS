"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { EntryPoint } from "./KenyaEntryMap";

const typeColor: Record<EntryPoint["type"], string> = {
  Air: "#1f8f4b",
  Land: "#c0182f",
  Sea: "#2a7ccf",
};

export function KenyaEntryMapInner({ entryPoints }: { entryPoints: EntryPoint[] }) {
  return (
    <MapContainer
      center={[0.6, 37.9]}
      zoom={6}
      minZoom={5}
      maxZoom={9}
      scrollWheelZoom={false}
      zoomControl={true}
      className="h-56 w-full sm:h-64 lg:h-[300px]"
      attributionControl
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {entryPoints.map((point) => (
        <CircleMarker
          key={point.name}
          center={[point.lat, point.lng]}
          radius={7}
          pathOptions={{
            color: "#dbeafe",
            weight: 1,
            fillColor: typeColor[point.type],
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div className="text-xs text-slate-900">
              <p className="font-semibold">{point.name}</p>
              <p>{point.location}</p>
              <p className="mt-1">Type: {point.type}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
