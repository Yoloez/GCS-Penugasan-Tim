import React, { useState } from "react";
import { Layers } from "lucide-react";

/**
 * Modern layer selector component for map tile layers
 * @param {Object} props
 * @param {string} props.selectedLayer - Currently selected layer
 * @param {Function} props.onLayerChange - Callback when layer changes
 */
const LayerSelector = ({ selectedLayer, onLayerChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const layers = [
    {
      id: "google-satellite",
      name: "Google Satellite",
      description: "High-resolution satellite imagery",
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      maxZoom: 22,
      thumbnail: "🛰️",
    },
    {
      id: "google-hybrid",
      name: "Google Hybrid",
      description: "Satellite with labels",
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      maxZoom: 22,
      thumbnail: "🗺️",
    },
    {
      id: "esri-satellite",
      name: "ESRI Satellite",
      description: "ESRI world imagery",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      maxZoom: 19,
      thumbnail: "🌍",
    },
    {
      id: "street-map",
      name: "Street Map",
      description: "OpenStreetMap roads",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      maxZoom: 19,
      thumbnail: "🛣️",
    },
  ];

  const currentLayer = layers.find((l) => l.id === selectedLayer) || layers[0];

  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-1000">
      {/* Current Layer Display */}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-white/95 hover:bg-white px-4 py-2.5 rounded-lg shadow-lg transition-all duration-200 border border-gray-200 flex items-center gap-3 min-w-[200px]" title="Change map layer">
        <Layers className="w-5 h-5 text-gray-600" />
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-gray-800">{currentLayer.name}</div>
          <div className="text-xs text-gray-500">{currentLayer.description}</div>
        </div>
        <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Layer Options Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => {
                onLayerChange(layer);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${layer.id === selectedLayer ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{layer.thumbnail}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    {layer.name}
                    {layer.id === selectedLayer && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Active</span>}
                  </div>
                  <div className="text-xs text-gray-500">{layer.description}</div>
                  <div className="text-xs text-gray-400 mt-1">Max Zoom: {layer.maxZoom}x</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default LayerSelector;
