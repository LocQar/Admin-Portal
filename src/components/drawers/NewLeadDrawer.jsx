import React, { useState, useEffect } from 'react';
import { X, Save, User, Building2, Phone, Mail, DollarSign, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CRM_LEAD_STATUSES, CRM_LEAD_SOURCES } from '../../constants/mockDataCRM';

export const NewLeadDrawer = ({ isOpen, onClose, onSave, lead = null }) => {
  const { theme } = useTheme();
  const isEditMode = !!lead;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    status: 'new',
    value: '',
    assignedTo: 'Ama Owusu',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'website',
        status: lead.status || 'new',
        value: lead.value?.toString() || '',
        assignedTo: lead.assignedTo || 'Ama Owusu',
        notes: lead.notes || ''
      });
    } else {
      setForm({
        name: '', email: '', phone: '', company: '',
        source: 'website', status: 'new', value: '',
        assignedTo: 'Ama Owusu', notes: ''
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.company.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const leadData = {
      ...form,
      value: parseInt(form.value) || 0,
    };

    if (isEditMode) {
      // Update existing lead
      onSave?.({ ...lead, ...leadData });
    } else {
      // Create new lead
      onSave?.({
        ...leadData,
        id: `L${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastContactedAt: null
      });
    }

    setForm({
      name: '', email: '', phone: '', company: '',
      source: 'website', status: 'new', value: '',
      assignedTo: 'Ama Owusu', notes: ''
    });
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
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>CRM</p>
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>
            {isEditMode ? 'Edit Lead' : 'Add New Lead'}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }}>
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Contact Information</h3>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <User size={14} className="inline mr-1" />
              Full Name *
            </label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. John Mensah"
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ ...inputStyle, borderColor: errors.name ? theme.status.error : theme.border.primary }}
            />
            {errors.name && <p className="text-xs mt-1" style={{ color: theme.status.error }}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <Mail size={14} className="inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, borderColor: errors.email ? theme.status.error : theme.border.primary }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: theme.status.error }}>{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <Phone size={14} className="inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+233 24 123 4567"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <Building2 size={14} className="inline mr-1" />
              Company *
            </label>
            <input
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Accra Retail Group"
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ ...inputStyle, borderColor: errors.company ? theme.status.error : theme.border.primary }}
            />
            {errors.company && <p className="text-xs mt-1" style={{ color: theme.status.error }}>{errors.company}</p>}
          </div>
        </div>

        {/* Lead Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Lead Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Source</label>
              <select
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, backgroundColor: theme.bg.secondary }}
              >
                {Object.entries(CRM_LEAD_SOURCES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, backgroundColor: theme.bg.secondary }}
              >
                {Object.entries(CRM_LEAD_STATUSES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <DollarSign size={14} className="inline mr-1" />
                Estimated Value (GH₵)
              </label>
              <input
                type="number"
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Assign To</label>
              <select
                value={form.assignedTo}
                onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, backgroundColor: theme.bg.secondary }}
              >
                <option value="Ama Owusu">Ama Owusu</option>
                <option value="Daniel Boateng">Daniel Boateng</option>
                <option value="Kwame Asante">Kwame Asante</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <FileText size={14} className="inline mr-1" />
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Add any additional details about this lead..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none"
              style={inputStyle}
            />
          </div>
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
          Save Lead
        </button>
      </div>
    </div>
  );
};
