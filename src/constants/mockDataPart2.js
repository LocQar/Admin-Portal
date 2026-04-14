// ============ CUSTOMERS & SUBSCRIBERS ============
export const customersData = [];

export const subscribersData = [];

// ============ STAFF & TEAMS ============
export const staffData = [];

export const teamsData = [];

// ============ DRIVERS & ROUTES ============
export const driversData = [];

export const routesData = [];

// ============ ACCOUNTING ============
export const transactionsData = [];

export const invoicesData = [];

// ============ TICKETS ============
export const ticketsData = [];

// ============ AUDIT LOG ============
export const auditLogData = [];

// ============ PARTNERS & B2B ============
export const partnersData = [];

export const TIERS = {
  gold: { label: 'Gold', color: '#D4AA5A', bg: 'rgba(212,170,90,0.1)', perks: 'Priority SLA, Dedicated Support, Custom API Limits' },
  silver: { label: 'Silver', color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)', perks: 'Standard SLA, Email Support, Standard API Limits' },
  bronze: { label: 'Bronze', color: '#cd7c32', bg: 'rgba(205,124,50,0.1)', perks: 'Basic SLA, Ticket Support, Basic API Limits' },
};

export const apiKeysData = [];

export const bulkShipmentsData = [];

// ============ DROPBOXES ============
export const dropboxesData = [];

export const collectionsData = [];

export const dropboxAgentsData = [];

export const dropboxFlowData = [];

export const DROPBOX_FLOW_STAGES = {
  awaiting_collection: { label: 'In Dropbox', color: '#D4AA5A', bg: 'rgba(212,170,90,0.1)', step: 0 },
  collection_overdue: { label: 'Collection Overdue', color: '#D48E8A', bg: 'rgba(212,142,138,0.1)', step: 0 },
  collected: { label: 'Collected', color: '#7EA8C9', bg: 'rgba(126,168,201,0.1)', step: 1 },
  in_transit: { label: 'In Transit to Terminal', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', step: 2 },
  at_terminal: { label: 'At Terminal', color: '#B5A0D1', bg: 'rgba(181,160,209,0.1)', step: 3 },
  delivered_to_locker: { label: 'In Locker', color: '#81C995', bg: 'rgba(129,201,149,0.1)', step: 4 },
};

export const dropboxFillHistory = [];

// ============ NOTIFICATION DATA ============
export const smsTemplatesData = [];

export const notificationHistoryData = [];

export const autoRulesData = [];

export const MSG_STATUSES = {
  delivered: { label: 'Delivered', color: '#81C995', bg: 'rgba(129,201,149,0.1)', icon: '✓✓' },
  read: { label: 'Read', color: '#7EA8C9', bg: 'rgba(126,168,201,0.1)', icon: '✓✓' },
  opened: { label: 'Opened', color: '#B5A0D1', bg: 'rgba(181,160,209,0.1)', icon: '👁' },
  sent: { label: 'Sent', color: '#D4AA5A', bg: 'rgba(212,170,90,0.1)', icon: '✓' },
  failed: { label: 'Failed', color: '#D48E8A', bg: 'rgba(212,142,138,0.1)', icon: '✕' },
  bounced: { label: 'Bounced', color: '#D48E8A', bg: 'rgba(212,142,138,0.1)', icon: '↩' },
  pending: { label: 'Pending', color: '#78716C', bg: 'rgba(120,113,108,0.1)', icon: '⏳' },
};

// ============ PARTNER SELF-SERVICE PORTAL DATA ============
export const portalShipmentsData = [];

export const portalInvoicesData = [];

export const portalWebhookLogsData = [];

export const portalRateCard = [];

export const portalShipmentTrend = [];

// ============ FLEET & VEHICLES ============
export const vehiclesData = [];

export const maintenanceLogsData = [];

export const fuelLogsData = [];

// ============ PAYROLL ============

export const salaryConfig = {
  staff: {
    1: { base: 4800 }, 2: { base: 4200 }, 3: { base: 3200 },
    4: { base: 1800 }, 5: { base: 2000 }, 6: { base: 1500 },
    7: { base: 1800 }, 8: { base: 1800 }, 9: { base: 2000 },
    10: { base: 3200 }, 11: { base: 1800 }, 12: { base: 2000 },
    13: { base: 1500 }, 14: { base: 1800 }, 15: { base: 1400 },
  },
  couriers: { ratePerDelivery: 12, bonus: { threshold: 80, amount: 200 } },
  drivers: { baseSalary: 2200, ratePerDelivery: 8 },
};

export const payPeriodsData = [];

export const payrollRecordsData = [];

// ============ HRIS — ONBOARDING / OFFBOARDING / ALUMNI ============

export const onboardingData = [];

export const offboardingData = [];

export const alumniData = [];
