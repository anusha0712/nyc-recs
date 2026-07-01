"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CATEGORY_META, type Place } from "@/data/places";

const COLOR_HEX: Record<string, string> = {
  hotred: "#ff3b2f",
  hotpink: "#ff4d9d",
  grape: "#6b4bd6",
  sky: "#2ea6e6",
  park: "#1fa562",
  taxi: "#ffcf24",
};

// A hand-drawn-ish teardrop pin with the category emoji, as an HTML divIcon so
// we skip Leaflet's broken default marker images entirely.
function pinIcon(place: Place) {
  const meta = CATEGORY_META[place.category];
  const color = COLOR_HEX[meta.color] ?? "#2ea6e6";
  return L.divIcon({
    className: "dw-pin",
    html: `
      <div style="
        width:34px;height:34px;border-radius:50% 50% 50% 0;
        background:${color};border:2.5px solid #141210;
        transform:rotate(-45deg);
        box-shadow:2px 2px 0 0 #141210;
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);font-size:16px;line-height:1;">${meta.emoji}</span>
      </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

export default function LeafletMap({ places }: { places: Place[] }) {
  const center = useMemo<[number, number]>(() => {
    if (places.length === 0) return [40.75, -73.98];
    const lat = places.reduce((s, p) => s + p.coords.lat, 0) / places.length;
    const lng = places.reduce((s, p) => s + p.coords.lng, 0) / places.length;
    return [lat, lng];
  }, [places]);

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {places.map((p) => (
        <Marker key={p.id} position={[p.coords.lat, p.coords.lng]} icon={pinIcon(p)}>
          <Popup>
            <div style={{ minWidth: 150 }}>
              <strong style={{ fontSize: 15 }}>{p.name}</strong>
              <div style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.7 }}>
                {p.neighborhood}
                {p.cuisine ? ` · ${p.cuisine}` : ""}
              </div>
              <div style={{ marginTop: 4 }}>
                {"🐧".repeat(Math.round(p.penguinRating))}
              </div>
              <a
                href={`/place/${p.id}`}
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  fontWeight: 700,
                  color: "#ff3b2f",
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                Read more →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
