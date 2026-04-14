// ============ NOTIFICATIONS ============
export const notifications = [];

// ============ CHART DATA ============
export const terminalData = [];

export const hourlyData = [];

export const pricingRevenueData = [];

export const msgVolumeData = [];

export const partnerMonthlyData = [];

export const subscriberGrowthData = [];

export const subscriberChurnData = {};

// ============ PACKAGES ============
export const packagesData = [];

// ============ LOCKERS & TERMINALS ============
export const lockersData = [];

export const terminalsData = [];

// Portal terminal availability (computed from terminalsData)
export const portalTerminalAvailability = [];

// Utility functions for address system
export const getTerminalAddress = (terminal) => {
  const city = (terminal.city || terminal.location).substring(0, 3).toUpperCase();
  const num = terminal.id.replace('TRM-', '');
  return `${city}-LQ${num}`;
};

export const getLockerAddress = (lockerId, terminalName) => {
  const terminal = terminalsData.find(t => t.name === terminalName);
  if (!terminal) return null;
  const city = (terminal.city || terminal.location).substring(0, 3).toUpperCase();
  const num = lockerId.replace(/[A-Z]-/i, '').padStart(3, '0');
  return `${city}-LQ${num}`;
};

// Phone-to-Locker Pinning
export const phonePinData = [];

// ============ COURIERS (Winnsen API Aligned) ============
export const couriersData = [];

// ============ TERMINAL ERRORS (Winnsen API Aligned) ============
export const terminalErrorsData = [];

// Continue in next file due to length...
export * from './mockDataPart2';
