import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Plus, Download, Filter, Eye, Edit, Trash2, Phone, Mail, MapPin,
  DollarSign, TrendingUp, Users, Target, Calendar, Clock, CheckCircle,
  AlertTriangle, MessageSquare, FileText, ArrowRight, Building2, Tag,
  BarChart3, X, ChevronDown, ChevronUp, Briefcase, Star, ExternalLink,
  UserPlus, RefreshCw, Upload
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, StatusBadge, TableSkeleton, Pagination, EmptyState, ConfirmDialog } from '../components/ui';
import { NewLeadDrawer, NewContactDrawer, NewDealDrawer, NewActivityDrawer } from '../components/drawers';
import { hasPermission } from '../constants';
import {
  crmLeads, crmDeals, crmContacts, crmActivities,
  CRM_LEAD_STATUSES, CRM_STAGES, CRM_ACTIVITY_TYPES, CRM_LEAD_SOURCES,
  pipelineChartData, crmMonthlyData, activityBreakdownData
} from '../constants/mockDataCRM';

const CHART_COLORS = ['#8B5CF6', '#3B82F6', '#F59E0B', '#F97316', '#10B981', '#EF4444'];

// ============ EXPORT UTILITY ============
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const CRMPage = ({
  activeSubMenu, currentUser, loading, setShowExport, addToast,
}) => {
  const { theme } = useTheme();
  const currentView = activeSubMenu || 'Dashboard';

  // File input refs for CSV import
  const leadFileInputRef = React.useRef(null);
  const dealFileInputRef = React.useRef(null);
  const contactFileInputRef = React.useRef(null);
  const activityFileInputRef = React.useRef(null);

  // ============ LEADS STATE ============
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [leadPage, setLeadPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);

  // ============ DEALS STATE ============
  const [dealSearch, setDealSearch] = useState('');
  const [dealView, setDealView] = useState('kanban');

  // ============ CONTACTS STATE ============
  const [contactSearch, setContactSearch] = useState('');
  const [contactTagFilter, setContactTagFilter] = useState('all');
  const [contactPage, setContactPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);

  // ============ ACTIVITIES STATE ============
  const [activitySearch, setActivitySearch] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [activityStatusFilter, setActivityStatusFilter] = useState('all');
  const [activityPage, setActivityPage] = useState(1);

  // ============ DRAWER STATE ============
  const [showNewLeadDrawer, setShowNewLeadDrawer] = useState(false);
  const [showNewContactDrawer, setShowNewContactDrawer] = useState(false);
  const [showNewDealDrawer, setShowNewDealDrawer] = useState(false);
  const [showNewActivityDrawer, setShowNewActivityDrawer] = useState(false);

  // ============ EDIT/DELETE STATE ============
  const [editingLead, setEditingLead] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, item: null });

  // ============ DRAG-AND-DROP STATE ============
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // ============ BULK SELECTION STATE ============
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  // ============ DATA STATE ============
  // Load from localStorage or use mock data as fallback
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : crmLeads;
  });
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('crm_deals');
    return saved ? JSON.parse(saved) : crmDeals;
  });
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('crm_contacts');
    return saved ? JSON.parse(saved) : crmContacts;
  });
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('crm_activities');
    return saved ? JSON.parse(saved) : crmActivities;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('crm_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('crm_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('crm_activities', JSON.stringify(activities));
  }, [activities]);

  // Reset to demo data
  const resetToDemo = () => {
    setLeads(crmLeads);
    setDeals(crmDeals);
    setContacts(crmContacts);
    setActivities(crmActivities);
    addToast({ type: 'success', message: 'CRM data reset to demo data' });
  };

  const itemsPerPage = 10;

  // ============ HANDLERS ============
  const handleSaveLead = (leadData) => {
    if (leadData.id && leads.find(l => l.id === leadData.id)) {
      // Update existing lead
      setLeads(leads.map(l => l.id === leadData.id ? leadData : l));
      addToast({ type: 'success', message: `Lead "${leadData.name}" updated successfully` });
    } else {
      // Add new lead
      setLeads([leadData, ...leads]);
      addToast({ type: 'success', message: `Lead "${leadData.name}" added successfully` });
    }
  };

  const handleSaveContact = (contactData) => {
    if (contactData.id && contacts.find(c => c.id === contactData.id)) {
      // Update existing contact
      setContacts(contacts.map(c => c.id === contactData.id ? contactData : c));
      addToast({ type: 'success', message: `Contact "${contactData.name}" updated successfully` });
    } else {
      // Add new contact
      setContacts([contactData, ...contacts]);
      addToast({ type: 'success', message: `Contact "${contactData.name}" added successfully` });
    }
  };

  const handleSaveDeal = (dealData) => {
    if (dealData.id && deals.find(d => d.id === dealData.id)) {
      // Update existing deal
      setDeals(deals.map(d => d.id === dealData.id ? dealData : d));
      addToast({ type: 'success', message: `Deal "${dealData.title}" updated successfully` });
    } else {
      // Add new deal
      setDeals([dealData, ...deals]);
      addToast({ type: 'success', message: `Deal "${dealData.title}" added successfully` });
    }
  };

  const handleSaveActivity = (activityData) => {
    if (activityData.id && activities.find(a => a.id === activityData.id)) {
      // Update existing activity
      setActivities(activities.map(a => a.id === activityData.id ? activityData : a));
      addToast({ type: 'success', message: `Activity "${activityData.subject}" updated successfully` });
    } else {
      // Add new activity
      setActivities([activityData, ...activities]);
      addToast({ type: 'success', message: `Activity "${activityData.subject}" scheduled` });
    }
  };

  const handleDeleteLead = (lead) => {
    setLeads(leads.filter(l => l.id !== lead.id));
    addToast({ type: 'success', message: `Lead "${lead.name}" deleted` });
  };

  const handleDeleteContact = (contact) => {
    setContacts(contacts.filter(c => c.id !== contact.id));
    addToast({ type: 'success', message: `Contact "${contact.name}" deleted` });
  };

  const handleDeleteDeal = (deal) => {
    setDeals(deals.filter(d => d.id !== deal.id));
    addToast({ type: 'success', message: `Deal "${deal.title}" deleted` });
  };

  const handleDeleteActivity = (activity) => {
    setActivities(activities.filter(a => a.id !== activity.id));
    addToast({ type: 'success', message: `Activity deleted` });
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowNewLeadDrawer(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowNewContactDrawer(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowNewDealDrawer(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowNewActivityDrawer(true);
  };

  const handleConvertLeadToDeal = (lead) => {
    // Create a new deal pre-filled with lead data
    const newDeal = {
      title: `${lead.company} Deal`,
      company: lead.company,
      contactName: lead.name,
      value: lead.value || 0,
      stage: 'prospecting',
      probability: 10,
      assignedTo: lead.assignedTo,
      expectedCloseDate: '',
      notes: lead.notes || ''
    };

    // Open deal drawer with pre-filled data
    setEditingDeal(newDeal);
    setShowNewDealDrawer(true);

    // Remove the lead from leads list
    setLeads(leads.filter(l => l.id !== lead.id));

    // Close lead detail panel
    setSelectedLead(null);

    // Switch to Pipeline view
    setActiveSubMenu('Pipeline');

    addToast({ type: 'success', message: `Converting "${lead.name}" to deal. Complete the details to save.` });
  };

  const openDeleteConfirm = (type, item) => {
    setDeleteConfirm({ isOpen: true, type, item });
  };

  const handleConfirmDelete = () => {
    const { type, item } = deleteConfirm;
    if (type === 'lead') handleDeleteLead(item);
    else if (type === 'contact') handleDeleteContact(item);
    else if (type === 'deal') handleDeleteDeal(item);
    else if (type === 'activity') handleDeleteActivity(item);
    setDeleteConfirm({ isOpen: false, type: null, item: null });
  };

  // ============ BULK SELECTION HANDLERS ============
  const toggleSelectAll = (type) => {
    if (type === 'lead') {
      if (selectedLeads.length === filteredLeads.length) {
        setSelectedLeads([]);
      } else {
        setSelectedLeads(filteredLeads.map(l => l.id));
      }
    } else if (type === 'contact') {
      if (selectedContacts.length === filteredContacts.length) {
        setSelectedContacts([]);
      } else {
        setSelectedContacts(filteredContacts.map(c => c.id));
      }
    } else if (type === 'activity') {
      if (selectedActivities.length === filteredActivities.length) {
        setSelectedActivities([]);
      } else {
        setSelectedActivities(filteredActivities.map(a => a.id));
      }
    }
  };

  const toggleSelect = (type, id) => {
    if (type === 'lead') {
      setSelectedLeads(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else if (type === 'contact') {
      setSelectedContacts(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else if (type === 'activity') {
      setSelectedActivities(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  };

  const handleBulkDelete = (type) => {
    let count = 0;
    if (type === 'lead') {
      count = selectedLeads.length;
      setLeads(leads.filter(l => !selectedLeads.includes(l.id)));
      setSelectedLeads([]);
    } else if (type === 'contact') {
      count = selectedContacts.length;
      setContacts(contacts.filter(c => !selectedContacts.includes(c.id)));
      setSelectedContacts([]);
    } else if (type === 'activity') {
      count = selectedActivities.length;
      setActivities(activities.filter(a => !selectedActivities.includes(a.id)));
      setSelectedActivities([]);
    }
    addToast({ type: 'success', message: `Deleted ${count} ${type}${count > 1 ? 's' : ''}` });
  };

  // ============ CSV IMPORT HANDLERS ============
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

  const handleImportLeads = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = parseCSV(e.target?.result);
        const newLeads = csvData.map((row, index) => ({
          id: `L${Date.now()}-${index}`,
          name: row.Name || row.name || '',
          email: row.Email || row.email || '',
          phone: row.Phone || row.phone || '',
          company: row.Company || row.company || '',
          source: row.Source?.toLowerCase() || 'website',
          status: row.Status?.toLowerCase() || 'new',
          value: parseInt(row.Value || row.value || '0'),
          assignedTo: row['Assigned To'] || row.assignedTo || 'Ama Owusu',
          notes: row.Notes || row.notes || '',
          createdAt: new Date().toISOString().split('T')[0],
          lastContactedAt: null
        }));

        setLeads([...newLeads, ...leads]);
        addToast({ type: 'success', message: `Imported ${newLeads.length} leads successfully` });
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to import CSV. Please check the file format.' });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImportDeals = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = parseCSV(e.target?.result);
        const newDeals = csvData.map((row, index) => ({
          id: `D${Date.now()}-${index}`,
          title: row.Title || row.title || '',
          company: row.Company || row.company || '',
          contactName: row['Contact Name'] || row.contactName || '',
          value: parseInt(row.Value || row.value || '0'),
          stage: row.Stage?.toLowerCase().replace(/\s+/g, '_') || 'prospecting',
          probability: parseInt(row.Probability || row.probability || '10'),
          assignedTo: row['Assigned To'] || row.assignedTo || 'Ama Owusu',
          expectedCloseDate: row['Expected Close Date'] || row.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date().toISOString().split('T')[0],
          notes: row.Notes || row.notes || ''
        }));

        setDeals([...newDeals, ...deals]);
        addToast({ type: 'success', message: `Imported ${newDeals.length} deals successfully` });
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to import CSV. Please check the file format.' });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImportContacts = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = parseCSV(e.target?.result);
        const newContacts = csvData.map((row, index) => ({
          id: `C${Date.now()}-${index}`,
          name: row.Name || row.name || '',
          email: row.Email || row.email || '',
          phone: row.Phone || row.phone || '',
          company: row.Company || row.company || '',
          role: row.Role || row.role || '',
          tags: (row.Tags || row.tags || '').split(';').map(t => t.trim()).filter(Boolean),
          createdAt: new Date().toISOString().split('T')[0],
          lastActivity: 'Never',
          totalDeals: 0,
          totalValue: 0
        }));

        setContacts([...newContacts, ...contacts]);
        addToast({ type: 'success', message: `Imported ${newContacts.length} contacts successfully` });
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to import CSV. Please check the file format.' });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImportActivities = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = parseCSV(e.target?.result);
        const newActivities = csvData.map((row, index) => ({
          id: `A${Date.now()}-${index}`,
          type: row.Type?.toLowerCase() || 'call',
          subject: row.Subject || row.subject || '',
          description: row.Description || row.description || '',
          contactName: row.Contact || row.contactName || '',
          dealTitle: row.Deal || row.dealTitle || '',
          assignedTo: row['Assigned To'] || row.assignedTo || 'Ama Owusu',
          status: row.Status?.toLowerCase() || 'scheduled',
          dueDate: row.Date || row.dueDate || '',
          dueTime: '',
          createdAt: new Date().toISOString().split('T')[0]
        }));

        setActivities([...newActivities, ...activities]);
        addToast({ type: 'success', message: `Imported ${newActivities.length} activities successfully` });
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to import CSV. Please check the file format.' });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // ============ DRAG-AND-DROP HANDLERS ============
  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e, stageKey) => {
    e.preventDefault();
    setDragOverStage(stageKey);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e, newStage) => {
    e.preventDefault();

    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null);
      setDragOverStage(null);
      return;
    }

    // Update deal stage and probability
    const probabilities = {
      prospecting: 10,
      qualification: 25,
      proposal: 50,
      negotiation: 75,
      closed_won: 100,
      closed_lost: 0
    };

    const updatedDeal = {
      ...draggedDeal,
      stage: newStage,
      probability: probabilities[newStage] || 50
    };

    setDeals(deals.map(d => d.id === draggedDeal.id ? updatedDeal : d));
    addToast({ type: 'success', message: `"${draggedDeal.title}" moved to ${CRM_STAGES[newStage].label}` });

    setDraggedDeal(null);
    setDragOverStage(null);
  };

  // ============ COMPUTED DATA ============
  const filteredLeads = useMemo(() => {
    let result = [...leads];
    if (leadSearch) {
      const q = leadSearch.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q));
    }
    if (leadStatusFilter !== 'all') result = result.filter(l => l.status === leadStatusFilter);
    if (leadSourceFilter !== 'all') result = result.filter(l => l.source === leadSourceFilter);
    return result;
  }, [leads, leadSearch, leadStatusFilter, leadSourceFilter]);

  const paginatedLeads = useMemo(() => {
    const start = (leadPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, leadPage]);

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    if (contactSearch) {
      const q = contactSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    if (contactTagFilter !== 'all') result = result.filter(c => c.tags.includes(contactTagFilter));
    return result;
  }, [contacts, contactSearch, contactTagFilter]);

  const paginatedContacts = useMemo(() => {
    const start = (contactPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, contactPage]);

  const filteredActivities = useMemo(() => {
    let result = [...activities];
    if (activitySearch) {
      const q = activitySearch.toLowerCase();
      result = result.filter(a => a.subject.toLowerCase().includes(q) || (a.contactName || '').toLowerCase().includes(q));
    }
    if (activityTypeFilter !== 'all') result = result.filter(a => a.type === activityTypeFilter);
    if (activityStatusFilter !== 'all') result = result.filter(a => a.status === activityStatusFilter);
    return result;
  }, [activities, activitySearch, activityTypeFilter, activityStatusFilter]);

  const paginatedActivities = useMemo(() => {
    const start = (activityPage - 1) * itemsPerPage;
    return filteredActivities.slice(start, start + itemsPerPage);
  }, [filteredActivities, activityPage]);

  const dealsByStage = useMemo(() => {
    const stages = {};
    Object.keys(CRM_STAGES).forEach(key => { stages[key] = []; });
    deals.forEach(deal => {
      if (dealSearch) {
        const q = dealSearch.toLowerCase();
        if (!deal.title.toLowerCase().includes(q) && !deal.company.toLowerCase().includes(q)) return;
      }
      if (stages[deal.stage]) stages[deal.stage].push(deal);
    });
    return stages;
  }, [deals, dealSearch]);

  const crmMetrics = useMemo(() => {
    const activeDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
    const wonDeals = deals.filter(d => d.stage === 'closed_won');
    const totalClosed = deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length;
    return {
      totalLeads: leads.length,
      activeDeals: activeDeals.length,
      pipelineValue: activeDeals.reduce((sum, d) => sum + d.value, 0),
      wonValue: wonDeals.reduce((sum, d) => sum + d.value, 0),
      conversionRate: totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0,
    };
  }, [leads, deals]);

  const allTags = useMemo(() => {
    const tags = new Set();
    contacts.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [contacts]);

  // ============ SHARED STYLES ============
  const cardStyle = {
    backgroundColor: 'transparent',
    borderColor: theme.border.primary
  };
  const inputStyle = {
    backgroundColor: theme.bg.input,
    borderColor: theme.border.primary,
    color: theme.text.primary
  };
  const textPrimaryStyle = { color: theme.text.primary };
  const textSecondaryStyle = { color: theme.text.secondary };
  const textMutedStyle = { color: theme.text.secondary }; // Changed from theme.text.secondary for better contrast

  const selectClasses = "px-3 py-2 rounded-lg border text-sm font-medium";
  const btnOutline = "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors";
  const btnPrimary = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors";

  // ============ RENDER HELPERS ============
  const renderStatusDot = (color) => (
    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
  );

  // ============ DASHBOARD VIEW ============
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={resetToDemo} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
          <RefreshCw size={16} /> Reset to Demo Data
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard title="Total Leads" value={crmMetrics.totalLeads} change="24%" changeType="up" icon={Target} loading={loading} />
        <MetricCard title="Active Deals" value={crmMetrics.activeDeals} change="8%" changeType="up" icon={Briefcase} loading={loading} />
        <MetricCard title="Pipeline Value" value={`GH₵ ${(crmMetrics.pipelineValue / 1000).toFixed(0)}K`} change="15%" changeType="up" icon={DollarSign} loading={loading} />
        <MetricCard title="Won Deals" value={`GH₵ ${(crmMetrics.wonValue / 1000).toFixed(0)}K`} change="32%" changeType="up" icon={TrendingUp} loading={loading} />
        <MetricCard title="Win Rate" value={`${crmMetrics.conversionRate}%`} icon={BarChart3} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline by Stage */}
        <div className="lg:col-span-2 p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Pipeline by Stage</h3>
          {loading ? <TableSkeleton rows={3} cols={1} theme={theme} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} tickFormatter={v => `${v / 1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={(v) => [`GH₵ ${v.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity Breakdown */}
        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Activity Breakdown</h3>
          {loading ? <TableSkeleton rows={3} cols={1} theme={theme} /> : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={activityBreakdownData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {activityBreakdownData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {activityBreakdownData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm" style={{ color: theme.text.secondary }}>
                      {renderStatusDot(CHART_COLORS[i % CHART_COLORS.length])}
                      {item.name}
                    </span>
                    <span className="font-medium text-sm" style={{ color: theme.text.primary }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deals Won/Lost Over Time + Top Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Deals Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={crmMonthlyData}>
              <defs>
                <linearGradient id="gradWon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
              <Area type="monotone" dataKey="won" stroke="#10B981" fill="url(#gradWon)" strokeWidth={2} name="Won" />
              <Area type="monotone" dataKey="lost" stroke="#EF4444" fill="transparent" strokeWidth={2} name="Lost" />
              <Area type="monotone" dataKey="new" stroke="#3B82F6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="New Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Top Deals</h3>
          <div className="space-y-3">
            {deals
              .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map(deal => (
                <div key={deal.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate" style={{ color: theme.text.primary }}>{deal.title}</p>
                    <p className="text-xs" style={{ color: theme.text.secondary }}>{deal.company}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-bold text-sm" style={{ color: theme.accent.primary }}>GH₵ {deal.value.toLocaleString()}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${CRM_STAGES[deal.stage].color}20`, color: CRM_STAGES[deal.stage].color }}>{CRM_STAGES[deal.stage].label}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="p-5 rounded-2xl border" style={cardStyle}>
        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Recent Activities</h3>
        <div className="space-y-3">
          {activities.slice(0, 6).map(act => (
            <div key={act.id} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${CRM_ACTIVITY_TYPES[act.type].color}20` }}>
                {act.type === 'call' && <Phone size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'email' && <Mail size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'meeting' && <Users size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'task' && <CheckCircle size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                {act.type === 'note' && <FileText size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: theme.text.primary }}>{act.subject}</p>
                <p className="text-xs" style={{ color: theme.text.secondary }}>{act.contactName ? `${act.contactName} · ` : ''}{act.dueDate}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{
                backgroundColor: act.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : act.status === 'overdue' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: act.status === 'completed' ? '#10B981' : act.status === 'overdue' ? '#EF4444' : '#3B82F6',
              }}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============ LEADS VIEW ============
  const renderLeads = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(CRM_LEAD_STATUSES).map(([key, s]) => {
          const count = leads.filter(l => l.status === key).length;
          return (
            <div key={key} className="p-4 rounded-xl border flex items-center gap-3" style={cardStyle}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <span className="text-lg font-bold" style={{ color: s.color }}>{count}</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.label}</p>
                <p className="text-xs" style={{ color: theme.text.secondary }}>leads</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input
            type="text" placeholder="Search leads..." value={leadSearch} onChange={e => { setLeadSearch(e.target.value); setLeadPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle}
          />
        </div>
        <select value={leadStatusFilter} onChange={e => { setLeadStatusFilter(e.target.value); setLeadPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Statuses</option>
          {Object.entries(CRM_LEAD_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={leadSourceFilter} onChange={e => { setLeadSourceFilter(e.target.value); setLeadPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Sources</option>
          {Object.entries(CRM_LEAD_SOURCES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {hasPermission(currentUser?.role, 'crm.leads.manage') && (
          <button onClick={() => setShowNewLeadDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
            <Plus size={16} /> Add Lead
          </button>
        )}
        {hasPermission(currentUser?.role, 'crm.import') && (
          <button onClick={() => leadFileInputRef.current?.click()} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.primary }}>
            <Upload size={16} /> Import
          </button>
        )}
        {hasPermission(currentUser?.role, 'crm.export') && (
          <button
            onClick={() => {
              const exportData = filteredLeads.map(lead => ({
                Name: lead.name,
                Company: lead.company,
                Email: lead.email,
                Phone: lead.phone,
                Status: CRM_LEAD_STATUSES[lead.status]?.label || lead.status,
                Source: CRM_LEAD_SOURCES[lead.source]?.label || lead.source,
                Value: `$${lead.value?.toLocaleString() || 0}`,
                'Last Contact': lead.lastContact,
                Owner: lead.owner
              }));
              exportToCSV(exportData, 'crm_leads');
              addToast({ type: 'success', message: `Exported ${exportData.length} leads to CSV` });
            }}
            className={btnOutline}
            style={{ borderColor: theme.border.primary, color: theme.text.primary }}
          >
            <Download size={16} /> Export
          </button>
        )}
      </div>

      {/* Hidden file input for lead import */}
      <input type="file" ref={leadFileInputRef} accept=".csv" onChange={handleImportLeads} style={{ display: 'none' }} />

      {selectedLeads.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.accent.primary }}>
          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
          </span>
          <button onClick={() => handleBulkDelete('lead')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: theme.status.error, color: 'white' }}>
            <Trash2 size={14} /> Delete Selected
          </button>
          <button onClick={() => setSelectedLeads([])} className="text-sm" style={{ color: theme.text.secondary }}>
            Clear Selection
          </button>
        </div>
      )}

      {loading ? <TableSkeleton rows={5} cols={6} theme={theme} /> : filteredLeads.length === 0 ? (
        <EmptyState icon={Target} title="No leads found" description="Try adjusting your filters" theme={theme} />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.bg.tertiary }}>
                    <th className="px-4 py-3">
                      <input type="checkbox" checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} onChange={() => toggleSelectAll('lead')} className="cursor-pointer" />
                    </th>
                    {['Name', 'Company', 'Source', 'Status', 'Value', 'Assigned To', 'Last Contact', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map(lead => (
                    <tr key={lead.id} className="border-t" style={{ borderColor: theme.border.primary }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={() => toggleSelect('lead', lead.id)} className="cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{lead.name}</p>
                        <p className="text-sm" style={{ color: theme.text.secondary }}>{lead.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{lead.company}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${CRM_LEAD_SOURCES[lead.source]?.color}20`, color: CRM_LEAD_SOURCES[lead.source]?.color }}>
                          {CRM_LEAD_SOURCES[lead.source]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: `${CRM_LEAD_STATUSES[lead.status].color}20`, color: CRM_LEAD_STATUSES[lead.status].color }}>
                          {CRM_LEAD_STATUSES[lead.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>
                        {lead.value > 0 ? `GH₵ ${lead.value.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{lead.assignedTo}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{lead.lastContactedAt || 'Not yet'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)} className="p-2 rounded-lg transition-colors" style={{ color: theme.text.secondary }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleEditLead(lead)} className="p-2 rounded-lg transition-colors" style={{ color: theme.text.secondary }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => openDeleteConfirm('lead', lead)} className="p-2 rounded-lg transition-colors" style={{ color: theme.status.error }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={leadPage} totalPages={Math.ceil(filteredLeads.length / itemsPerPage)} onPageChange={setLeadPage} />
        </>
      )}

      {/* Lead Detail Panel */}
      {selectedLead && (
        <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>{selectedLead.name}</h3>
              <p className="text-sm" style={{ color: theme.text.secondary }}>{selectedLead.company} · {selectedLead.id}</p>
            </div>
            <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg" style={{ color: theme.text.secondary }}>
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p style={{ color: theme.text.secondary }}>Email</p><p style={{ color: theme.text.primary }}>{selectedLead.email}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Phone</p><p style={{ color: theme.text.primary }}>{selectedLead.phone}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Source</p><p style={{ color: theme.text.primary }}>{CRM_LEAD_SOURCES[selectedLead.source]?.label}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Value</p><p className="font-semibold" style={{ color: theme.accent.primary }}>{selectedLead.value > 0 ? `GH₵ ${selectedLead.value.toLocaleString()}` : '—'}</p></div>
          </div>
          <div><p className="text-sm" style={{ color: theme.text.secondary }}>Notes</p><p className="text-sm" style={{ color: theme.text.secondary }}>{selectedLead.notes}</p></div>
          <div className="flex gap-2">
            <button onClick={() => handleConvertLeadToDeal(selectedLead)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white" style={{ backgroundColor: theme.accent.primary }}>
              <ArrowRight size={16} /> Convert to Deal
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ============ PIPELINE VIEW ============
  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input type="text" placeholder="Search deals..." value={dealSearch} onChange={e => setDealSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <div className="flex gap-2">
          {hasPermission(currentUser?.role, 'crm.deals.manage') && (
            <button onClick={() => setShowNewDealDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
              <Plus size={16} /> Add Deal
            </button>
          )}
          {hasPermission(currentUser?.role, 'crm.import') && (
            <button onClick={() => dealFileInputRef.current?.click()} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.primary }}>
              <Upload size={16} /> Import
            </button>
          )}
          {hasPermission(currentUser?.role, 'crm.export') && (
            <button
              onClick={() => {
                const exportData = deals.map(deal => ({
                  Title: deal.title,
                  Company: deal.company,
                  'Contact Name': deal.contactName,
                  Value: deal.value,
                  Stage: CRM_STAGES[deal.stage]?.label || deal.stage,
                  Probability: deal.probability,
                  'Assigned To': deal.assignedTo,
                  'Expected Close Date': deal.expectedCloseDate,
                  Notes: deal.notes || ''
                }));
                exportToCSV(exportData, 'crm_deals');
                addToast({ type: 'success', message: `Exported ${exportData.length} deals to CSV` });
              }}
              className={btnOutline}
              style={{ borderColor: theme.border.primary, color: theme.text.primary }}
            >
              <Download size={16} /> Export
            </button>
          )}
          <button onClick={() => setDealView('kanban')} className={`px-3 py-1.5 rounded-lg text-sm ${dealView === 'kanban' ? 'font-medium' : ''}`}
            style={{ backgroundColor: dealView === 'kanban' ? theme.accent.light : 'transparent', color: dealView === 'kanban' ? theme.accent.primary : theme.text.secondary }}>
            Board
          </button>
          <button onClick={() => setDealView('list')} className={`px-3 py-1.5 rounded-lg text-sm ${dealView === 'list' ? 'font-medium' : ''}`}
            style={{ backgroundColor: dealView === 'list' ? theme.accent.light : 'transparent', color: dealView === 'list' ? theme.accent.primary : theme.text.secondary }}>
            List
          </button>
        </div>

        {/* Hidden file input for deal import */}
        <input type="file" ref={dealFileInputRef} accept=".csv" onChange={handleImportDeals} style={{ display: 'none' }} />
      </div>

      {dealView === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
          {Object.entries(CRM_STAGES).map(([stageKey, stage]) => {
            const deals = dealsByStage[stageKey] || [];
            const stageValue = deals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stageKey} className="flex-shrink-0 w-72 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    {renderStatusDot(stage.color)}
                    <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>{stage.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{deals.length}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: theme.text.secondary }}>GH₵ {(stageValue / 1000).toFixed(0)}K</span>
                </div>
                <div
                  className="flex-1 space-y-2 p-2 rounded-xl transition-all"
                  style={{
                    backgroundColor: dragOverStage === stageKey ? `${stage.color}10` : 'transparent',
                    border: dragOverStage === stageKey ? `2px dashed ${stage.color}` : '2px solid transparent'
                  }}
                  onDragOver={(e) => handleDragOver(e, stageKey)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stageKey)}
                >
                  {deals.length === 0 ? (
                    <p className="text-xs text-center py-8" style={{ color: theme.text.secondary }}>
                      {dragOverStage === stageKey ? 'Drop here' : 'No deals'}
                    </p>
                  ) : deals.map(deal => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal)}
                      onDragEnd={() => setDraggedDeal(null)}
                      className="p-3 rounded-xl border cursor-move transition-all duration-150"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: theme.border.primary,
                        opacity: draggedDeal?.id === deal.id ? 0.5 : 1
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = stage.color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border.primary; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <p className="font-medium text-sm mb-1 truncate" style={{ color: theme.text.primary }}>{deal.title}</p>
                      <p className="text-xs mb-2" style={{ color: theme.text.secondary }}>{deal.company}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: stage.color }}>GH₵ {deal.value.toLocaleString()}</span>
                        <span className="text-xs" style={{ color: theme.text.secondary }}>{deal.probability}%</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5" style={{ backgroundColor: theme.bg.tertiary }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${deal.probability}%`, backgroundColor: stage.color }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: theme.text.secondary }}>{deal.assignedTo}</span>
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleEditDeal(deal); }} className="p-1 rounded transition-colors" style={{ color: theme.text.secondary }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Edit size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openDeleteConfirm('deal', deal); }} className="p-1 rounded transition-colors" style={{ color: theme.status.error }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.bg.tertiary }}>
                  {['Deal', 'Company', 'Stage', 'Value', 'Probability', 'Assigned To', 'Close Date', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.filter(d => {
                  if (!dealSearch) return true;
                  const q = dealSearch.toLowerCase();
                  return d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q);
                }).map(deal => (
                  <tr key={deal.id} className="border-t" style={{ borderColor: theme.border.primary }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: theme.text.primary }}>{deal.title}</p>
                      <p className="text-xs" style={{ color: theme.text.secondary }}>{deal.contactName}</p>
                    </td>
                    <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{deal.company}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${CRM_STAGES[deal.stage].color}20`, color: CRM_STAGES[deal.stage].color }}>
                        {CRM_STAGES[deal.stage].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>GH₵ {deal.value.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: theme.bg.tertiary }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${deal.probability}%`, backgroundColor: CRM_STAGES[deal.stage].color }} />
                        </div>
                        <span className="text-xs" style={{ color: theme.text.secondary }}>{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{deal.assignedTo}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{deal.expectedCloseDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEditDeal(deal)} className="p-2 rounded-lg transition-colors" style={{ color: theme.text.secondary }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => openDeleteConfirm('deal', deal)} className="p-2 rounded-lg transition-colors" style={{ color: theme.status.error }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // ============ CONTACTS VIEW ============
  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input type="text" placeholder="Search contacts..." value={contactSearch} onChange={e => { setContactSearch(e.target.value); setContactPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <select value={contactTagFilter} onChange={e => { setContactTagFilter(e.target.value); setContactPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Tags</option>
          {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        {hasPermission(currentUser?.role, 'crm.contacts.manage') && (
          <button onClick={() => setShowNewContactDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
            <UserPlus size={16} /> Add Contact
          </button>
        )}
        {hasPermission(currentUser?.role, 'crm.import') && (
          <button onClick={() => contactFileInputRef.current?.click()} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.primary }}>
            <Upload size={16} /> Import
          </button>
        )}
        {hasPermission(currentUser?.role, 'crm.export') && (
          <button
            onClick={() => {
              const exportData = filteredContacts.map(contact => ({
                Name: contact.name,
                Email: contact.email,
                Phone: contact.phone,
                Company: contact.company,
                Role: contact.role,
                Tags: contact.tags.join('; '),
                'Active Deals': contact.deals,
                'Total Value': `$${contact.totalValue?.toLocaleString() || 0}`,
                'Last Activity': contact.lastActivity
              }));
              exportToCSV(exportData, 'crm_contacts');
              addToast({ type: 'success', message: `Exported ${exportData.length} contacts to CSV` });
            }}
            className={btnOutline}
            style={{ borderColor: theme.border.primary, color: theme.text.primary }}
          >
            <Download size={16} /> Export
          </button>
        )}
      </div>

      {/* Hidden file input for contact import */}
      <input type="file" ref={contactFileInputRef} accept=".csv" onChange={handleImportContacts} style={{ display: 'none' }} />

      {selectedContacts.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.accent.primary }}>
          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
            {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
          </span>
          <button onClick={() => handleBulkDelete('contact')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: theme.status.error, color: 'white' }}>
            <Trash2 size={14} /> Delete Selected
          </button>
          <button onClick={() => setSelectedContacts([])} className="text-sm" style={{ color: theme.text.secondary }}>
            Clear Selection
          </button>
        </div>
      )}

      {loading ? <TableSkeleton rows={5} cols={6} theme={theme} /> : filteredContacts.length === 0 ? (
        <EmptyState icon={Users} title="No contacts found" description="Try adjusting your search or filters" theme={theme} />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.bg.tertiary }}>
                    <th className="px-4 py-3">
                      <input type="checkbox" checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0} onChange={() => toggleSelectAll('contact')} className="cursor-pointer" />
                    </th>
                    {['Name', 'Company', 'Role', 'Tags', 'Deals', 'Total Value', 'Last Activity', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedContacts.map(contact => (
                    <tr key={contact.id} className="border-t" style={{ borderColor: theme.border.primary }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedContacts.includes(contact.id)} onChange={() => toggleSelect('contact', contact.id)} className="cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: theme.text.primary }}>{contact.name}</p>
                        <p className="text-xs" style={{ color: theme.text.secondary }}>{contact.email}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{contact.company}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{contact.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags.map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>{contact.totalDeals}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>
                        {contact.totalValue > 0 ? `GH₵ ${contact.totalValue.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{contact.lastActivity}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)} className="p-2 rounded-lg transition-colors" style={{ color: theme.text.secondary }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleEditContact(contact)} className="p-2 rounded-lg transition-colors" style={{ color: theme.text.secondary }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => openDeleteConfirm('contact', contact)} className="p-2 rounded-lg transition-colors" style={{ color: theme.status.error }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={contactPage} totalPages={Math.ceil(filteredContacts.length / itemsPerPage)} onPageChange={setContactPage} />
        </>
      )}

      {/* Contact Detail Panel */}
      {selectedContact && (
        <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>{selectedContact.name}</h3>
              <p className="text-sm" style={{ color: theme.text.secondary }}>{selectedContact.role} at {selectedContact.company}</p>
            </div>
            <button onClick={() => setSelectedContact(null)} className="p-1.5 rounded-lg" style={{ color: theme.text.secondary }}>
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p style={{ color: theme.text.secondary }}>Email</p><p style={{ color: theme.text.primary }}>{selectedContact.email}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Phone</p><p style={{ color: theme.text.primary }}>{selectedContact.phone}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Total Deals</p><p className="font-semibold" style={{ color: theme.text.primary }}>{selectedContact.totalDeals}</p></div>
            <div><p style={{ color: theme.text.secondary }}>Total Value</p><p className="font-semibold" style={{ color: theme.accent.primary }}>GH₵ {selectedContact.totalValue.toLocaleString()}</p></div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: theme.text.primary }}>Activity Timeline</p>
            <div className="space-y-2">
              {activities.filter(a => a.contactName === selectedContact.name).slice(0, 5).map(act => (
                <div key={act.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: `${CRM_ACTIVITY_TYPES[act.type].color}20` }}>
                    {act.type === 'call' && <Phone size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'email' && <Mail size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'meeting' && <Users size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'task' && <CheckCircle size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                    {act.type === 'note' && <FileText size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: theme.text.primary }}>{act.subject}</p>
                    <p className="text-xs" style={{ color: theme.text.secondary }}>{act.dueDate}</p>
                  </div>
                </div>
              ))}
              {activities.filter(a => a.contactName === selectedContact.name).length === 0 && (
                <p className="text-xs py-2" style={{ color: theme.text.secondary }}>No activities recorded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============ ACTIVITIES VIEW ============
  const renderActivities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {[
          { label: 'Scheduled', count: activities.filter(a => a.status === 'scheduled').length, color: '#3B82F6' },
          { label: 'Completed', count: activities.filter(a => a.status === 'completed').length, color: '#10B981' },
          { label: 'Overdue', count: activities.filter(a => a.status === 'overdue').length, color: '#EF4444' },
        ].map(item => (
          <div key={item.label} className="p-4 rounded-xl border flex items-center gap-3" style={cardStyle}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
              <span className="text-lg font-bold" style={{ color: item.color }}>{item.count}</span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{item.label}</p>
              <p className="text-xs" style={{ color: theme.text.secondary }}>activities</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.secondary }} />
          <input type="text" placeholder="Search activities..." value={activitySearch} onChange={e => { setActivitySearch(e.target.value); setActivityPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" style={inputStyle} />
        </div>
        <select value={activityTypeFilter} onChange={e => { setActivityTypeFilter(e.target.value); setActivityPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Types</option>
          {Object.entries(CRM_ACTIVITY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={activityStatusFilter} onChange={e => { setActivityStatusFilter(e.target.value); setActivityPage(1); }} className={selectClasses} style={inputStyle}>
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        {hasPermission(currentUser?.role, 'crm.activities.manage') && (
          <button onClick={() => setShowNewActivityDrawer(true)} className={btnOutline} style={{ borderColor: theme.accent.primary, color: theme.accent.primary }}>
            <Plus size={16} /> Add Activity
          </button>
        )}
        {hasPermission(currentUser?.role, 'crm.import') && (
          <button onClick={() => activityFileInputRef.current?.click()} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.primary }}>
            <Upload size={16} /> Import
          </button>
        )}
        {hasPermission(currentUser?.role, 'crm.export') && (
          <button
            onClick={() => {
              const exportData = filteredActivities.map(activity => ({
                Type: CRM_ACTIVITY_TYPES[activity.type]?.label || activity.type,
                Subject: activity.subject,
                'Related To': activity.relatedTo,
                'Assigned To': activity.assignedTo,
                Date: activity.date,
                Status: activity.status.charAt(0).toUpperCase() + activity.status.slice(1),
                Notes: activity.notes || ''
              }));
              exportToCSV(exportData, 'crm_activities');
              addToast({ type: 'success', message: `Exported ${exportData.length} activities to CSV` });
            }}
            className={btnOutline}
            style={{ borderColor: theme.border.primary, color: theme.text.primary }}
          >
            <Download size={16} /> Export
          </button>
        )}

        {/* Hidden file input for activity import */}
        <input type="file" ref={activityFileInputRef} accept=".csv" onChange={handleImportActivities} style={{ display: 'none' }} />
      </div>

      {selectedActivities.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.accent.primary }}>
          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
            {selectedActivities.length} activit{selectedActivities.length > 1 ? 'ies' : 'y'} selected
          </span>
          <button onClick={() => handleBulkDelete('activity')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: theme.status.error, color: 'white' }}>
            <Trash2 size={14} /> Delete Selected
          </button>
          <button onClick={() => setSelectedActivities([])} className="text-sm" style={{ color: theme.text.secondary }}>
            Clear Selection
          </button>
        </div>
      )}

      {loading ? <TableSkeleton rows={5} cols={6} theme={theme} /> : filteredActivities.length === 0 ? (
        <EmptyState icon={Calendar} title="No activities found" description="Try adjusting your filters" theme={theme} />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.bg.tertiary }}>
                    <th className="px-4 py-3">
                      <input type="checkbox" checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0} onChange={() => toggleSelectAll('activity')} className="cursor-pointer" />
                    </th>
                    {['Type', 'Subject', 'Contact', 'Deal', 'Assigned To', 'Due Date', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map(act => (
                    <tr key={act.id} className={`border-t ${act.status === 'overdue' ? '' : ''}`} style={{ borderColor: theme.border.primary, backgroundColor: act.status === 'overdue' ? `${theme.status?.error || '#EF4444'}08` : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = act.status === 'overdue' ? `${theme.status?.error || '#EF4444'}12` : theme.bg.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = act.status === 'overdue' ? `${theme.status?.error || '#EF4444'}08` : 'transparent'}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedActivities.includes(act.id)} onChange={() => toggleSelect('activity', act.id)} className="cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${CRM_ACTIVITY_TYPES[act.type].color}20` }}>
                          {act.type === 'call' && <Phone size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'email' && <Mail size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'meeting' && <Users size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'task' && <CheckCircle size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                          {act.type === 'note' && <FileText size={16} style={{ color: CRM_ACTIVITY_TYPES[act.type].color }} />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: theme.text.primary }}>{act.subject}</p>
                        <p className="text-xs truncate max-w-xs" style={{ color: theme.text.secondary }}>{act.description}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{act.contactName || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.secondary }}>{act.dealTitle || '—'}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{act.assignedTo}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: act.status === 'overdue' ? '#EF4444' : theme.text.secondary }}>
                        {act.status === 'overdue' && <AlertTriangle size={16} className="inline mr-1" />}
                        {act.dueDate}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                          backgroundColor: act.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : act.status === 'overdue' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: act.status === 'completed' ? '#10B981' : act.status === 'overdue' ? '#EF4444' : '#3B82F6',
                        }}>
                          {act.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => handleEditActivity(act)} className="p-2 rounded-lg transition-colors" style={{ color: theme.text.secondary }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => openDeleteConfirm('activity', act)} className="p-2 rounded-lg transition-colors" style={{ color: theme.status.error }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.bg.hover}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={activityPage} totalPages={Math.ceil(filteredActivities.length / itemsPerPage)} onPageChange={setActivityPage} />
        </>
      )}
    </div>
  );

  // ============ REPORTS VIEW ============
  const renderReports = () => {
    const conversionFunnel = [
      { stage: 'Leads', count: leads.length, color: '#3B82F6' },
      { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: '#8B5CF6' },
      { stage: 'Deals Created', count: deals.length, color: '#F59E0B' },
      { stage: 'Proposals', count: deals.filter(d => ['proposal', 'negotiation', 'closed_won'].includes(d.stage)).length, color: '#F97316' },
      { stage: 'Won', count: deals.filter(d => d.stage === 'closed_won').length, color: '#10B981' },
    ];
    const maxCount = Math.max(...conversionFunnel.map(s => s.count));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Pipeline" value={`GH₵ ${(crmMetrics.pipelineValue / 1000).toFixed(0)}K`} icon={DollarSign} loading={loading} />
          <MetricCard title="Avg Deal Size" value={`GH₵ ${Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length / 1000)}K`} icon={BarChart3} loading={loading} />
          <MetricCard title="Win Rate" value={`${crmMetrics.conversionRate}%`} icon={TrendingUp} loading={loading} />
          <MetricCard title="Active Leads" value={leads.filter(l => l.status !== 'unqualified').length} icon={Target} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Conversion Funnel</h3>
            <div className="space-y-3">
              {conversionFunnel.map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: theme.text.secondary }}>{item.stage}</span>
                    <span className="font-medium" style={{ color: theme.text.primary }}>{item.count}</span>
                  </div>
                  <div className="w-full h-6 rounded-lg overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                    <div className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max((item.count / maxCount) * 100, 8)}%`, backgroundColor: item.color }}>
                      <span className="text-xs text-white font-medium">{Math.round((item.count / leads.length) * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Value by Stage */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Pipeline Value by Stage</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} tickFormatter={v => `${v / 1000}K`} />
                <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 11 }} width={85} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={(v) => [`GH₵ ${v.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {pipelineChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deals Over Time */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Deals Won vs Lost</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={crmMonthlyData}>
                <defs>
                  <linearGradient id="gradWonR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                <Area type="monotone" dataKey="won" stroke="#10B981" fill="url(#gradWonR)" strokeWidth={2} name="Won" />
                <Area type="monotone" dataKey="lost" stroke="#EF4444" fill="transparent" strokeWidth={2} name="Lost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Metrics */}
          <div className="p-5 rounded-2xl border" style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Activity by Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.secondary, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {activityBreakdownData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Team Performance */}
        <div className="p-5 rounded-2xl border" style={cardStyle}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Sales Team Performance</h3>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.bg.tertiary }}>
                  {['Team Member', 'Leads', 'Active Deals', 'Pipeline Value', 'Won Value', 'Activities'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: theme.text.primary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Ama Owusu', 'Daniel Boateng', 'Kwame Asante'].map(name => {
                  const memberLeads = leads.filter(l => l.assignedTo === name).length;
                  const memberDeals = deals.filter(d => d.assignedTo === name && !['closed_won', 'closed_lost'].includes(d.stage));
                  const memberWon = deals.filter(d => d.assignedTo === name && d.stage === 'closed_won');
                  const memberActivities = activities.filter(a => a.assignedTo === name).length;
                  return (
                    <tr key={name} className="border-t" style={{ borderColor: theme.border.primary }}>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>{name}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{memberLeads}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{memberDeals.length}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>GH₵ {memberDeals.reduce((s, d) => s + d.value, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#10B981' }}>GH₵ {memberWon.reduce((s, d) => s + d.value, 0).toLocaleString()}</td>
                      <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{memberActivities}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>
            CRM {currentView !== 'Dashboard' ? `· ${currentView}` : ''}
          </h1>
          <p style={{ color: theme.text.secondary }}>
            {currentView === 'Dashboard' && 'Sales pipeline overview and key metrics'}
            {currentView === 'Leads' && `${filteredLeads.length} leads · Manage your sales pipeline`}
            {currentView === 'Pipeline' && `${deals.length} deals across ${Object.keys(CRM_STAGES).length} stages`}
            {currentView === 'Contacts' && `${filteredContacts.length} contacts in your network`}
            {currentView === 'Activities' && `${filteredActivities.length} activities · Track your team's work`}
            {currentView === 'Reports' && 'Analytics and performance metrics'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => addToast({ type: 'info', message: 'Refreshing CRM data...' })} className={btnOutline} style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* View Content */}
      {currentView === 'Dashboard' && renderDashboard()}
      {currentView === 'Leads' && renderLeads()}
      {currentView === 'Pipeline' && renderPipeline()}
      {currentView === 'Contacts' && renderContacts()}
      {currentView === 'Activities' && renderActivities()}
      {currentView === 'Reports' && renderReports()}

      {/* Drawers */}
      <NewLeadDrawer
        isOpen={showNewLeadDrawer}
        onClose={() => { setShowNewLeadDrawer(false); setEditingLead(null); }}
        onSave={handleSaveLead}
        lead={editingLead}
      />
      <NewContactDrawer
        isOpen={showNewContactDrawer}
        onClose={() => { setShowNewContactDrawer(false); setEditingContact(null); }}
        onSave={handleSaveContact}
        contact={editingContact}
      />
      <NewDealDrawer
        isOpen={showNewDealDrawer}
        onClose={() => { setShowNewDealDrawer(false); setEditingDeal(null); }}
        onSave={handleSaveDeal}
        deal={editingDeal}
      />
      <NewActivityDrawer
        isOpen={showNewActivityDrawer}
        onClose={() => { setShowNewActivityDrawer(false); setEditingActivity(null); }}
        onSave={handleSaveActivity}
        activity={editingActivity}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: null, item: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Confirmation"
        message={`Are you sure you want to delete this ${deleteConfirm.type}? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
};
