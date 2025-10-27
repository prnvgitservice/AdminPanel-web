import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

interface Area {
  name: string;
  lat: number;
  lng: number;
  zone: "North" | "South" | "East" | "West" | "Central";
}

const hyderabadAreas: Area[] = [
  { name: "Charminar", lat: 17.3616, lng: 78.4747, zone: "South" },
  { name: "Begumpet", lat: 17.4432, lng: 78.4738, zone: "Central" },
  { name: "Secunderabad", lat: 17.4399, lng: 78.4983, zone: "North" },
  { name: "Ameerpet", lat: 17.4368, lng: 78.4487, zone: "Central" },
  { name: "Banjara Hills", lat: 17.4143, lng: 78.4346, zone: "Central" },
  { name: "Jubilee Hills", lat: 17.4325, lng: 78.407, zone: "Central" },
  { name: "Madhapur", lat: 17.4478, lng: 78.385, zone: "West" },
  { name: "Hitech City", lat: 17.4435, lng: 78.3772, zone: "West" },
  { name: "Kondapur", lat: 17.4587, lng: 78.3733, zone: "West" },
  { name: "Gachibowli", lat: 17.4431, lng: 78.3489, zone: "West" },
  { name: "Mehdipatnam", lat: 17.3961, lng: 78.44, zone: "South" },
  { name: "Kukatpally", lat: 17.4933, lng: 78.3996, zone: "West" },
  { name: "Miyapur", lat: 17.5043, lng: 78.3578, zone: "West" },
  { name: "LB Nagar", lat: 17.3535, lng: 78.552, zone: "East" },
  { name: "Dilsukhnagar", lat: 17.3686, lng: 78.5247, zone: "East" },
  { name: "Uppal", lat: 17.4058, lng: 78.5591, zone: "East" },
  { name: "Malakpet", lat: 17.3717, lng: 78.5014, zone: "South" },
  { name: "Himayat Nagar", lat: 17.4062, lng: 78.4761, zone: "Central" },
  { name: "Abids", lat: 17.3871, lng: 78.476, zone: "Central" },
  { name: "Nampally", lat: 17.3897, lng: 78.4734, zone: "Central" },
];

const zoneColors: Record<Area["zone"], string> = {
  North: "blue",
  South: "red",
  East: "orange",
  West: "green",
  Central: "purple",
};

export const HyderabadMap: React.FC = () => {
  return (
    <div style={{ height: "560px", width: "100%" }}>
      <MapContainer center={[17.385, 78.4867]} zoom={11} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {hyderabadAreas.map((area, index) => (
          <CircleMarker
            key={index}
            center={[area.lat, area.lng]}
            radius={12}
            pathOptions={{
              color: zoneColors[area.zone],
              fillColor: zoneColors[area.zone],
              fillOpacity: 0.5,
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <strong>{area.name}</strong>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};



const ServiceAreasMap: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Service Areas</h2>
        <div className="flex items-center text-blue-600 text-sm font-semibold">
          <MapPin className="h-4 w-4 mr-1" />
          12 Active Locations
        </div>
      </div>
      <div className="rounded-xl overflow-hidden h-96">
        <HyderabadMap />
      </div>
    </div>
  );
};

export default ServiceAreasMap;