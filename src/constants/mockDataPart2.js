// ============ CUSTOMERS & SUBSCRIBERS ============
export const customersData = [
  { id: 1, name: 'Joe Doe', email: 'joe@email.com', phone: '+233551399333', type: 'individual', totalOrders: 15, totalSpent: 2450, status: 'active', joined: '2023-06-15' },
  { id: 2, name: 'Jane Doe', email: 'jane@email.com', phone: '+233557821456', type: 'individual', totalOrders: 8, totalSpent: 1280, status: 'active', joined: '2023-08-22' },
  { id: 3, name: 'Jumia Ghana', email: 'logistics@jumia.com.gh', phone: '+233302123456', type: 'b2b', totalOrders: 450, totalSpent: 45000, status: 'active', joined: '2023-01-10' },
  { id: 4, name: 'Melcom Ltd', email: 'shipping@melcom.com', phone: '+233302654321', type: 'b2b', totalOrders: 280, totalSpent: 32000, status: 'active', joined: '2023-02-15' },
  { id: 5, name: 'Michael Mensah', email: 'michael@email.com', phone: '+233549876321', type: 'individual', totalOrders: 5, totalSpent: 890, status: 'active', joined: '2023-10-01' },
];

export const subscribersData = [
  {
    id: 'SUB-001', name: 'Kwame Asante', email: 'kwame.asante@ug.edu.gh', phone: '+233551234001',
    university: 'University of Ghana', campus: 'Legon', studentId: 'UG-10458723',
    plan: 'PLAN-STD', status: 'active', startDate: '2024-09-01', renewalDate: '2025-03-01',
    deliveriesUsed: 12, terminal: 'Achimota Mall', lastDelivery: '2025-01-10',
    verified: true, autoRenew: true, notes: 'Regular user, prefers Achimota Mall terminal.',
    paymentHistory: [
      { date: '2025-01-01', amount: 45, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S001-01' },
      { date: '2024-12-01', amount: 45, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S001-02' },
    ],
    deliveryLog: [
      { date: '2025-01-10', waybill: 'LQ-2025-00112', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2025-01-05', waybill: 'LQ-2025-00098', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Small' },
    ],
  },
  // Add more subscribers as needed
];

// ============ STAFF & TEAMS ============
export const staffData = [
  { id: 1, name: 'John Doe', email: 'john@locqar.com', role: 'SUPER_ADMIN', terminal: 'All', team: 'Management', status: 'active', lastActive: '2 min ago', performance: 98 },
  { id: 2, name: 'Akua Mansa', email: 'akua@locqar.com', role: 'ADMIN', terminal: 'All', team: 'Management', status: 'active', lastActive: '15 min ago', performance: 95 },
  { id: 3, name: 'Kofi Asante', email: 'kofi@locqar.com', role: 'MANAGER', terminal: 'Achimota Mall', team: 'Operations', status: 'active', lastActive: '1 hour ago', performance: 92 },
  { id: 4, name: 'Yaw Boateng', email: 'yaw@locqar.com', role: 'AGENT', terminal: 'Achimota Mall', team: 'Field', status: 'active', lastActive: '5 min ago', performance: 88 },
  { id: 5, name: 'Kweku Appiah', email: 'kweku@locqar.com', role: 'SUPPORT', terminal: 'All', team: 'Support', status: 'active', lastActive: '10 min ago', performance: 90 },
  { id: 6, name: 'Adjoa Frimpong', email: 'adjoa@locqar.com', role: 'VIEWER', terminal: 'Accra Mall', team: 'Operations', status: 'inactive', lastActive: '3 days ago', performance: 75 },
];

export const teamsData = [
  { id: 1, name: 'Management', members: 2, lead: 'John Doe', color: '#4E0F0F' },
  { id: 2, name: 'Operations', members: 4, lead: 'Kofi Asante', color: '#3b82f6' },
  { id: 3, name: 'Field', members: 8, lead: 'Yaw Boateng', color: '#10b981' },
  { id: 4, name: 'Support', members: 3, lead: 'Kweku Appiah', color: '#8b5cf6' },
];

// ============ DRIVERS & ROUTES ============
export const driversData = [
  { id: 1, name: 'Kwesi Asante', phone: '+233551234567', vehicle: 'Toyota Hiace - GR-1234-20', zone: 'Accra Central', status: 'active', deliveriesToday: 12, rating: 4.8 },
  { id: 2, name: 'Kofi Mensah', phone: '+233559876543', vehicle: 'Nissan Urvan - GW-5678-21', zone: 'East Legon', status: 'on_delivery', deliveriesToday: 8, rating: 4.6 },
  { id: 3, name: 'Yaw Boateng', phone: '+233542345678', vehicle: 'Kia Bongo - GN-9012-22', zone: 'Tema', status: 'offline', deliveriesToday: 0, rating: 4.9 },
  { id: 4, name: 'Kwame Asiedu', phone: '+233553456789', vehicle: 'Toyota Hiace - GR-3456-21', zone: 'Achimota', status: 'active', deliveriesToday: 15, rating: 4.7 },
];

export const routesData = [
  {
    id: 'RT-001', zone: 'Accra Central', status: 'active', driver: driversData[0],
    startTime: '08:00', estEndTime: '10:30', distance: '28 km', createdAt: '2024-01-15 07:30',
    stops: [
      { id: 1, order: 1, terminal: 'Achimota Mall', packages: [1, 5], delivered: 2, eta: '08:25', status: 'completed', arrivedAt: '08:22' },
      { id: 2, order: 2, terminal: 'Accra Mall', packages: [2, 6], delivered: 1, eta: '09:00', status: 'in_progress', arrivedAt: '08:55' },
    ],
    timeline: [
      { time: '07:30', event: 'Route created', icon: 'route', by: 'System' },
      { time: '08:00', event: 'Route started', icon: 'truck', by: 'Kwesi Asante' },
    ]
  },
];

// ============ ACCOUNTING ============
export const transactionsData = [
  { id: 'TXN-001', date: '2024-01-15', description: 'Package delivery - LQ-2024-00001', customer: 'Joe Doe', amount: 450, type: 'credit', status: 'completed' },
  { id: 'TXN-002', date: '2024-01-15', description: 'COD Collection - LQ-2024-00004', customer: 'Sarah Asante', amount: 890, type: 'credit', status: 'pending' },
  { id: 'TXN-003', date: '2024-01-14', description: 'Refund - LQ-2024-00003', customer: 'Michael Mensah', amount: -50, type: 'debit', status: 'completed' },
  { id: 'TXN-004', date: '2024-01-15', description: 'B2B Invoice Payment - Jumia', customer: 'Jumia Ghana', amount: 15000, type: 'credit', status: 'completed' },
];

export const invoicesData = [
  { id: 'INV-001', customer: 'Jumia Ghana', date: '2024-01-01', dueDate: '2024-01-31', amount: 15000, status: 'paid' },
  { id: 'INV-002', customer: 'Melcom Ltd', date: '2024-01-01', dueDate: '2024-01-31', amount: 12500, status: 'pending' },
  { id: 'INV-003', customer: 'Joe Doe', date: '2024-01-10', dueDate: '2024-01-25', amount: 450, status: 'overdue' },
];

// ============ TICKETS ============
export const ticketsData = [
  { id: 'TKT-001', customer: 'Joe Doe', subject: 'Cannot open locker A-15', category: 'Technical', status: 'open', priority: 'high', created: '2024-01-15 10:30', assignee: 'Support Team' },
  { id: 'TKT-002', customer: 'Jane Doe', subject: 'Package not received', category: 'Delivery', status: 'in_progress', priority: 'medium', created: '2024-01-15 09:15', assignee: 'Kweku Appiah' },
  { id: 'TKT-003', customer: 'Michael Mensah', subject: 'Refund request', category: 'Billing', status: 'pending', priority: 'low', created: '2024-01-14 16:45', assignee: null },
];

// ============ AUDIT LOG ============
export const auditLogData = [
  { id: 1, user: 'John Doe', action: 'Opened locker A-15', timestamp: '2024-01-15 14:32:15', ip: '192.168.1.100' },
  { id: 2, user: 'Kofi Asante', action: 'Updated package LQ-2024-00002 status', timestamp: '2024-01-15 14:28:00', ip: '192.168.1.105' },
  { id: 3, user: 'Yaw Boateng', action: 'Scanned package LQ-2024-00007', timestamp: '2024-01-15 14:15:30', ip: '192.168.1.110' },
  { id: 4, user: 'Akua Mansa', action: 'Created new customer account', timestamp: '2024-01-15 13:45:00', ip: '192.168.1.102' },
  { id: 5, user: 'John Doe', action: 'Generated monthly report', timestamp: '2024-01-15 12:00:00', ip: '192.168.1.100' },
];

// ============ PARTNERS & B2B ============
export const partnersData = [
  { id: 1, name: 'Jumia Ghana', email: 'logistics@jumia.com.gh', phone: '+233302123456', type: 'e-commerce', tier: 'gold', totalOrders: 450, monthlyVolume: 120, totalSpent: 45000, revenue: 15000, status: 'active', joined: '2023-01-10', contractEnd: '2025-12-31', sla: '24hr', apiCalls: 12450, lastApiCall: '2 min ago', deliveryRate: 97.2, logo: '🟡' },
  { id: 2, name: 'Melcom Ltd', email: 'shipping@melcom.com', phone: '+233302654321', type: 'retail', tier: 'silver', totalOrders: 280, monthlyVolume: 75, totalSpent: 32000, revenue: 12500, status: 'active', joined: '2023-02-15', contractEnd: '2025-06-30', sla: '48hr', apiCalls: 8200, lastApiCall: '15 min ago', deliveryRate: 94.8, logo: '🔵' },
];

export const TIERS = {
  gold: { label: 'Gold', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', perks: 'Priority SLA, Dedicated Support, Custom API Limits' },
  silver: { label: 'Silver', color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)', perks: 'Standard SLA, Email Support, Standard API Limits' },
  bronze: { label: 'Bronze', color: '#cd7c32', bg: 'rgba(205,124,50,0.1)', perks: 'Basic SLA, Ticket Support, Basic API Limits' },
};

export const apiKeysData = [
  { id: 1, partner: 'Jumia Ghana', key: 'lq_live_jum_****a8f2', env: 'production', created: '2023-01-15', lastUsed: '2 min ago', status: 'active', callsToday: 342, rateLimit: 1000, callsMonth: 12450 },
  { id: 2, partner: 'Jumia Ghana', key: 'lq_test_jum_****b3c1', env: 'sandbox', created: '2023-01-10', lastUsed: '1 day ago', status: 'active', callsToday: 12, rateLimit: 500, callsMonth: 890 },
  { id: 3, partner: 'Melcom Ltd', key: 'lq_live_mel_****d4e5', env: 'production', created: '2023-02-20', lastUsed: '15 min ago', status: 'active', callsToday: 187, rateLimit: 500, callsMonth: 8200 },
  { id: 4, partner: 'Telecel Ghana', key: 'lq_live_tel_****f6g7', env: 'production', created: '2023-05-25', lastUsed: '1 hour ago', status: 'active', callsToday: 95, rateLimit: 500, callsMonth: 5600 },
  { id: 5, partner: 'CompuGhana', key: 'lq_live_cmp_****h8i9', env: 'production', created: '2023-11-15', lastUsed: '2 weeks ago', status: 'revoked', callsToday: 0, rateLimit: 200, callsMonth: 0 },
];

export const bulkShipmentsData = [
  { id: 'BSH-001', partner: 'Jumia Ghana', packages: 45, status: 'in_transit_to_locker', created: '2024-01-15 08:00', eta: '14:00 today', delivered: 12, pending: 33, terminal: 'Achimota Mall' },
  { id: 'BSH-002', partner: 'Melcom Ltd', packages: 28, status: 'delivered_to_locker', created: '2024-01-14 10:00', eta: 'Completed', delivered: 28, pending: 0, terminal: 'Accra Mall' },
  { id: 'BSH-003', partner: 'Telecel Ghana', packages: 15, status: 'pending', created: '2024-01-15 12:00', eta: '10:00 tomorrow', delivered: 0, pending: 15, terminal: 'Kotoka T3' },
  { id: 'BSH-004', partner: 'Jumia Ghana', packages: 62, status: 'in_transit_to_locker', created: '2024-01-15 06:00', eta: '18:00 today', delivered: 38, pending: 24, terminal: 'Junction Mall' },
  { id: 'BSH-005', partner: 'Hubtel', packages: 20, status: 'at_warehouse', created: '2024-01-15 11:00', eta: '16:00 today', delivered: 0, pending: 20, terminal: 'West Hills Mall' },
];

// ============ DROPBOXES ============
export const dropboxesData = [
  { id: 'DBX-001', name: 'Achimota Overpass', location: 'Achimota', address: 'Near Achimota Interchange', capacity: 50, currentFill: 42, status: 'active', lastCollection: '2024-01-15 10:30', nextCollection: '2024-01-15 16:00', assignedAgent: 'Yaw Boateng', agentPhone: '+233542345678', terminal: 'Achimota Mall', packagesIn: 42, packagesOut: 485, avgDailyVolume: 35, installDate: '2023-03-15', type: 'standard', alerts: ['near_full'] },
  { id: 'DBX-002', name: 'Madina Market', location: 'Madina', address: 'Madina Market Main Gate', capacity: 40, currentFill: 12, status: 'active', lastCollection: '2024-01-15 11:00', nextCollection: '2024-01-15 17:00', assignedAgent: 'Kwesi Asante', agentPhone: '+233551234567', terminal: 'Achimota Mall', packagesIn: 12, packagesOut: 320, avgDailyVolume: 22, installDate: '2023-04-20', type: 'standard', alerts: [] },
];

export const collectionsData = [
  { id: 'COL-001', dropbox: 'DBX-001', dropboxName: 'Achimota Overpass', agent: 'Yaw Boateng', scheduled: '2024-01-15 16:00', status: 'scheduled', packages: 42, terminal: 'Achimota Mall', priority: 'high', eta: '45 min', vehicle: 'Motorbike' },
  { id: 'COL-002', dropbox: 'DBX-003', dropboxName: 'Osu Oxford Street', agent: 'Kwame Asiedu', scheduled: '2024-01-15 14:00', status: 'overdue', packages: 31, terminal: 'Accra Mall', priority: 'high', eta: 'Overdue', vehicle: 'Van' },
];

export const dropboxAgentsData = [
  { id: 1, name: 'Yaw Boateng', phone: '+233542345678', vehicle: 'Honda CG125 Motorbike', assignedDropboxes: ['DBX-001', 'DBX-005'], zone: 'North Accra', status: 'active', collectionsToday: 3, totalCollected: 56, rating: 4.9, avgCollectionTime: '22 min', photo: '🧑🏾' },
  { id: 2, name: 'Kwesi Asante', phone: '+233551234567', vehicle: 'Toyota Hiace Van - GR-1234-20', assignedDropboxes: ['DBX-002', 'DBX-006'], zone: 'East Accra', status: 'on_delivery', collectionsToday: 2, totalCollected: 37, rating: 4.8, avgCollectionTime: '28 min', photo: '👨🏾' },
  { id: 3, name: 'Kwame Asiedu', phone: '+233553456789', vehicle: 'Toyota Hiace Van - GR-3456-21', assignedDropboxes: ['DBX-003', 'DBX-008'], zone: 'South Accra', status: 'active', collectionsToday: 1, totalCollected: 31, rating: 4.7, avgCollectionTime: '25 min', photo: '👨🏿' },
  { id: 4, name: 'Kofi Mensah', phone: '+233559876543', vehicle: 'Nissan Urvan Van - GW-5678-21', assignedDropboxes: ['DBX-004'], zone: 'Tema', status: 'offline', collectionsToday: 0, totalCollected: 0, rating: 4.6, avgCollectionTime: '30 min', photo: '🧔🏾' },
];

export const dropboxFlowData = [
  { id: 'DFL-001', waybill: 'LQ-2024-00009', customer: 'Yaw Asiedu', dropbox: 'DBX-001', dropboxName: 'Achimota Overpass', depositTime: '2024-01-15 13:45', collectionId: 'COL-001', targetLocker: 'A-12', targetTerminal: 'Achimota Mall', stage: 'awaiting_collection', eta: '16:00' },
  { id: 'DFL-002', waybill: 'LQ-2024-00011', customer: 'Ama Darko', dropbox: 'DBX-003', dropboxName: 'Osu Oxford Street', depositTime: '2024-01-15 08:20', collectionId: 'COL-002', targetLocker: 'B-14', targetTerminal: 'Accra Mall', stage: 'collection_overdue', eta: 'Overdue' },
  { id: 'DFL-003', waybill: 'LQ-2024-00012', customer: 'Kofi Appiah', dropbox: 'DBX-006', dropboxName: 'Spintex Baatsona', depositTime: '2024-01-15 11:10', collectionId: 'COL-004', targetLocker: 'J-08', targetTerminal: 'Junction Mall', stage: 'awaiting_collection', eta: '15:00' },
  { id: 'DFL-004', waybill: 'LQ-2024-00013', customer: 'Efua Mensah', dropbox: 'DBX-001', dropboxName: 'Achimota Overpass', depositTime: '2024-01-15 09:00', collectionId: 'COL-008', targetLocker: 'A-07', targetTerminal: 'Achimota Mall', stage: 'in_transit', eta: '14:30' },
  { id: 'DFL-005', waybill: 'LQ-2024-00014', customer: 'Kweku Duah', dropbox: 'DBX-002', dropboxName: 'Madina Market', depositTime: '2024-01-15 10:15', collectionId: 'COL-009', targetLocker: 'A-19', targetTerminal: 'Achimota Mall', stage: 'delivered_to_locker', eta: 'Done' },
  { id: 'DFL-006', waybill: 'LQ-2024-00015', customer: 'Adwoa Sika', dropbox: 'DBX-004', dropboxName: 'Tema Community 1', depositTime: '2024-01-14 15:30', collectionId: 'COL-003', targetLocker: 'J-02', targetTerminal: 'Junction Mall', stage: 'collection_overdue', eta: 'Overdue' },
];

export const DROPBOX_FLOW_STAGES = {
  awaiting_collection: { label: 'In Dropbox', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', step: 0 },
  collection_overdue: { label: 'Collection Overdue', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', step: 0 },
  collected: { label: 'Collected', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', step: 1 },
  in_transit: { label: 'In Transit to Terminal', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', step: 2 },
  at_terminal: { label: 'At Terminal', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', step: 3 },
  delivered_to_locker: { label: 'In Locker', color: '#10b981', bg: 'rgba(16,185,129,0.1)', step: 4 },
};

export const dropboxFillHistory = [
  { time: '6AM', dbx001: 5, dbx003: 8, dbx004: 22 },
  { time: '8AM', dbx001: 12, dbx003: 15, dbx004: 25 },
  { time: '10AM', dbx001: 25, dbx003: 22, dbx004: 28 },
  { time: '12PM', dbx001: 35, dbx003: 28, dbx004: 30 },
  { time: '2PM', dbx001: 42, dbx003: 31, dbx004: 30 },
];

// ============ NOTIFICATION DATA ============
export const smsTemplatesData = [
  { id: 'TPL-001', name: 'Package Ready for Pickup', channel: 'sms', event: 'delivered_to_locker', message: 'Hi {customer}, your package {waybill} is ready at {terminal}, Locker {locker}. Pickup code: {code}. Valid for 5 days.', active: true, sentCount: 4820, deliveryRate: 98.2, lastSent: '2 min ago' },
  { id: 'TPL-002', name: 'Package in Transit', channel: 'sms', event: 'in_transit', message: 'Hi {customer}, your package {waybill} is on its way to {terminal}. ETA: {eta}. Track: {trackUrl}', active: true, sentCount: 3210, deliveryRate: 97.8, lastSent: '5 min ago' },
];

export const notificationHistoryData = [
  { id: 'MSG-001', template: 'Package Ready for Pickup', channel: 'sms', recipient: 'Joe Doe', phone: '+233551399333', waybill: 'LQ-2024-00001', status: 'delivered', sentAt: '2024-01-15 14:32', deliveredAt: '2024-01-15 14:32', cost: 0.05 },
  { id: 'MSG-002', template: 'Welcome - Locker Ready (WA)', channel: 'whatsapp', recipient: 'Joe Doe', phone: '+233551399333', waybill: 'LQ-2024-00001', status: 'read', sentAt: '2024-01-15 14:32', deliveredAt: '2024-01-15 14:33', cost: 0.02 },
];

export const autoRulesData = [
  { id: 'RULE-001', name: 'Locker Deposit → Pickup Notification', trigger: 'delivered_to_locker', channels: ['sms', 'whatsapp'], templates: ['TPL-001', 'TPL-007'], delay: '0 min', active: true, fired: 4820, description: 'Send pickup code via SMS + WhatsApp when package is deposited in locker' },
];

export const MSG_STATUSES = {
  delivered: { label: 'Delivered', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✓✓' },
  read: { label: 'Read', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: '✓✓' },
  opened: { label: 'Opened', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: '👁' },
  sent: { label: 'Sent', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '✓' },
  failed: { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '✕' },
  bounced: { label: 'Bounced', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '↩' },
  pending: { label: 'Pending', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '⏳' },
};

// ============ PARTNER SELF-SERVICE PORTAL DATA ============
export const portalShipmentsData = [
  { id: 'JUM-2024-0451', waybill: 'LQ-2024-01201', customer: 'Kofi Asante', phone: '+233551234567', destination: 'Achimota Mall', locker: 'A-12', size: 'Medium', status: 'delivered_to_locker', pickupCode: '8472', daysInLocker: 1, value: 85, weight: '1.8kg', createdAt: '2024-01-15 08:00', deliveredAt: '2024-01-15 10:30', batchId: 'BSH-001' },
  { id: 'JUM-2024-0452', waybill: 'LQ-2024-01202', customer: 'Ama Darko', phone: '+233559876543', destination: 'Accra Mall', locker: 'B-03', size: 'Small', status: 'delivered_to_locker', pickupCode: '5139', daysInLocker: 0, value: 45, weight: '0.5kg', createdAt: '2024-01-15 08:00', deliveredAt: '2024-01-15 11:00', batchId: 'BSH-001' },
  { id: 'JUM-2024-0453', waybill: 'LQ-2024-01203', customer: 'Efua Mensah', phone: '+233542345678', destination: 'Achimota Mall', locker: '-', size: 'Large', status: 'in_transit_to_locker', pickupCode: null, daysInLocker: 0, value: 320, weight: '4.2kg', createdAt: '2024-01-15 08:00', deliveredAt: null, batchId: 'BSH-001' },
  { id: 'JUM-2024-0454', waybill: 'LQ-2024-01204', customer: 'Kweku Duah', phone: '+233553456789', destination: 'Kotoka T3', locker: '-', size: 'Medium', status: 'in_transit_to_locker', pickupCode: null, daysInLocker: 0, value: 150, weight: '2.1kg', createdAt: '2024-01-15 08:00', deliveredAt: null, batchId: 'BSH-001' },
  { id: 'JUM-2024-0455', waybill: 'LQ-2024-01205', customer: 'Adwoa Sika', phone: '+233557778888', destination: 'Junction Mall', locker: 'J-09', size: 'Small', status: 'picked_up', pickupCode: '2951', daysInLocker: 0, value: 65, weight: '0.3kg', createdAt: '2024-01-14 10:00', deliveredAt: '2024-01-14 14:00', batchId: 'BSH-004' },
  { id: 'JUM-2024-0456', waybill: 'LQ-2024-01206', customer: 'Yaw Mensah', phone: '+233551112233', destination: 'Achimota Mall', locker: 'A-07', size: 'Medium', status: 'delivered_to_locker', pickupCode: '6284', daysInLocker: 3, value: 210, weight: '3.0kg', createdAt: '2024-01-12 09:00', deliveredAt: '2024-01-12 13:00', batchId: null },
  { id: 'JUM-2024-0457', waybill: 'LQ-2024-01207', customer: 'Akua Boateng', phone: '+233554445566', destination: 'West Hills Mall', locker: '-', size: 'XLarge', status: 'at_warehouse', pickupCode: null, daysInLocker: 0, value: 890, weight: '12.5kg', createdAt: '2024-01-15 12:00', deliveredAt: null, batchId: null },
  { id: 'JUM-2024-0458', waybill: 'LQ-2024-01208', customer: 'Kofi Appiah', phone: '+233556667788', destination: 'Accra Mall', locker: 'B-11', size: 'Medium', status: 'expired', pickupCode: '1739', daysInLocker: 7, value: 175, weight: '2.2kg', createdAt: '2024-01-08 08:00', deliveredAt: '2024-01-08 12:00', batchId: null },
  { id: 'JUM-2024-0459', waybill: 'LQ-2024-01209', customer: 'Efua Owusu', phone: '+233558899001', destination: 'Achimota Mall', locker: '-', size: 'Small', status: 'pending', pickupCode: null, daysInLocker: 0, value: 55, weight: '0.4kg', createdAt: '2024-01-15 14:00', deliveredAt: null, batchId: null },
  { id: 'JUM-2024-0460', waybill: 'LQ-2024-01210', customer: 'Kwame Asiedu', phone: '+233551122334', destination: 'Junction Mall', locker: 'J-02', size: 'Large', status: 'delivered_to_locker', pickupCode: '4067', daysInLocker: 2, value: 420, weight: '5.8kg', createdAt: '2024-01-13 07:00', deliveredAt: '2024-01-13 11:00', batchId: 'BSH-004' },
];

export const portalInvoicesData = [
  { id: 'INV-P001', period: 'January 2024', issueDate: '2024-02-01', dueDate: '2024-02-15', packages: 130, amount: 15600, tax: 1872, total: 17472, status: 'pending', pdfUrl: '#' },
  { id: 'INV-P002', period: 'December 2023', issueDate: '2024-01-01', dueDate: '2024-01-15', packages: 115, amount: 13800, tax: 1656, total: 15456, status: 'paid', paidDate: '2024-01-12', pdfUrl: '#' },
  { id: 'INV-P003', period: 'November 2023', issueDate: '2023-12-01', dueDate: '2023-12-15', packages: 98, amount: 11760, tax: 1411, total: 13171, status: 'paid', paidDate: '2023-12-10', pdfUrl: '#' },
  { id: 'INV-P004', period: 'October 2023', issueDate: '2023-11-01', dueDate: '2023-11-15', packages: 105, amount: 12600, tax: 1512, total: 14112, status: 'paid', paidDate: '2023-11-14', pdfUrl: '#' },
];

export const portalWebhookLogsData = [
  { id: 'WH-001', event: 'package.delivered_to_locker', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 14:32:15', responseTime: '120ms', payload: '{"waybill":"LQ-2024-01201","status":"delivered_to_locker","locker":"A-12"}' },
  { id: 'WH-002', event: 'package.picked_up', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 14:28:00', responseTime: '85ms', payload: '{"waybill":"LQ-2024-01205","status":"picked_up"}' },
  { id: 'WH-003', event: 'package.in_transit', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 14:15:30', responseTime: '95ms', payload: '{"waybill":"LQ-2024-01203","status":"in_transit_to_locker"}' },
  { id: 'WH-004', event: 'package.expired', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 500, timestamp: '2024-01-15 12:00:00', responseTime: '5002ms', payload: '{"waybill":"LQ-2024-01208","status":"expired"}', error: 'Timeout' },
  { id: 'WH-005', event: 'batch.processing', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 08:05:00', responseTime: '110ms', payload: '{"batchId":"BSH-001","packages":45,"status":"processing"}' },
];

export const portalRateCard = [
  { size: 'Small', dimensions: '30×20×15 cm', maxWeight: '2 kg', pricePerDay: 8, storageFree: 3, storagePerDay: 2 },
  { size: 'Medium', dimensions: '45×35×25 cm', maxWeight: '5 kg', pricePerDay: 12, storageFree: 3, storagePerDay: 3 },
  { size: 'Large', dimensions: '60×45×35 cm', maxWeight: '10 kg', pricePerDay: 18, storageFree: 3, storagePerDay: 5 },
  { size: 'XLarge', dimensions: '80×60×45 cm', maxWeight: '20 kg', pricePerDay: 25, storageFree: 3, storagePerDay: 8 },
];

export const portalShipmentTrend = [
  { month: 'Aug', shipped: 95, delivered: 92, returned: 3 },
  { month: 'Sep', shipped: 110, delivered: 106, returned: 4 },
  { month: 'Oct', shipped: 105, delivered: 101, returned: 4 },
  { month: 'Nov', shipped: 120, delivered: 117, returned: 3 },
  { month: 'Dec', shipped: 150, delivered: 144, returned: 6 },
  { month: 'Jan', shipped: 130, delivered: 125, returned: 5 },
];
