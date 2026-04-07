import React, { useState, useEffect } from 'react';
import { X, Save, User, Building2, Phone, Mail, Briefcase, Tag } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const NewContactDrawer = ({ isOpen, onClose, onSave, contact = null }) => {
  const { theme } = useTheme();
  const isEditMode = !!contact;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setForm({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        role: contact.role || '',
        tags: contact.tags || []
      });
    } else {
      setForm({
        name: '', email: '', phone: '', company: '', role: '', tags: []
      });
    }
    setTagInput('');
    setErrors({});
  }, [contact, isOpen]);

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

    if (isEditMode) {
      // Update existing contact
      onSave?.({ ...contact, ...form });
    } else {
      // Create new contact
      onSave?.({
        ...form,
        id: `C${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastActivity: 'Never',
        totalDeals: 0,
        totalValue: 0
      });
    }

    setForm({
      name: '', email: '', phone: '', company: '', role: '', tags: []
    });
    setTagInput('');
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
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
            {isEditMode ? 'Edit Contact' : 'Add New Contact'}
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
              placeholder="e.g. Sarah Mensah"
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
                placeholder="sarah@example.com"
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
        </div>

        {/* Company Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Company Details</h3>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <Building2 size={14} className="inline mr-1" />
              Company *
            </label>
            <input
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Ghana Logistics Ltd"
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ ...inputStyle, borderColor: errors.company ? theme.status.error : theme.border.primary }}
            />
            {errors.company && <p className="text-xs mt-1" style={{ color: theme.status.error }}>{errors.company}</p>}
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <Briefcase size={14} className="inline mr-1" />
              Role / Title
            </label>
            <input
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Operations Manager"
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase border-b pb-2" style={{ color: theme.text.muted, borderColor: theme.border.primary }}>Organization</h3>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
              <Tag size={14} className="inline mr-1" />
              Tags
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm"
                style={inputStyle}
              />
              <button
                onClick={addTag}
                className="px-4 py-2.5 rounded-xl font-medium text-sm"
                style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:opacity-70">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl p-3 text-xs border" style={{ backgroundColor: `${theme.status.info}12`, borderColor: `${theme.status.info}40`, color: theme.status.info }}>
            <strong>Suggested tags:</strong> Customer, Partner, VIP, Decision Maker, Influencer
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
          Save Contact
        </button>
      </div>
    </div>
  );
};
