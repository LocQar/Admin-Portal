// ============ CRM CONSTANTS ============

export const CRM_LEAD_STATUSES = {
  new: { label: 'New', color: '#3B82F6', bg: '#EFF6FF' },
  contacted: { label: 'Contacted', color: '#F59E0B', bg: '#FFFBEB' },
  qualified: { label: 'Qualified', color: '#10B981', bg: '#ECFDF5' },
  unqualified: { label: 'Unqualified', color: '#6B7280', bg: '#F3F4F6' },
};

export const CRM_STAGES = {
  prospecting: { label: 'Prospecting', color: '#8B5CF6', bg: '#F5F3FF', order: 1 },
  qualification: { label: 'Qualification', color: '#3B82F6', bg: '#EFF6FF', order: 2 },
  proposal: { label: 'Proposal', color: '#F59E0B', bg: '#FFFBEB', order: 3 },
  negotiation: { label: 'Negotiation', color: '#F97316', bg: '#FFF7ED', order: 4 },
  closed_won: { label: 'Closed Won', color: '#10B981', bg: '#ECFDF5', order: 5 },
  closed_lost: { label: 'Closed Lost', color: '#EF4444', bg: '#FEF2F2', order: 6 },
};

export const CRM_ACTIVITY_TYPES = {
  call: { label: 'Call', color: '#3B82F6', bg: '#EFF6FF' },
  email: { label: 'Email', color: '#8B5CF6', bg: '#F5F3FF' },
  meeting: { label: 'Meeting', color: '#F59E0B', bg: '#FFFBEB' },
  task: { label: 'Task', color: '#10B981', bg: '#ECFDF5' },
  note: { label: 'Note', color: '#6B7280', bg: '#F3F4F6' },
};

export const CRM_LEAD_SOURCES = {
  website: { label: 'Website', color: '#3B82F6' },
  referral: { label: 'Referral', color: '#10B981' },
  cold_call: { label: 'Cold Call', color: '#F59E0B' },
  trade_show: { label: 'Trade Show', color: '#8B5CF6' },
  social_media: { label: 'Social Media', color: '#EC4899' },
  partner: { label: 'Partner', color: '#F97316' },
};

// ============ CRM LEADS ============
export const crmLeads = [];

// ============ CRM DEALS ============
export const crmDeals = [];

// ============ CRM CONTACTS ============
export const crmContacts = [];

// ============ CRM ACTIVITIES ============
export const crmActivities = [];

// ============ CRM CHART DATA ============
export const pipelineChartData = [];

export const crmMonthlyData = [];

export const activityBreakdownData = [];
