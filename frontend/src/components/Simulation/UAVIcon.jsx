import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { TbDrone } from "react-icons/tb";

/**
 * Create UAV icon using react-icons TbDrone
 * @returns {L.Icon} Leaflet icon object
 */
export const createPreciseUAVIcon = () => {
  // Render React icon to SVG string
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        position: "relative",
      }}
    >
      {/* Drone Icon */}
      <TbDrone
        size={42}
        color="#2C3E50"
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      />

      {/* Center point indicator (exact GPS location) */}
      <div
        style={{
          position: "absolute",
          width: "6px",
          height: "6px",
          background: "#E74C3C",
          border: "1px solid #C0392B",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      />
    </div>
  );

  const iconUrl =
    "data:image/svg+xml;base64," +
    btoa(
      `<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="48" height="48">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${iconMarkup}
        </div>
      </foreignObject>
    </svg>`
    );

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [48, 48],
    iconAnchor: [24, 24], // Tepat di tengah icon (48/2 = 24)
    popupAnchor: [0, -24], // Popup muncul di atas icon
  });
};

export const uavIcon = createPreciseUAVIcon();
