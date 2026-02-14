import React, { useState } from 'react';
import { X, Check, Truck, Calendar, Save, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const NewVehicleDrawer = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const [form, setForm] = useState({
        plate: '', model: '', type: 'Van', driver: '',
        fuelLevel: 100, mileage: '',
        nextService: '', insuranceExpiry: ''
    });

    const handleSubmit = () => {
        // In a real app, this would submit to API
        // addToast('Vehicle added successfully');
        onClose();
    };

    if (!isOpen) return null;

    const inputStyle = {
        backgroundColor: 'transparent',
        borderColor: theme.border.primary,
        color: theme.text.primary
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
                <div>
                    <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>FLEET MANAGEMENT</p>
                    <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Add New Vehicle</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }}>
                    <X size={20} />
                </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Vehicle Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Vehicle Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>License Plate *</label>
                            <input
                                value={form.plate}
                                onChange={e => setForm({ ...form, plate: e.target.value.toUpperCase() })}
                                placeholder="GR-XXXX-24"
                                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Vehicle Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                                style={{ ...inputStyle, backgroundColor: theme.bg.secondary }}
                            >
                                <option value="Van">Van</option>
                                <option value="Truck">Truck</option>
                                <option value="Bike">Motorbike</option>
                                <option value="Car">Sedan</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Make & Model</label>
                        <input
                            value={form.model}
                            onChange={e => setForm({ ...form, model: e.target.value })}
                            placeholder="e.g. Toyota Hiace"
                            className="w-full px-3 py-2.5 rounded-xl border text-sm"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Initial Mileage (km)</label>
                        <input
                            type="number"
                            value={form.mileage}
                            onChange={e => setForm({ ...form, mileage: e.target.value })}
                            placeholder="0"
                            className="w-full px-3 py-2.5 rounded-xl border text-sm"
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Compliance Dates */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Compliance & Tracking</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Insurance Expiry</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                                <input
                                    type="date"
                                    value={form.insuranceExpiry}
                                    onChange={e => setForm({ ...form, insuranceExpiry: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Next Service Due</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                                <input
                                    type="date"
                                    value={form.nextService}
                                    onChange={e => setForm({ ...form, nextService: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                    <AlertCircle size={20} className="text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-500">
                        Adding a vehicle will automatically add it to the driver assignment pool. Regular maintenance alerts will be sent based on the service date.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t" style={{ borderColor: theme.border.primary }}>
                <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
                >
                    <Save size={18} />
                    Save Vehicle
                </button>
            </div>
        </div>
    );
};
