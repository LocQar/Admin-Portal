import React, { useState } from 'react';
import {
    Truck, Wrench, Fuel, AlertTriangle, Search, Filter,
    MoreVertical, Calendar, CheckCircle2, AlertCircle,
    ChevronRight, MapPin, Gauge, Upload, Download,
    LayoutGrid, List
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, StatusBadge } from '../components/ui';
import { NewVehicleDrawer } from '../components/drawers';
import { vehiclesData, maintenanceLogsData, fuelLogsData } from '../constants/mockData';

export const FleetPage = ({ addToast }) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewVehicle, setShowNewVehicle] = useState(false);
    const [vehicles, setVehicles] = useState(vehiclesData);
    const [view, setView] = useState('grid');
    const fileInputRef = React.useRef(null);

    // CSV Export
    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) return;
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // CSV Import
    const parseCSV = (csvText) => {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
        return data;
    };

    const handleImport = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvData = parseCSV(e.target?.result);
                const newVehicles = csvData.map((row, index) => ({
                    id: `V${Date.now()}-${index}`,
                    plate: row.Plate || row.plate || '',
                    type: row.Type || row.type || 'van',
                    driver: row.Driver || row.driver || '',
                    status: row.Status || row.status || 'active',
                    health: parseInt(row.Health || row.health || '100'),
                    lastMaintenance: row['Last Maintenance'] || row.lastMaintenance || new Date().toISOString().split('T')[0],
                    nextService: row['Next Service'] || row.nextService || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    location: row.Location || row.location || 'Unknown'
                }));
                setVehicles([...vehicles, ...newVehicles]);
                addToast?.({ type: 'success', message: `Imported ${newVehicles.length} vehicles successfully` });
            } catch (error) {
                addToast?.({ type: 'error', message: 'Failed to import CSV. Please check the file format.' });
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const metrics = {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'active').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length,
        critical: vehicles.filter(v => v.health < 80).length
    };

    const filteredVehicles = vehicles.filter(v =>
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driver.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: theme.text.primary }}>Fleet Management</h1>
                    <p style={{ color: theme.text.muted }}>Monitor vehicle health, maintenance, and fuel costs</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <Upload size={16} /> Import
                    </button>
                    <button onClick={() => {
                        const exportData = filteredVehicles.map(v => ({
                            Plate: v.plate,
                            Type: v.type,
                            Driver: v.driver,
                            Status: v.status,
                            Health: v.health,
                            'Last Maintenance': v.lastMaintenance,
                            'Next Service': v.nextService,
                            Location: v.location || ''
                        }));
                        exportToCSV(exportData, 'fleet_vehicles');
                        addToast?.({ type: 'success', message: `Exported ${exportData.length} vehicles to CSV` });
                    }} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <Download size={16} /> Export
                    </button>
                    <button
                        onClick={() => setShowNewVehicle(true)}
                        className="px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
                    >
                        + Add Vehicle
                    </button>
                </div>
            </div>

            {/* Hidden file input for import */}
            <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImport} style={{ display: 'none' }} />

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Fleet"
                    value={metrics.total}
                    icon={Truck}
                    trend="+2"
                    trendUp={true}
                    theme={theme}
                />
                <MetricCard
                    title="Active Vehicles"
                    value={metrics.active}
                    icon={CheckCircle2}
                    trend="92%"
                    trendUp={true}
                    theme={theme}
                />
                <MetricCard
                    title="In Maintenance"
                    value={metrics.maintenance}
                    icon={Wrench}
                    trend="Requires Action"
                    trendUp={false}
                    theme={theme}
                />
                <MetricCard
                    title="Critical Health"
                    value={metrics.critical}
                    icon={AlertTriangle}
                    trend="Needs Service"
                    trendUp={false}
                    theme={theme}
                />
            </div>

            {/* Main Content */}
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                {/* Tabs */}
                <div className="flex border-b" style={{ borderColor: theme.border.primary }}>
                    {['Overview', 'Maintenance', 'Fuel Logs'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className="px-6 py-3 text-sm font-medium border-b-2 transition-colors"
                            style={{
                                borderColor: activeTab === tab.toLowerCase() ? theme.accent.primary : 'transparent',
                                color: activeTab === tab.toLowerCase() ? theme.accent.primary : theme.text.secondary
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                                    <input
                                        type="text"
                                        placeholder="Search by plate or driver..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border bg-transparent"
                                        style={{ borderColor: theme.border.primary, color: theme.text.primary }}
                                    />
                                </div>
                                <button className="p-2 rounded-xl border hover:bg-white/5" style={{ borderColor: theme.border.primary, color: theme.icon.primary }}>
                                    <Filter size={18} />
                                </button>
                                <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                    {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                                        <button key={v} onClick={() => setView(v)}
                                            className="p-1.5 rounded-lg transition-all"
                                            title={v === 'grid' ? 'Grid view' : 'List view'}
                                            style={{ backgroundColor: view === v ? theme.accent.primary : 'transparent', color: view === v ? theme.accent.contrast : theme.text.muted }}>
                                            <Icon size={16} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid View */}
                            {view === 'grid' && (
                            <div className="grid gap-4">
                                {filteredVehicles.map(vehicle => (
                                    <div
                                        key={vehicle.id}
                                        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                                        style={{ borderColor: theme.border.primary }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.bg.tertiary }}>
                                                <Truck size={20} style={{ color: theme.accent.primary }} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold" style={{ color: theme.text.primary }}>{vehicle.plate}</h3>
                                                <p className="text-sm" style={{ color: theme.text.muted }}>{vehicle.model} • {vehicle.type}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2" style={{ color: theme.text.secondary }}>
                                                <MapPin size={16} />
                                                {vehicle.location}
                                            </div>
                                            <div className="flex items-center gap-2" style={{ color: theme.text.secondary }}>
                                                <Gauge size={16} />
                                                {vehicle.mileage.toLocaleString()} km
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Fuel size={16} style={{ color: vehicle.fuelLevel < 30 ? '#D48E8A' : theme.icon.primary }} />
                                                <span style={{ color: vehicle.fuelLevel < 30 ? '#D48E8A' : theme.text.secondary }}>{vehicle.fuelLevel}%</span>
                                            </div>
                                            <StatusBadge status={vehicle.status} />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs" style={{ color: theme.text.muted }}>Next Service</p>
                                                <p className="font-medium" style={{ color: theme.text.primary }}>{vehicle.nextService}</p>
                                            </div>
                                            <ChevronRight size={18} style={{ color: theme.icon.muted }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )}

                            {/* List View */}
                            {view === 'list' && (
                            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
                                <div className="grid text-xs font-semibold uppercase px-4 py-3"
                                    style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr auto', backgroundColor: theme.bg.tertiary, color: theme.text.muted, borderBottom: `1px solid ${theme.border.primary}` }}>
                                    <span>Plate / Model</span>
                                    <span>Type</span>
                                    <span>Driver</span>
                                    <span>Status</span>
                                    <span>Mileage</span>
                                    <span>Fuel</span>
                                    <span>Next Service</span>
                                </div>
                                {filteredVehicles.map((vehicle, i) => (
                                    <div key={vehicle.id} className="grid items-center px-4 py-3 cursor-pointer group hover:bg-white/5 transition-colors"
                                        style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr auto', backgroundColor: theme.bg.card, borderBottom: i < filteredVehicles.length - 1 ? `1px solid ${theme.border.primary}` : 'none' }}>
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{vehicle.plate}</p>
                                            <p className="text-xs" style={{ color: theme.text.muted }}>{vehicle.model}</p>
                                        </div>
                                        <span className="text-sm capitalize" style={{ color: theme.text.secondary }}>{vehicle.type}</span>
                                        <span className="text-sm" style={{ color: theme.text.secondary }}>{vehicle.driver || '—'}</span>
                                        <StatusBadge status={vehicle.status} />
                                        <div className="flex items-center gap-1.5">
                                            <Gauge size={13} style={{ color: theme.text.muted }} />
                                            <span className="text-sm font-mono" style={{ color: theme.text.secondary }}>{vehicle.mileage.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Fuel size={13} style={{ color: vehicle.fuelLevel < 30 ? '#D48E8A' : theme.text.muted }} />
                                            <span className="text-sm" style={{ color: vehicle.fuelLevel < 30 ? '#D48E8A' : theme.text.secondary }}>{vehicle.fuelLevel}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs" style={{ color: theme.text.muted }}>{vehicle.nextService}</span>
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: theme.text.muted }} />
                                        </div>
                                    </div>
                                ))}
                                {filteredVehicles.length === 0 && (
                                    <p className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No vehicles found</p>
                                )}
                            </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'maintenance' && (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                    <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Vehicle</th>
                                    <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Type</th>
                                    <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Cost</th>
                                    <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Date</th>
                                    <th className="p-3 text-sm font-semibold hidden md:table-cell" style={{ color: theme.text.muted }}>Mechanic</th>
                                    <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenanceLogsData.map(log => (
                                    <tr key={log.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                        <td className="p-3" style={{ color: theme.text.primary }}>{log.vehiclePlate}</td>
                                        <td className="p-3" style={{ color: theme.text.primary }}>{log.type}</td>
                                        <td className="p-3" style={{ color: theme.text.primary }}>GH₵ {log.cost}</td>
                                        <td className="p-3" style={{ color: theme.text.secondary }}>{log.date}</td>
                                        <td className="p-3 hidden md:table-cell" style={{ color: theme.text.secondary }}>{log.mechanic}</td>
                                        <td className="p-3"><StatusBadge status={log.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'fuel logs' && (
                        <div className="space-y-4">
                            {/* Fuel Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>Total Fuel Cost</p>
                                    <p className="text-xl font-bold" style={{ color: theme.text.primary }}>GH₵ {fuelLogsData.reduce((s, f) => s + f.cost, 0).toLocaleString()}</p>
                                </div>
                                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>Total Gallons</p>
                                    <p className="text-xl font-bold" style={{ color: '#7EA8C9' }}>{fuelLogsData.reduce((s, f) => s + f.gallons, 0)}</p>
                                </div>
                                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>Avg Cost/Gallon</p>
                                    <p className="text-xl font-bold" style={{ color: '#D4AA5A' }}>GH₵ {(fuelLogsData.reduce((s, f) => s + f.cost, 0) / fuelLogsData.reduce((s, f) => s + f.gallons, 0)).toFixed(0)}</p>
                                </div>
                                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>Entries</p>
                                    <p className="text-xl font-bold" style={{ color: '#81C995' }}>{fuelLogsData.length}</p>
                                </div>
                            </div>

                            {/* Fuel Logs Table */}
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                        <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Vehicle</th>
                                        <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Date</th>
                                        <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Gallons</th>
                                        <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Cost</th>
                                        <th className="p-3 text-sm font-semibold hidden md:table-cell" style={{ color: theme.text.muted }}>Odometer</th>
                                        <th className="p-3 text-sm font-semibold hidden md:table-cell" style={{ color: theme.text.muted }}>Driver</th>
                                        <th className="p-3 text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text.muted }}>Station</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fuelLogsData.map(log => {
                                        const vehicle = vehicles.find(v => v.id === log.vehicleId);
                                        return (
                                            <tr key={log.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                                <td className="p-3">
                                                    <p className="font-medium" style={{ color: theme.text.primary }}>{vehicle?.plate || log.vehicleId}</p>
                                                    <p className="text-xs" style={{ color: theme.text.muted }}>{vehicle?.model}</p>
                                                </td>
                                                <td className="p-3" style={{ color: theme.text.secondary }}>{log.date}</td>
                                                <td className="p-3">
                                                    <span className="font-medium" style={{ color: '#7EA8C9' }}>{log.gallons} gal</span>
                                                </td>
                                                <td className="p-3">
                                                    <span className="font-medium" style={{ color: theme.accent.primary }}>GH₵ {log.cost}</span>
                                                </td>
                                                <td className="p-3 hidden md:table-cell">
                                                    <span className="text-sm font-mono" style={{ color: theme.text.muted }}>{log.mileage.toLocaleString()} km</span>
                                                </td>
                                                <td className="p-3 hidden md:table-cell" style={{ color: theme.text.secondary }}>{log.driver}</td>
                                                <td className="p-3 hidden lg:table-cell">
                                                    <span className="text-sm" style={{ color: theme.text.muted }}>{log.station}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Per-Vehicle Fuel Breakdown */}
                            <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                                <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.muted }}>Fuel Cost by Vehicle</h4>
                                <div className="space-y-2">
                                    {vehicles.filter(v => v.type !== 'Bike').map(vehicle => {
                                        const vehicleFuel = fuelLogsData.filter(f => f.vehicleId === vehicle.id);
                                        const totalCost = vehicleFuel.reduce((s, f) => s + f.cost, 0);
                                        const totalGallons = vehicleFuel.reduce((s, f) => s + f.gallons, 0);
                                        const maxCost = Math.max(...vehicles.map(v => fuelLogsData.filter(f => f.vehicleId === v.id).reduce((s, f) => s + f.cost, 0)));
                                        return (
                                            <div key={vehicle.id} className="flex items-center gap-3">
                                                <span className="text-sm w-28 shrink-0 truncate" style={{ color: theme.text.primary }}>{vehicle.plate}</span>
                                                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                                    <div className="h-full rounded-full" style={{ width: `${maxCost > 0 ? (totalCost / maxCost) * 100 : 0}%`, backgroundColor: '#D4AA5A' }} />
                                                </div>
                                                <span className="text-sm font-mono w-24 text-right" style={{ color: theme.text.secondary }}>GH₵ {totalCost.toLocaleString()}</span>
                                                <span className="text-xs w-16 text-right" style={{ color: theme.text.muted }}>{totalGallons} gal</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <NewVehicleDrawer isOpen={showNewVehicle} onClose={() => setShowNewVehicle(false)} />
        </div>
    );
};
