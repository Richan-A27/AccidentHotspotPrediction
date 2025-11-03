import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import API from "../api";
import "leaflet.heat";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition([newPos.lat, newPos.lng]);
        },
      }}
    >
      <Popup>
        📍 Selected Location <br />
        Lat: {position[0].toFixed(4)} <br />
        Lon: {position[1].toFixed(4)}
      </Popup>
    </Marker>
  );
};

const MapView = ({ onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState([13.0827, 80.2707]); // Default Chennai
  const [hotspots, setHotspots] = useState([]);

  // Fetch backend hotspots for heatmap
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const res = await API.get("/hotspots");
        setHotspots(res.data.hotspots || []);
        console.log("✅ Hotspots loaded:", res.data.hotspots.length);
      } catch (err) {
        console.error("❌ Error fetching hotspots:", err);
      }
    };
    fetchHotspots();
  }, []);

  // Render heatmap
  useEffect(() => {
    if (map && hotspots.length > 0) {
      const points = hotspots.map((p) => [p.latitude, p.longitude, p.risk]);
      const heat = L.heatLayer(points, { radius: 25, blur: 15, maxZoom: 15 });
      heat.addTo(map);
      return () => map.removeLayer(heat);
    }
  }, [map, hotspots]);

  // Update selected location to parent
  useEffect(() => {
    if (onLocationSelect) {
      onLocationSelect({
        latitude: position[0],
        longitude: position[1],
      });
    }
  }, [position]);

  return (
    <MapContainer
      center={position}
      zoom={12}
      whenCreated={setMap}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
};

export default MapView;
