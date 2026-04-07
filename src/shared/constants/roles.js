/**
 * CRM Permission Structure:
 * -------------------------
 * crm.view              - View CRM dashboard and reports
 * crm.leads.manage      - Create, edit, delete leads
 * crm.deals.manage      - Create, edit, delete deals
 * crm.contacts.manage   - Create, edit, delete contacts
 * crm.activities.manage - Create, edit, delete activities
 * crm.import            - Import data via CSV
 * crm.export            - Export data to CSV
 * crm.*                 - Full CRM access (all of the above)
 */

export const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 100,
    color: '#3B82F6',
    permissions: ['*']
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    level: 80,
    color: '#D97706',
    permissions: [
      'dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*',
      'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*',
      'crm.*'  // Full CRM access: view, manage leads/deals/contacts/activities, import/export
    ]
  },
  MANAGER: {
    id: 'manager',
    name: 'Branch Manager',
    level: 60,
    color: '#10B981',
    permissions: [
      'dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view',
      'customers.*', 'staff.view', 'reports.view', 'dispatch.*',
      'crm.*'  // Full CRM access
    ]
  },
  AGENT: {
    id: 'agent',
    name: 'Field Agent',
    level: 40,
    color: '#8B5CF6',
    permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view']
  },
  SUPPORT: {
    id: 'support',
    name: 'Support',
    level: 30,
    color: '#EF4444',
    permissions: [
      'dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*',
      'crm.view',           // View CRM data
      'crm.contacts.*',     // Manage contacts
      'crm.activities.*',   // Manage activities (calls, emails, notes)
      'crm.export'          // Export data for reporting
    ]
  },
  VIEWER: {
    id: 'viewer',
    name: 'View Only',
    level: 10,
    color: '#64748B',
    permissions: ['dashboard.view', 'packages.view', 'lockers.view']
  },
};

export const resolveRole = (userRole, customRoles = []) => {
  if (ROLES[userRole]) return ROLES[userRole];
  return customRoles.find(r => r.key === userRole) || null;
};

export const hasPermission = (userRole, permission, customRoles = []) => {
  const role = resolveRole(userRole, customRoles);
  if (!role) return false;
  if (role.permissions.includes('*')) return true;
  if (role.permissions.includes(permission)) return true;
  const [module] = permission.split('.');
  return role.permissions.includes(`${module}.*`);
};
