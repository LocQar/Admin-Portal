import React, { useState } from 'react';
import {
    Truck, Wrench, Fuel, AlertTriangle, Search, Filter,
    MoreVertical, Calendar, CheckCircle2, AlertCircle,
    ChevronRight, MapPin, Gauge
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, StatusBadge } from '../components/ui';
import { NewVehicleDrawer } from '../components/drawers';
import { vehiclesData, maintenanceLogsData, fuelLogsData } from '../constants/mockData';

export const FleetPage = () => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    const metrics = {
        total: vehiclesData.length,
        active: vehiclesData.filter(v => v.status === 'active').length,
        maintenance: vehiclesData.filter(v => v.status === 'maintenance').length,
        critical: vehiclesData.filter(v => v.health < 80).length
    };

    const filteredVehicles = vehiclesData.filter(v =>
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
                    <button
                        onClick={() => setShowNewVehicle(true)}
                        className="px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
                    >
                        + Add Vehicle
                    </button>
                </div>
            </div>

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
                            </div>

                            {/* Vehicle List */}
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
                                                <Fuel size={16} style={{ color: vehicle.fuelLevel < 30 ? '#ef4444' : theme.icon.primary }} />
                                                <span style={{ color: vehicle.fuelLevel < 30 ? '#ef4444' : theme.text.secondary }}>{vehicle.fuelLevel}%</span>
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
                                    <p className="text-xl font-bold" style={{ color: '#3b82f6' }}>{fuelLogsData.reduce((s, f) => s + f.gallons, 0)}</p>
                                </div>
                                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>Avg Cost/Gallon</p>
                                    <p className="text-xl font-bold" style={{ color: '#f59e0b' }}>GH₵ {(fuelLogsData.reduce((s, f) => s + f.cost, 0) / fuelLogsData.reduce((s, f) => s + f.gallons, 0)).toFixed(0)}</p>
                                </div>
                                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>Entries</p>
                                    <p className="text-xl font-bold" style={{ color: '#10b981' }}>{fuelLogsData.length}</p>
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
                                        const vehicle = vehiclesData.find(v => v.id === log.vehicleId);
                                        return (
                                            <tr key={log.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                                <td className="p-3">
                                                    <p className="font-medium" style={{ color: theme.text.primary }}>{vehicle?.plate || log.vehicleId}</p>
                                                    <p className="text-xs" style={{ color: theme.text.muted }}>{vehicle?.model}</p>
                                                </td>
                                                <td className="p-3" style={{ color: theme.text.secondary }}>{log.date}</td>
                                                <td className="p-3">
                                                    <span className="font-medium" style={{ color: '#3b82f6' }}>{log.gallons} gal</span>
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
                                    {vehiclesData.filter(v => v.type !== 'Bike').map(vehicle => {
                                        const vehicleFuel = fuelLogsData.filter(f => f.vehicleId === vehicle.id);
                                        const totalCost = vehicleFuel.reduce((s, f) => s + f.cost, 0);
                                        const totalGallons = vehicleFuel.reduce((s, f) => s + f.gallons, 0);
                                        const maxCost = Math.max(...vehiclesData.map(v => fuelLogsData.filter(f => f.vehicleId === v.id).reduce((s, f) => s + f.cost, 0)));
                                        return (
                                            <div key={vehicle.id} className="flex items-center gap-3">
                                                <span className="text-sm w-28 shrink-0 truncate" style={{ color: theme.text.primary }}>{vehicle.plate}</span>
                                                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                                    <div className="h-full rounded-full" style={{ width: `${maxCost > 0 ? (totalCost / maxCost) * 100 : 0}%`, backgroundColor: '#f59e0b' }} />
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
