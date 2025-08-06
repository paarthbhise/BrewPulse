import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Machine } from '@shared/schema';

interface InteractiveMapProps {
  machines: Machine[];
  onMachineClick?: (machine: Machine) => void;
  height?: string;
}

export function InteractiveMap({ machines, onMachineClick, height = '400px' }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for machines
    machines.forEach(machine => {
      if (!machine.latitude || !machine.longitude || !mapInstanceRef.current) return;

      const lat = parseFloat(machine.latitude);
      const lng = parseFloat(machine.longitude);

      // Create custom icon based on status
      const getMarkerColor = (status: string) => {
        switch (status) {
          case 'online': return '#28a745';
          case 'offline': return '#dc3545';
          case 'maintenance': return '#ffc107';
          default: return '#6c757d';
        }
      };

      const markerHtml = `
        <div style="
          width: 24px;
          height: 24px;
          background-color: ${getMarkerColor(machine.status)};
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: ${machine.status !== 'offline' ? 'pulse 2s infinite' : 'none'};
        "></div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div style="
          background: var(--bg-secondary);
          color: var(--text-primary);
          padding: 12px;
          border-radius: 8px;
          min-width: 200px;
          font-family: Inter, sans-serif;
        ">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
            ${machine.name}
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
            ${machine.location}
          </div>
          <div style="font-size: 12px;">
            <div style="margin-bottom: 2px;">
              Status: <span style="color: ${getMarkerColor(machine.status)}; font-weight: 500;">
                ${machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
              </span>
            </div>
            ${machine.status === 'online' ? `
              <div>Today: ${machine.cupsToday} cups • $${machine.revenueToday}</div>
            ` : machine.status === 'offline' ? `
              <div>Last seen: ${new Date(machine.lastSeen || '').toLocaleTimeString()}</div>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: true,
        autoClose: true,
      });

      marker.on('click', () => {
        if (onMachineClick) {
          onMachineClick(machine);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      // Cleanup markers when component unmounts
      markersRef.current.forEach(marker => marker.remove());
    };
  }, [machines, onMachineClick]);

  useEffect(() => {
    // Cleanup map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-xl overflow-hidden"
      style={{ height }}
      data-testid="interactive-map"
    >
      <div ref={mapRef} className="w-full h-full" />
      
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: var(--bg-secondary) !important;
          border: 1px solid var(--glass-border) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: var(--bg-secondary) !important;
          border: 1px solid var(--glass-border) !important;
          border-top: none !important;
          border-right: none !important;
        }
        
        .custom-popup .leaflet-popup-close-button {
          color: var(--text-primary) !important;
          font-size: 18px !important;
          font-weight: bold !important;
        }
        
        .custom-popup .leaflet-popup-close-button:hover {
          color: var(--accent-primary) !important;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </motion.div>
  );
}
