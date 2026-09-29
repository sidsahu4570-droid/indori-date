export function formatDistance(distanceKm: number): string {
  if (distanceKm <= 1) {
    return 'Less than 1 km away';
  }
  return `📍 ${Math.round(distanceKm)} km away`;
}

export function getIndoreLocalityCoordinates(locality: string): { lat: number; lng: number } {
  // Center points of major Indore localities
  const coords: Record<string, { lat: number; lng: number }> = {
    'Vijay Nagar': { lat: 22.7533, lng: 75.8937 },
    'Old & New Palasia': { lat: 22.7238, lng: 75.8839 },
    'Rajwada & Sarafa': { lat: 22.7196, lng: 75.8577 },
    'Bhawarkua & Tower Square': { lat: 22.6926, lng: 75.8676 },
    'Annapurna & Sudama Nagar': { lat: 22.7001, lng: 75.8344 },
    'Saket & Manoramaganj': { lat: 22.7202, lng: 75.8906 },
    'Scheme 54 / Meghdoot': { lat: 22.7589, lng: 75.8899 },
    'Scheme 78 & Aranya': { lat: 22.7667, lng: 75.8944 },
    'Bypass / Phoenix Citadel': { lat: 22.7244, lng: 75.9325 },
    'Super Corridor & Aerodrome': { lat: 22.7483, lng: 75.8055 },
    'AB Road Corridor': { lat: 22.7311, lng: 75.8794 },
    'Rau & Silicon City': { lat: 22.6288, lng: 75.8066 },
    'Kanadia Road & Bengali Square': { lat: 22.7142, lng: 75.9122 },
    'Geeta Bhawan & Navlakha': { lat: 22.7099, lng: 75.8789 },
  };

  return coords[locality] || { lat: 22.7196, lng: 75.8577 }; // default Rajwada
}

export function calculateLocalityDistance(loc1: string, loc2: string): number {
  if (loc1 === loc2) return 1.2;
  const p1 = getIndoreLocalityCoordinates(loc1);
  const p2 = getIndoreLocalityCoordinates(loc2);

  const R = 6371; // km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(1, Math.round(d * 10) / 10);
}
