import L from "leaflet";

/**
 * Create precise UAV icon with detailed rotor design
 * @returns {L.Icon} Leaflet icon object
 */
export const createPreciseUAVIcon = () => {
  const svgIcon = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="24" cy="42" rx="8" ry="2" fill="black" opacity="0.2"/>
      
      <!-- Main body -->
      <circle cx="24" cy="24" r="6" fill="#2C3E50" stroke="#34495E" stroke-width="0.5"/>
      
      <!-- Center point (exact GPS location) -->
      <circle cx="24" cy="24" r="1.5" fill="#E74C3C" stroke="#C0392B" stroke-width="0.5"/>
      
      <!-- Arms (4 rotors) -->
      <!-- Front arm -->
      <line x1="24" y1="24" x2="24" y2="8" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      <!-- Back arm -->
      <line x1="24" y1="24" x2="24" y2="40" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      <!-- Left arm -->
      <line x1="24" y1="24" x2="8" y2="24" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      <!-- Right arm -->
      <line x1="24" y1="24" x2="40" y2="24" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Rotors -->
      <!-- Front rotor -->
      <circle cx="24" cy="8" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="24" cy="8" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Back rotor -->
      <circle cx="24" cy="40" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="24" cy="40" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Left rotor -->
      <circle cx="8" cy="24" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="8" cy="24" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Right rotor -->
      <circle cx="40" cy="24" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="40" cy="24" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Rotor centers -->
      <circle cx="24" cy="8" r="1" fill="#2C3E50"/>
      <circle cx="24" cy="40" r="1" fill="#2C3E50"/>
      <circle cx="8" cy="24" r="1" fill="#2C3E50"/>
      <circle cx="40" cy="24" r="1" fill="#2C3E50"/>
      
      <!-- Direction indicator (front) -->
      <path d="M 24 8 L 22 4 L 26 4 Z" fill="#E74C3C" stroke="#C0392B" stroke-width="0.5"/>
      
      <!-- Precision crosshair -->
      <line x1="24" y1="20" x2="24" y2="28" stroke="#E74C3C" stroke-width="0.5" opacity="0.5"/>
      <line x1="20" y1="24" x2="28" y2="24" stroke="#E74C3C" stroke-width="0.5" opacity="0.5"/>
    </svg>
  `;

  const iconUrl = "data:image/svg+xml;base64," + btoa(svgIcon);

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
    className: "precise-uav-icon",
  });
};

export const uavIcon = createPreciseUAVIcon();
