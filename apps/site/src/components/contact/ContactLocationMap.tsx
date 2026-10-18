"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ContactLocationMap({
  lat,
  lon,
  label,
}: {
  lat: number;
  lon: number;
  label: string;
}) {
  useEffect(() => {
    const panes = document.querySelectorAll<HTMLElement>(".contact-map .leaflet-container");
    panes.forEach((pane) => {
      pane.style.height = "100%";
      pane.style.minHeight = "22rem";
      pane.style.zIndex = "0";
    });
  }, [lat, lon]);

  return (
    <div className="contact-map h-full min-h-[22rem]">
      <MapContainer
        center={[lat, lon]}
        zoom={16}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full min-h-[22rem] w-full"
        aria-label={label}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lon]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
