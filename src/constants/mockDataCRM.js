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
export const crmLeads = [
  { id: 'LEAD-001', name: 'Kofi Mensah', email: 'kofi@techghana.com', phone: '+233 24 567 8901', company: 'TechGhana Ltd', source: 'website', status: 'qualified', assignedTo: 'Ama Owusu', value: 12000, notes: 'Interested in locker deployment for 3 office locations', createdAt: '2025-12-15', lastContactedAt: '2026-01-20' },
  { id: 'LEAD-002', name: 'Abena Darko', email: 'abena@unimail.edu.gh', phone: '+233 20 123 4567', company: 'University of Ghana', source: 'trade_show', status: 'new', assignedTo: 'Kwame Asante', value: 45000, notes: 'Met at logistics expo, wants campus-wide deployment', createdAt: '2026-01-10', lastContactedAt: null },
  { id: 'LEAD-003', name: 'Emmanuel Tetteh', email: 'emmanuel@jumia.com.gh', phone: '+233 27 890 1234', company: 'Jumia Ghana', source: 'referral', status: 'contacted', assignedTo: 'Ama Owusu', value: 85000, notes: 'Referred by existing partner, wants expanded coverage', createdAt: '2025-11-28', lastContactedAt: '2026-01-15' },
  { id: 'LEAD-004', name: 'Fatima Ibrahim', email: 'fatima@accramall.com', phone: '+233 55 234 5678', company: 'Accra Mall', source: 'cold_call', status: 'qualified', assignedTo: 'Daniel Boateng', value: 32000, notes: 'Wants lockers installed in mall premises', createdAt: '2025-12-20', lastContactedAt: '2026-01-18' },
  { id: 'LEAD-005', name: 'Samuel Osei', email: 'samuel@ghanatrade.org', phone: '+233 24 345 6789', company: 'Ghana Trade Hub', source: 'social_media', status: 'contacted', assignedTo: 'Kwame Asante', value: 18000, notes: 'Saw LinkedIn ad, interested in B2B package management', createdAt: '2026-01-05', lastContactedAt: '2026-01-22' },
  { id: 'LEAD-006', name: 'Grace Ampomah', email: 'grace@pharmaplus.gh', phone: '+233 20 456 7890', company: 'PharmaPlus GH', source: 'referral', status: 'new', assignedTo: 'Ama Owusu', value: 22000, notes: 'Pharmacy chain needing secure medication pickup lockers', createdAt: '2026-01-18', lastContactedAt: null },
  { id: 'LEAD-007', name: 'Yaw Acheampong', email: 'yaw@telecelgh.com', phone: '+233 27 567 8901', company: 'Telecel Ghana', source: 'partner', status: 'qualified', assignedTo: 'Daniel Boateng', value: 95000, notes: 'Strategic partnership for telecom retail pickup points', createdAt: '2025-10-15', lastContactedAt: '2026-01-25' },
  { id: 'LEAD-008', name: 'Adwoa Mensah', email: 'adwoa@melcom.com', phone: '+233 55 678 9012', company: 'Melcom Group', source: 'website', status: 'contacted', assignedTo: 'Kwame Asante', value: 55000, notes: 'Retail chain exploring in-store locker solutions', createdAt: '2025-12-01', lastContactedAt: '2026-01-12' },
  { id: 'LEAD-009', name: 'Nana Kweku', email: 'nana@hubtel.com', phone: '+233 24 789 0123', company: 'Hubtel', source: 'trade_show', status: 'unqualified', assignedTo: 'Ama Owusu', value: 0, notes: 'Budget constraints, revisit Q3', createdAt: '2025-11-20', lastContactedAt: '2025-12-10' },
  { id: 'LEAD-010', name: 'Akosua Frimpong', email: 'akosua@stanbic.com.gh', phone: '+233 20 890 1234', company: 'Stanbic Bank GH', source: 'cold_call', status: 'new', assignedTo: 'Daniel Boateng', value: 40000, notes: 'Interested in document pickup lockers for branches', createdAt: '2026-01-22', lastContactedAt: null },
  { id: 'LEAD-011', name: 'Kwesi Ankrah', email: 'kwesi@shoprite.gh', phone: '+233 27 901 2345', company: 'Shoprite Ghana', source: 'referral', status: 'contacted', assignedTo: 'Kwame Asante', value: 28000, notes: 'Grocery click-and-collect locker system', createdAt: '2026-01-08', lastContactedAt: '2026-01-20' },
  { id: 'LEAD-012', name: 'Efua Boateng', email: 'efua@knust.edu.gh', phone: '+233 55 012 3456', company: 'KNUST', source: 'website', status: 'qualified', assignedTo: 'Ama Owusu', value: 35000, notes: 'Student package management for campus', createdAt: '2025-12-10', lastContactedAt: '2026-01-24' },
  { id: 'LEAD-013', name: 'Felix Adjei', email: 'felix@bolt.com.gh', phone: '+233 24 123 4568', company: 'Bolt Ghana', source: 'social_media', status: 'new', assignedTo: 'Daniel Boateng', value: 15000, notes: 'Driver package pickup points', createdAt: '2026-01-25', lastContactedAt: null },
  { id: 'LEAD-014', name: 'Patience Owusu', email: 'patience@ecobank.com', phone: '+233 20 234 5679', company: 'Ecobank Ghana', source: 'partner', status: 'contacted', assignedTo: 'Kwame Asante', value: 60000, notes: 'Banking document secure delivery system', createdAt: '2025-11-15', lastContactedAt: '2026-01-19' },
  { id: 'LEAD-015', name: 'Michael Asare', email: 'michael@glovo.gh', phone: '+233 27 345 6780', company: 'Glovo Ghana', source: 'cold_call', status: 'qualified', assignedTo: 'Ama Owusu', value: 72000, notes: 'Last-mile delivery locker network expansion', createdAt: '2025-12-28', lastContactedAt: '2026-01-23' },
  { id: 'LEAD-016', name: 'Rita Agyei', email: 'rita@mtn.com.gh', phone: '+233 55 456 7891', company: 'MTN Ghana', source: 'trade_show', status: 'contacted', assignedTo: 'Daniel Boateng', value: 110000, notes: 'MoMo integration + locker network partnership', createdAt: '2025-10-20', lastContactedAt: '2026-01-16' },
];

// ============ CRM DEALS ============
export const crmDeals = [
  { id: 'DEAL-001', title: 'Jumia Expanded Coverage', company: 'Jumia Ghana', contactName: 'Emmanuel Tetteh', value: 85000, stage: 'negotiation', probability: 75, assignedTo: 'Ama Owusu', expectedCloseDate: '2026-03-15', createdAt: '2025-12-01', notes: '50 additional locker units across 5 cities' },
  { id: 'DEAL-002', title: 'MTN MoMo Lockers', company: 'MTN Ghana', contactName: 'Rita Agyei', value: 110000, stage: 'proposal', probability: 50, assignedTo: 'Daniel Boateng', expectedCloseDate: '2026-04-01', createdAt: '2025-11-15', notes: 'Mobile money integrated locker payments' },
  { id: 'DEAL-003', title: 'Telecel Retail Pickup', company: 'Telecel Ghana', contactName: 'Yaw Acheampong', value: 95000, stage: 'qualification', probability: 40, assignedTo: 'Daniel Boateng', expectedCloseDate: '2026-05-01', createdAt: '2025-12-20', notes: '20 pickup points at Telecel stores' },
  { id: 'DEAL-004', title: 'University Campus Lockers', company: 'University of Ghana', contactName: 'Abena Darko', value: 45000, stage: 'prospecting', probability: 20, assignedTo: 'Kwame Asante', expectedCloseDate: '2026-06-01', createdAt: '2026-01-10', notes: 'Student dorm and library locations' },
  { id: 'DEAL-005', title: 'KNUST Student Hub', company: 'KNUST', contactName: 'Efua Boateng', value: 35000, stage: 'proposal', probability: 60, assignedTo: 'Ama Owusu', expectedCloseDate: '2026-03-30', createdAt: '2026-01-05', notes: 'Campus-wide student delivery system' },
  { id: 'DEAL-006', title: 'Accra Mall Installation', company: 'Accra Mall', contactName: 'Fatima Ibrahim', value: 32000, stage: 'negotiation', probability: 80, assignedTo: 'Daniel Boateng', expectedCloseDate: '2026-02-28', createdAt: '2025-12-22', notes: 'Ground floor and parking level installations' },
  { id: 'DEAL-007', title: 'Melcom Click & Collect', company: 'Melcom Group', contactName: 'Adwoa Mensah', value: 55000, stage: 'qualification', probability: 35, assignedTo: 'Kwame Asante', expectedCloseDate: '2026-05-15', createdAt: '2026-01-08', notes: 'Online order pickup across 10 stores' },
  { id: 'DEAL-008', title: 'Glovo Last-Mile Network', company: 'Glovo Ghana', contactName: 'Michael Asare', value: 72000, stage: 'proposal', probability: 55, assignedTo: 'Ama Owusu', expectedCloseDate: '2026-04-15', createdAt: '2026-01-02', notes: 'Driver handoff lockers in residential areas' },
  { id: 'DEAL-009', title: 'Ecobank Doc Delivery', company: 'Ecobank Ghana', contactName: 'Patience Owusu', value: 60000, stage: 'prospecting', probability: 25, assignedTo: 'Kwame Asante', expectedCloseDate: '2026-06-30', createdAt: '2025-12-15', notes: 'Secure document and card delivery' },
  { id: 'DEAL-010', title: 'Stanbic Branch Lockers', company: 'Stanbic Bank GH', contactName: 'Akosua Frimpong', value: 40000, stage: 'prospecting', probability: 15, assignedTo: 'Daniel Boateng', expectedCloseDate: '2026-07-01', createdAt: '2026-01-22', notes: 'Branch-level document pickup' },
  { id: 'DEAL-011', title: 'PharmaPlus Rx Lockers', company: 'PharmaPlus GH', contactName: 'Grace Ampomah', value: 22000, stage: 'closed_won', probability: 100, assignedTo: 'Ama Owusu', expectedCloseDate: '2026-01-15', createdAt: '2025-10-01', notes: 'Temperature-controlled medication pickup' },
  { id: 'DEAL-012', title: 'Shoprite Grocery Pickup', company: 'Shoprite Ghana', contactName: 'Kwesi Ankrah', value: 28000, stage: 'closed_won', probability: 100, assignedTo: 'Kwame Asante', expectedCloseDate: '2026-01-20', createdAt: '2025-11-10', notes: 'Cold-chain grocery lockers pilot' },
  { id: 'DEAL-013', title: 'TechGhana Office Deploy', company: 'TechGhana Ltd', contactName: 'Kofi Mensah', value: 12000, stage: 'closed_lost', probability: 0, assignedTo: 'Ama Owusu', expectedCloseDate: '2026-01-10', createdAt: '2025-09-20', notes: 'Lost to competitor — price sensitivity' },
  { id: 'DEAL-014', title: 'Ghana Trade Hub B2B', company: 'Ghana Trade Hub', contactName: 'Samuel Osei', value: 18000, stage: 'negotiation', probability: 65, assignedTo: 'Kwame Asante', expectedCloseDate: '2026-03-01', createdAt: '2026-01-12', notes: 'B2B package routing system' },
];

// ============ CRM CONTACTS ============
export const crmContacts = [
  { id: 'CON-001', name: 'Emmanuel Tetteh', email: 'emmanuel@jumia.com.gh', phone: '+233 27 890 1234', company: 'Jumia Ghana', role: 'Logistics Director', tags: ['enterprise', 'e-commerce'], lastActivity: '2026-01-15', totalDeals: 2, totalValue: 85000, createdAt: '2025-06-10' },
  { id: 'CON-002', name: 'Rita Agyei', email: 'rita@mtn.com.gh', phone: '+233 55 456 7891', company: 'MTN Ghana', role: 'Head of Partnerships', tags: ['enterprise', 'telecom'], lastActivity: '2026-01-16', totalDeals: 1, totalValue: 110000, createdAt: '2025-08-15' },
  { id: 'CON-003', name: 'Yaw Acheampong', email: 'yaw@telecelgh.com', phone: '+233 27 567 8901', company: 'Telecel Ghana', role: 'VP Operations', tags: ['enterprise', 'telecom'], lastActivity: '2026-01-25', totalDeals: 1, totalValue: 95000, createdAt: '2025-07-20' },
  { id: 'CON-004', name: 'Fatima Ibrahim', email: 'fatima@accramall.com', phone: '+233 55 234 5678', company: 'Accra Mall', role: 'Facilities Manager', tags: ['retail', 'property'], lastActivity: '2026-01-18', totalDeals: 1, totalValue: 32000, createdAt: '2025-09-05' },
  { id: 'CON-005', name: 'Abena Darko', email: 'abena@unimail.edu.gh', phone: '+233 20 123 4567', company: 'University of Ghana', role: 'Admin Director', tags: ['education', 'institution'], lastActivity: '2026-01-10', totalDeals: 1, totalValue: 45000, createdAt: '2025-11-01' },
  { id: 'CON-006', name: 'Efua Boateng', email: 'efua@knust.edu.gh', phone: '+233 55 012 3456', company: 'KNUST', role: 'Student Affairs Lead', tags: ['education', 'institution'], lastActivity: '2026-01-24', totalDeals: 1, totalValue: 35000, createdAt: '2025-10-15' },
  { id: 'CON-007', name: 'Adwoa Mensah', email: 'adwoa@melcom.com', phone: '+233 55 678 9012', company: 'Melcom Group', role: 'E-commerce Manager', tags: ['retail', 'e-commerce'], lastActivity: '2026-01-12', totalDeals: 1, totalValue: 55000, createdAt: '2025-09-20' },
  { id: 'CON-008', name: 'Michael Asare', email: 'michael@glovo.gh', phone: '+233 27 345 6780', company: 'Glovo Ghana', role: 'Country Manager', tags: ['delivery', 'startup'], lastActivity: '2026-01-23', totalDeals: 1, totalValue: 72000, createdAt: '2025-11-10' },
  { id: 'CON-009', name: 'Patience Owusu', email: 'patience@ecobank.com', phone: '+233 20 234 5679', company: 'Ecobank Ghana', role: 'Digital Banking Lead', tags: ['finance', 'banking'], lastActivity: '2026-01-19', totalDeals: 1, totalValue: 60000, createdAt: '2025-10-01' },
  { id: 'CON-010', name: 'Akosua Frimpong', email: 'akosua@stanbic.com.gh', phone: '+233 20 890 1234', company: 'Stanbic Bank GH', role: 'Operations Manager', tags: ['finance', 'banking'], lastActivity: '2026-01-22', totalDeals: 1, totalValue: 40000, createdAt: '2025-12-01' },
  { id: 'CON-011', name: 'Grace Ampomah', email: 'grace@pharmaplus.gh', phone: '+233 20 456 7890', company: 'PharmaPlus GH', role: 'COO', tags: ['healthcare', 'retail'], lastActivity: '2026-01-15', totalDeals: 1, totalValue: 22000, createdAt: '2025-07-10' },
  { id: 'CON-012', name: 'Kwesi Ankrah', email: 'kwesi@shoprite.gh', phone: '+233 27 901 2345', company: 'Shoprite Ghana', role: 'Supply Chain Lead', tags: ['retail', 'grocery'], lastActivity: '2026-01-20', totalDeals: 1, totalValue: 28000, createdAt: '2025-08-20' },
  { id: 'CON-013', name: 'Kofi Mensah', email: 'kofi@techghana.com', phone: '+233 24 567 8901', company: 'TechGhana Ltd', role: 'CEO', tags: ['tech', 'startup'], lastActivity: '2026-01-20', totalDeals: 1, totalValue: 12000, createdAt: '2025-06-01' },
  { id: 'CON-014', name: 'Samuel Osei', email: 'samuel@ghanatrade.org', phone: '+233 24 345 6789', company: 'Ghana Trade Hub', role: 'Business Dev Manager', tags: ['trade', 'government'], lastActivity: '2026-01-22', totalDeals: 1, totalValue: 18000, createdAt: '2025-11-15' },
  { id: 'CON-015', name: 'Felix Adjei', email: 'felix@bolt.com.gh', phone: '+233 24 123 4568', company: 'Bolt Ghana', role: 'Partnerships Lead', tags: ['delivery', 'tech'], lastActivity: '2026-01-25', totalDeals: 0, totalValue: 0, createdAt: '2025-12-20' },
  { id: 'CON-016', name: 'Nana Kweku', email: 'nana@hubtel.com', phone: '+233 24 789 0123', company: 'Hubtel', role: 'Product Manager', tags: ['fintech', 'tech'], lastActivity: '2025-12-10', totalDeals: 0, totalValue: 0, createdAt: '2025-09-15' },
  { id: 'CON-017', name: 'Ama Serwaa', email: 'ama@vodafone.com.gh', phone: '+233 20 567 8902', company: 'Vodafone Ghana', role: 'Enterprise Sales', tags: ['telecom', 'enterprise'], lastActivity: '2026-01-14', totalDeals: 0, totalValue: 0, createdAt: '2025-12-05' },
  { id: 'CON-018', name: 'Bernard Koomson', email: 'bernard@fidelity.gh', phone: '+233 55 789 0124', company: 'Fidelity Bank', role: 'Digital Lead', tags: ['finance', 'banking'], lastActivity: '2026-01-08', totalDeals: 0, totalValue: 0, createdAt: '2026-01-02' },
  { id: 'CON-019', name: 'Priscilla Danso', email: 'priscilla@maxmart.gh', phone: '+233 27 012 3457', company: 'MaxMart', role: 'Store Manager', tags: ['retail', 'grocery'], lastActivity: '2026-01-11', totalDeals: 0, totalValue: 0, createdAt: '2025-11-25' },
  { id: 'CON-020', name: 'Isaac Appiah', email: 'isaac@calbank.net', phone: '+233 24 234 5680', company: 'CalBank', role: 'Branch Head', tags: ['finance', 'banking'], lastActivity: '2026-01-06', totalDeals: 0, totalValue: 0, createdAt: '2025-12-12' },
];

// ============ CRM ACTIVITIES ============
export const crmActivities = [
  { id: 'ACT-001', type: 'call', subject: 'Discovery call with Jumia', description: 'Discussed expanded coverage requirements across 5 cities', contactName: 'Emmanuel Tetteh', dealTitle: 'Jumia Expanded Coverage', assignedTo: 'Ama Owusu', status: 'completed', dueDate: '2026-01-15', completedAt: '2026-01-15', createdAt: '2026-01-14' },
  { id: 'ACT-002', type: 'email', subject: 'Proposal sent to MTN', description: 'Sent detailed proposal for MoMo locker integration', contactName: 'Rita Agyei', dealTitle: 'MTN MoMo Lockers', assignedTo: 'Daniel Boateng', status: 'completed', dueDate: '2026-01-16', completedAt: '2026-01-16', createdAt: '2026-01-15' },
  { id: 'ACT-003', type: 'meeting', subject: 'Site visit at Accra Mall', description: 'Inspect ground floor and parking level for locker installation', contactName: 'Fatima Ibrahim', dealTitle: 'Accra Mall Installation', assignedTo: 'Daniel Boateng', status: 'scheduled', dueDate: '2026-02-05', completedAt: null, createdAt: '2026-01-20' },
  { id: 'ACT-004', type: 'task', subject: 'Prepare KNUST proposal deck', description: 'Create customized proposal for student delivery system', contactName: 'Efua Boateng', dealTitle: 'KNUST Student Hub', assignedTo: 'Ama Owusu', status: 'overdue', dueDate: '2026-01-25', completedAt: null, createdAt: '2026-01-18' },
  { id: 'ACT-005', type: 'call', subject: 'Follow up with Telecel', description: 'Discuss retail pickup point requirements and timeline', contactName: 'Yaw Acheampong', dealTitle: 'Telecel Retail Pickup', assignedTo: 'Daniel Boateng', status: 'scheduled', dueDate: '2026-02-03', completedAt: null, createdAt: '2026-01-25' },
  { id: 'ACT-006', type: 'note', subject: 'Melcom pricing discussion', description: 'They want volume discount for 10+ store deployment', contactName: 'Adwoa Mensah', dealTitle: 'Melcom Click & Collect', assignedTo: 'Kwame Asante', status: 'completed', dueDate: '2026-01-12', completedAt: '2026-01-12', createdAt: '2026-01-12' },
  { id: 'ACT-007', type: 'email', subject: 'Contract draft to Glovo', description: 'Sent partnership agreement draft for review', contactName: 'Michael Asare', dealTitle: 'Glovo Last-Mile Network', assignedTo: 'Ama Owusu', status: 'completed', dueDate: '2026-01-23', completedAt: '2026-01-23', createdAt: '2026-01-22' },
  { id: 'ACT-008', type: 'meeting', subject: 'Quarterly review with Ecobank', description: 'Present document delivery locker concept and ROI analysis', contactName: 'Patience Owusu', dealTitle: 'Ecobank Doc Delivery', assignedTo: 'Kwame Asante', status: 'scheduled', dueDate: '2026-02-10', completedAt: null, createdAt: '2026-01-19' },
  { id: 'ACT-009', type: 'task', subject: 'Update Jumia pricing model', description: 'Revise per-unit pricing based on 50-unit volume', contactName: 'Emmanuel Tetteh', dealTitle: 'Jumia Expanded Coverage', assignedTo: 'Ama Owusu', status: 'completed', dueDate: '2026-01-20', completedAt: '2026-01-19', createdAt: '2026-01-16' },
  { id: 'ACT-010', type: 'call', subject: 'Cold call to Stanbic', description: 'Initial outreach about document pickup lockers', contactName: 'Akosua Frimpong', dealTitle: 'Stanbic Branch Lockers', assignedTo: 'Daniel Boateng', status: 'completed', dueDate: '2026-01-22', completedAt: '2026-01-22', createdAt: '2026-01-21' },
  { id: 'ACT-011', type: 'email', subject: 'Welcome email to Felix', description: 'Introduction email with LocQar capabilities overview', contactName: 'Felix Adjei', dealTitle: null, assignedTo: 'Daniel Boateng', status: 'completed', dueDate: '2026-01-25', completedAt: '2026-01-25', createdAt: '2026-01-25' },
  { id: 'ACT-012', type: 'meeting', subject: 'Demo for University of Ghana', description: 'Product demo showcasing campus locker management system', contactName: 'Abena Darko', dealTitle: 'University Campus Lockers', assignedTo: 'Kwame Asante', status: 'scheduled', dueDate: '2026-02-08', completedAt: null, createdAt: '2026-01-22' },
  { id: 'ACT-013', type: 'task', subject: 'Prepare MTN technical specs', description: 'Document API integration requirements for MoMo payments', contactName: 'Rita Agyei', dealTitle: 'MTN MoMo Lockers', assignedTo: 'Daniel Boateng', status: 'overdue', dueDate: '2026-01-28', completedAt: null, createdAt: '2026-01-20' },
  { id: 'ACT-014', type: 'call', subject: 'Negotiation call with Ghana Trade', description: 'Discuss final terms and contract value', contactName: 'Samuel Osei', dealTitle: 'Ghana Trade Hub B2B', assignedTo: 'Kwame Asante', status: 'completed', dueDate: '2026-01-22', completedAt: '2026-01-22', createdAt: '2026-01-20' },
  { id: 'ACT-015', type: 'note', subject: 'Accra Mall requirements update', description: 'They added requirement for 24/7 CCTV monitoring near lockers', contactName: 'Fatima Ibrahim', dealTitle: 'Accra Mall Installation', assignedTo: 'Daniel Boateng', status: 'completed', dueDate: '2026-01-18', completedAt: '2026-01-18', createdAt: '2026-01-18' },
  { id: 'ACT-016', type: 'email', subject: 'PharmaPlus deployment schedule', description: 'Sent installation timeline for first 5 pharmacy locations', contactName: 'Grace Ampomah', dealTitle: 'PharmaPlus Rx Lockers', assignedTo: 'Ama Owusu', status: 'completed', dueDate: '2026-01-15', completedAt: '2026-01-15', createdAt: '2026-01-14' },
  { id: 'ACT-017', type: 'meeting', subject: 'Shoprite pilot review', description: 'Review cold-chain locker pilot results and discuss expansion', contactName: 'Kwesi Ankrah', dealTitle: 'Shoprite Grocery Pickup', assignedTo: 'Kwame Asante', status: 'completed', dueDate: '2026-01-20', completedAt: '2026-01-20', createdAt: '2026-01-17' },
  { id: 'ACT-018', type: 'task', subject: 'Create Bolt partnership brief', description: 'Prepare partnership opportunity document for driver pickups', contactName: 'Felix Adjei', dealTitle: null, assignedTo: 'Daniel Boateng', status: 'scheduled', dueDate: '2026-02-01', completedAt: null, createdAt: '2026-01-26' },
  { id: 'ACT-019', type: 'call', subject: 'Check in with Vodafone', description: 'Exploratory call about enterprise locker solutions', contactName: 'Ama Serwaa', dealTitle: null, assignedTo: 'Kwame Asante', status: 'scheduled', dueDate: '2026-02-04', completedAt: null, createdAt: '2026-01-24' },
  { id: 'ACT-020', type: 'email', subject: 'Fidelity Bank intro deck', description: 'Sent digital banking locker solution overview', contactName: 'Bernard Koomson', dealTitle: null, assignedTo: 'Ama Owusu', status: 'completed', dueDate: '2026-01-08', completedAt: '2026-01-08', createdAt: '2026-01-07' },
  { id: 'ACT-021', type: 'task', subject: 'Update CRM pipeline report', description: 'Monthly pipeline report for management review', contactName: null, dealTitle: null, assignedTo: 'Ama Owusu', status: 'overdue', dueDate: '2026-01-30', completedAt: null, createdAt: '2026-01-25' },
  { id: 'ACT-022', type: 'meeting', subject: 'Team sales standup', description: 'Weekly CRM pipeline review with sales team', contactName: null, dealTitle: null, assignedTo: 'Kwame Asante', status: 'scheduled', dueDate: '2026-02-03', completedAt: null, createdAt: '2026-01-27' },
  { id: 'ACT-023', type: 'call', subject: 'MaxMart follow-up', description: 'Discuss grocery locker options for MaxMart stores', contactName: 'Priscilla Danso', dealTitle: null, assignedTo: 'Ama Owusu', status: 'scheduled', dueDate: '2026-02-06', completedAt: null, createdAt: '2026-01-26' },
  { id: 'ACT-024', type: 'note', subject: 'CalBank budget cycle info', description: 'Q2 budget cycle starts April — revisit then', contactName: 'Isaac Appiah', dealTitle: null, assignedTo: 'Kwame Asante', status: 'completed', dueDate: '2026-01-06', completedAt: '2026-01-06', createdAt: '2026-01-06' },
  { id: 'ACT-025', type: 'email', subject: 'Jumia contract revision', description: 'Sent revised contract with updated SLA terms', contactName: 'Emmanuel Tetteh', dealTitle: 'Jumia Expanded Coverage', assignedTo: 'Ama Owusu', status: 'completed', dueDate: '2026-01-27', completedAt: '2026-01-27', createdAt: '2026-01-26' },
];

// ============ CRM CHART DATA ============
export const pipelineChartData = [
  { stage: 'Prospecting', value: 130000, deals: 3 },
  { stage: 'Qualification', value: 150000, deals: 2 },
  { stage: 'Proposal', value: 217000, deals: 3 },
  { stage: 'Negotiation', value: 203000, deals: 3 },
  { stage: 'Won', value: 50000, deals: 2 },
  { stage: 'Lost', value: 12000, deals: 1 },
];

export const crmMonthlyData = [
  { month: 'Aug', won: 0, lost: 0, new: 3 },
  { month: 'Sep', won: 0, lost: 1, new: 2 },
  { month: 'Oct', won: 1, lost: 0, new: 4 },
  { month: 'Nov', won: 0, lost: 0, new: 3 },
  { month: 'Dec', won: 1, lost: 0, new: 5 },
  { month: 'Jan', won: 2, lost: 1, new: 4 },
];

export const activityBreakdownData = [
  { name: 'Calls', value: 7 },
  { name: 'Emails', value: 6 },
  { name: 'Meetings', value: 6 },
  { name: 'Tasks', value: 4 },
  { name: 'Notes', value: 3 },
];
