import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Building2, User, Calendar, FileText, Percent } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CRM_STAGES } from '../../constants/mockDataCRM';

export const NewDealDrawer = ({ isOpen, onClose, onSave, deal = null }) => {
  const { theme } = useTheme();
  const isEditMode = !!deal;

  const [form, setForm] = useState({
    title: '',
    company: '',
    contactName: '',
    value: '',
    stage: 'prospecting',
    probability: 20,
    assignedTo: 'Ama Owusu',
    expectedCloseDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deal) {
      setForm({
        title: deal.title || '',
        company: deal.company || '',
        contactName: deal.contactName || '',
        value: deal.value?.toString() || '',
        stage: deal.stage || 'prospecting',
        probability: deal.probability || 20,
        assignedTo: deal.assignedTo || 'Ama Owusu',
        expectedCloseDate: deal.expectedCloseDate || '',
        notes: deal.notes || ''
      });
    } else {
      setForm({
        title: '', company: '', contactName: '', value: '',
        stage: 'prospecting', probability: 20, assignedTo: 'Ama Owusu',
        expectedCloseDate: '', notes: ''
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Deal title is required';
    }

    if (!form.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!form.value || parseInt(form.value) <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const dealData = {
      ...form,
      value: parseInt(form.value) || 0,
      probability: parseInt(form.probability) || 0,
    };

    if (isEditMode) {
      // Update existing deal
      onSave?.({ ...deal, ...dealData });
    } else {
      // Create new deal
      onSave?.({
        ...dealData,
        id: `D${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }

    setForm({
      title: '', company: '', contactName: '', value: '',
      stage: 'prospecting', probability: 20, assignedTo: 'Ama Owusu',
      expectedCloseDate: '', notes: ''
    });
    onClose();
  };

  // Update probability based on stage
  const handleStageChange = (newStage) => {
    const probabilities = {
      prospecting: 10,
      qualification: 25,
      proposal: 50,
      negotiation: 75,
      closed_won: 100,
      closed_lost: 0
    };
    setForm({ ...form, stage: newStage, probability: probabilities[newStage] || 50 });
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
            {isEditMode ? 'Edit Deal' : 'Add New Deal'}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }}>
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Deal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Deal Information</h3>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              Deal Title *
            </label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Enterprise Logistics Solution"
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ ...inputStyle, borderColor: errors.title ? theme.status.error : theme.border.primary }}
            />
            {errors.title && <p className="text-xs mt-1" style={{ color: theme.status.error }}>{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <Building2 size={14} className="inline mr-1" />
                Company *
              </label>
              <input
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Tema Port Ltd"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, borderColor: errors.company ? theme.status.error : theme.border.primary }}
              />
              {errors.company && <p className="text-xs mt-1" style={{ color: theme.status.error }}>{errors.company}</p>}
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <User size={14} className="inline mr-1" />
                Contact Name
              </label>
              <input
                value={form.contactName}
                onChange={e => setForm({ ...form, contactName: e.target.value })}
                placeholder="e.g. Kofi Mensah"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <DollarSign size={14} className="inline mr-1" />
                Deal Value (GH₵) *
              </label>
              <input
                type="number"
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ ...inputStyle, borderColor: errors.value ? theme.status.error : theme.border.primary }}
              />
              {errors.value && <p className="text-xs mt-1" style={{ color: theme.status.error }}>{errors.value}</p>}
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
                <Calendar size={14} className="inline mr-1" />
                Expected Close
              </label>
              <input
                type="date"
                value={form.expectedCloseDate}
                onChange={e => setForm({ ...form, expectedCloseDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Pipeline Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Pipeline Details</h3>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              Stage
            </label>
            <select
              value={form.stage}
              onChange={e => handleStageChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ ...inputStyle, backgroundColor: theme.bg.secondary }}
            >
              {Object.entries(CRM_STAGES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 flex items-center justify-between" style={{ color: theme.text.secondary }}>
              <span>
                <Percent size={14} className="inline mr-1" />
                Win Probability
              </span>
              <span className="font-bold" style={{ color: theme.accent.primary }}>{form.probability}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.probability}
              onChange={e => setForm({ ...form, probability: e.target.value })}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: theme.text.muted }}>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              Assign To
            </label>
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

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Additional Details</h3>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <FileText size={14} className="inline mr-1" />
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Add any additional details about this deal..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none"
              style={inputStyle}
            />
          </div>
        </div>

        <div
          className="rounded-xl p-3 text-xs border"
          style={{ backgroundColor: `${theme.status.success}12`, borderColor: `${theme.status.success}40`, color: theme.status.success }}
        >
          <strong>Tip:</strong> Keep your deal values and probabilities up-to-date for accurate forecasting.
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
          Save Deal
        </button>
      </div>
    </div>
  );
};
