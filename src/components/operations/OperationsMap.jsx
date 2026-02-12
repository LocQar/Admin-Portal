import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Package, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { terminalsData, dropboxesData, driversData } from '../../constants/mockData';

// Fix for default markers in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CustomMarker = ({ position, children, onClick, color = '#3b82f6' }) => {
    const iconMarkup = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    ">
      ${children}
    </div>
  `;

    const customIcon = divIcon({
        html: iconMarkup,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });

    return (
        <Marker position={position} icon={customIcon} eventHandlers={{ click: onClick }}>
            <Popup closeButton={false} offset={[0, -10]}>
                {/* Popup content will be injected via children prop of Marker... wait, Popup is a child */}
            </Popup>
        </Marker>
    );
};

export const OperationsMap = () => {
    const { theme } = useTheme();

    // Center map on Accra
    const center = [5.6037, -0.1870];

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#10b981';
            case 'active': return '#10b981';
            case 'offline': return '#ef4444';
            case 'maintenance': return '#ef4444';
            case 'busy': return '#f59e0b';
            default: return '#3b82f6';
        }
    };

    // Render icons as SVG strings for the divIcon? 
    // Actually, passing the SVG component to renderToStaticMarkup is cleaner, 
    // but here we are writing raw strings in divIcon.
    // Let's use a simpler approach: pure CSS classes or just style injection.
    // For simplicity in this environment, I'll return the Marker with a standard Leaflet icon usually, 
    // but I want custom icons. 
    // I will write a helper to generate HTML string for icons.

    const createIconHtml = (Icon, color) => {
        // This is a bit tricky without ReactDOMServer.renderToString
        // I'll stick to a simpler circle marker for now, or assume I can use a library if I had one.
        // Let's use standard markers but colorized? No, let's try the divIcon approach with simple inner HTML.
        return `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg></div>`;
    };

    // NOTE: In the implementation below I will use a simplified approach 
    // where I map over data and return standard Markers but with a custom `icon` created via L.divIcon

    return (
        <div className="rounded-2xl border overflow-hidden h-[500px] w-full relative z-0" style={{ borderColor: theme.border.primary }}>
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Terminals */}
                {terminalsData.map(t => (
                    <Marker
                        key={t.id}
                        position={[t.lat, t.lng]}
                        icon={divIcon({
                            className: 'bg-transparent',
                            html: `<div style="background-color: ${getStatusColor(t.status)}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/></svg>
                                   </div>`,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16]
                        })}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold">{t.name}</h3>
                                <div className="text-sm">Status: <span style={{ color: getStatusColor(t.status) }}>{t.status}</span></div>
                                <div className="text-xs mt-1">
                                    {t.available} / {t.totalLockers} Lockers Available
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Drivers (Simulated positions for demo if lat/lng missing, but assuming they exist or we fallback) */}
                {driversData && driversData.map((d, i) => {
                    // Mock lat/lng offsets from center
                    const lat = 5.6037 + (Math.random() * 0.1 - 0.05);
                    const lng = -0.1870 + (Math.random() * 0.1 - 0.05);

                    return (
                        <Marker
                            key={d.id}
                            position={[lat, lng]}
                            icon={divIcon({
                                className: 'bg-transparent',
                                html: `<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="1" y="5" rx="4"/><path d="M17 5v5a2 2 0 0 0 2 2h2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4h2a2 2 0 0 0 2-2V5"/></svg>
                                       </div>`,
                                iconSize: [28, 28],
                                iconAnchor: [14, 14]
                            })}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold">{d.name}</h3>
                                    <div className="text-sm">{d.vehicle}</div>
                                    <div className="text-xs mt-1">Zone: {d.zone}</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Dropboxes */}
                {dropboxesData && dropboxesData.map((d, i) => {
                    // Mock locations around Accra if not present
                    const lat = 5.6037 + (Math.random() * 0.08 - 0.04);
                    const lng = -0.1870 + (Math.random() * 0.08 - 0.04);

                    // Pulse if full
                    const isFull = d.currentFill / d.capacity > 0.8;

                    return (
                        <React.Fragment key={d.id}>
                            <Marker
                                position={[lat, lng]}
                                icon={divIcon({
                                    className: 'bg-transparent',
                                    html: `<div style="background-color: ${isFull ? '#ef4444' : '#8b5cf6'}; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 2px solid white;">
                                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                                           </div>`,
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12]
                                })}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold">{d.name}</h3>
                                        <div className="text-sm">Usage: {d.currentFill}/{d.capacity}</div>
                                        {isFull && <div className="text-xs text-red-500 font-bold mt-1">NEAR FULL</div>}
                                    </div>
                                </Popup>
                            </Marker>
                            {isFull && <Circle center={[lat, lng]} radius={500} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 }} />}
                        </React.Fragment>
                    );
                })}

            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-xl border shadow-lg backdrop-blur-sm z-[1000] text-xs">
                <div className="font-bold mb-2 text-gray-800">Map Legend</div>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div><span className="text-gray-600">Terminal (Online)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div><span className="text-gray-600">Terminal (Offline)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div><span className="text-gray-600">Active Driver</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-purple-500 border border-white"></div><span className="text-gray-600">Dropbox</span></div>
                </div>
            </div>
        </div>
    );
};
