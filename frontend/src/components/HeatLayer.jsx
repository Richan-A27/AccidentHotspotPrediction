import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Normalize intensities so the map has visible gradients
    const maxIntensity = Math.max(...points.map(p => p.intensity || 1));
    const normalized = points.map(p => [
      p.lat,
      p.lng,
      (p.intensity || 1) / maxIntensity,
    ]);

    const heat = L.heatLayer(normalized, {
      radius: 25,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.3,
      gradient: {
        0.1: "#00ffff",
        0.3: "#00ff00",
        0.5: "#ffff00",
        0.7: "#ff8000",
        1.0: "#ff0000",
      },
    }).addTo(map);

    return () => map.removeLayer(heat);
  }, [map, points]);

  return null;
};

export default HeatLayer;
