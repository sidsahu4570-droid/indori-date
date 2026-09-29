export interface IndoreLocality {
  id: string;
  name: string;
  zone: 'East' | 'West' | 'North' | 'South' | 'Central';
  popularFor: string;
}

export const INDORE_LOCALITIES: IndoreLocality[] = [
  { id: 'vijay-nagar', name: 'Vijay Nagar', zone: 'East', popularFor: 'Cafés, Nightlife & C21' },
  { id: 'palasia', name: 'Old & New Palasia', zone: 'East', popularFor: 'Chappan Dukan & Boutiques' },
  { id: 'rajwada', name: 'Rajwada & Sarafa', zone: 'Central', popularFor: 'Heritage & Midnight Street Food' },
  { id: 'bhawarkua', name: 'Bhawarkua & Tower Square', zone: 'South', popularFor: 'Student Hub & Co-working' },
  { id: 'annapurna', name: 'Annapurna & Sudama Nagar', zone: 'West', popularFor: 'Peaceful Residential & Sweets' },
  { id: 'saket', name: 'Saket & Manoramaganj', zone: 'East', popularFor: 'Upscale Lounges & Tree-lined Avenues' },
  { id: 'scheme-54', name: 'Scheme 54 / Meghdoot', zone: 'East', popularFor: 'Meghdoot Garden & Street Cafes' },
  { id: 'scheme-78', name: 'Scheme 78 & Aranya', zone: 'East', popularFor: 'Modern Living & Food Parks' },
  { id: 'phoenix-citadel', name: 'Bypass / Phoenix Citadel', zone: 'East', popularFor: 'Mega Mall & Long Drives' },
  { id: 'super-corridor', name: 'Super Corridor & Aerodrome', zone: 'West', popularFor: 'Tech Parks & Sunset Drives' },
  { id: 'ab-road', name: 'AB Road Corridor', zone: 'Central', popularFor: 'Shopping Hubs & Transit' },
  { id: 'rau-silicon', name: 'Rau & Silicon City', zone: 'South', popularFor: 'IIM Indore & Quiet Greens' },
  { id: 'kanadia', name: 'Kanadia Road & Bengali Square', zone: 'East', popularFor: 'Family Cafes & Gardens' },
  { id: 'geeta-bhawan', name: 'Geeta Bhawan & Navlakha', zone: 'Central', popularFor: 'Classic Indore Landmarks' }
];

export const INDORE_VIBE_PHRASES = [
  "“Your next date might be just around Vijay Nagar.”",
  "“Chappan Dukan poha-jalebi date?”",
  "“Sarafa midnight food walk?”",
  "“Find someone who loves Indore as much as you do.”",
  "“Late night drive on the Super Corridor?”",
  "“Coffee & conversations near C21 Mall.”",
  "“Evening chai at Meghdoot Garden.”"
];
