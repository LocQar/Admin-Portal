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
                        className="px-4 py-2 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: theme.accent.primary }}
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
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
                                    <input
                                        type="text"
                                        placeholder="Search by plate or driver..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border bg-transparent"
                                        style={{ borderColor: theme.border.primary, color: theme.text.primary }}
                                    />
                                </div>
                                <button className="p-2 rounded-xl border hover:bg-white/5" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
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
                                                <Fuel size={16} style={{ color: vehicle.fuelLevel < 30 ? '#ef4444' : theme.text.secondary }} />
                                                <span style={{ color: vehicle.fuelLevel < 30 ? '#ef4444' : theme.text.secondary }}>{vehicle.fuelLevel}%</span>
                                            </div>
                                            <StatusBadge status={vehicle.status} />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs" style={{ color: theme.text.muted }}>Next Service</p>
                                                <p className="font-medium" style={{ color: theme.text.primary }}>{vehicle.nextService}</p>
                                            </div>
                                            <ChevronRight size={18} style={{ color: theme.text.muted }} />
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
                                    <th className="p-3 text-sm font-semibold" style={{ color: theme.text.muted }}>Mechanic</th>
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
                                        <td className="p-3" style={{ color: theme.text.secondary }}>{log.mechanic}</td>
                                        <td className="p-3"><StatusBadge status={log.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <NewVehicleDrawer isOpen={showNewVehicle} onClose={() => setShowNewVehicle(false)} />
        </div>
    );
};
