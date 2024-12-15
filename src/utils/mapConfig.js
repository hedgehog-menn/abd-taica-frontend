import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const mapSettings = {
  center: [23.97, 120.97],
  zoom: 7,
  minZoom: 6,
  bounds: {
    southWest: [21.8, 119.3],
    northEast: [25.4, 122.0],
  },
  maxBoundsViscosity: 1.0,
};

export const initMap = (container) => {
  const bounds = L.latLngBounds(
    L.latLng(mapSettings.bounds.southWest),
    L.latLng(mapSettings.bounds.northEast)
  );

  const map = L.map(container, {
    center: mapSettings.center,
    zoom: mapSettings.zoom,
    minZoom: mapSettings.minZoom,
    maxBounds: bounds,
    maxBoundsViscosity: mapSettings.maxBoundsViscosity,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  return map;
};
