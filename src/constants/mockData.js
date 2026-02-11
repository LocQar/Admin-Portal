// ============ NOTIFICATIONS ============
export const notifications = [
  { id: 1, title: 'Locker A-20 needs maintenance', type: 'warning', time: '5 min ago', read: false },
  { id: 2, title: 'Dropbox DBX-004 is full', type: 'warning', time: '10 min ago', read: false },
  { id: 3, title: 'New shipment from Jumia (45 packages)', type: 'info', time: '15 min ago', read: false },
  { id: 4, title: 'Package LQ-2024-00005 expired', type: 'error', time: '1 hour ago', read: true },
  { id: 5, title: 'Driver Kwesi completed 12 deliveries', type: 'success', time: '2 hours ago', read: true },
];

// ============ CHART DATA ============
export const terminalData = [
  { month: 'Jan', accra: 600, achimota: 450, kotoka: 300 },
  { month: 'Feb', accra: 750, achimota: 500, kotoka: 350 },
  { month: 'Mar', accra: 680, achimota: 800, kotoka: 400 },
  { month: 'Apr', accra: 900, achimota: 700, kotoka: 380 },
  { month: 'May', accra: 720, achimota: 950, kotoka: 420 },
  { month: 'Jun', accra: 800, achimota: 600, kotoka: 350 },
];

export const hourlyData = [
  { hour: '6AM', packages: 12 }, { hour: '8AM', packages: 45 }, { hour: '10AM', packages: 78 },
  { hour: '12PM', packages: 92 }, { hour: '2PM', packages: 85 }, { hour: '4PM', packages: 110 },
  { hour: '6PM', packages: 95 }, { hour: '8PM', packages: 42 }, { hour: '10PM', packages: 18 },
];

export const pricingRevenueData = [
  { month: 'Aug', standard: 8200, express: 3400, rush: 1200, economy: 2100 },
  { month: 'Sep', standard: 9100, express: 3800, rush: 1500, economy: 2300 },
  { month: 'Oct', standard: 8800, express: 4200, rush: 1800, economy: 2000 },
  { month: 'Nov', standard: 10500, express: 4800, rush: 2200, economy: 2500 },
  { month: 'Dec', standard: 12800, express: 5600, rush: 3100, economy: 2800 },
  { month: 'Jan', standard: 11200, express: 5100, rush: 2600, economy: 2400 },
];

export const msgVolumeData = [
  { date: 'Mon', sms: 420, whatsapp: 380, email: 210 },
  { date: 'Tue', sms: 480, whatsapp: 450, email: 245 },
  { date: 'Wed', sms: 510, whatsapp: 490, email: 260 },
  { date: 'Thu', sms: 390, whatsapp: 370, email: 195 },
  { date: 'Fri', sms: 550, whatsapp: 520, email: 280 },
  { date: 'Sat', sms: 320, whatsapp: 280, email: 140 },
  { date: 'Sun', sms: 180, whatsapp: 150, email: 85 },
];

export const partnerMonthlyData = [
  { month: 'Aug', jumia: 95, melcom: 60, telecel: 30, hubtel: 20 },
  { month: 'Sep', jumia: 110, melcom: 65, telecel: 35, hubtel: 22 },
  { month: 'Oct', jumia: 105, melcom: 70, telecel: 40, hubtel: 25 },
  { month: 'Nov', jumia: 120, melcom: 75, telecel: 38, hubtel: 28 },
  { month: 'Dec', jumia: 150, melcom: 80, telecel: 45, hubtel: 30 },
  { month: 'Jan', jumia: 130, melcom: 78, telecel: 42, hubtel: 32 },
];

export const subscriberGrowthData = [
  { month: 'Sep', count: 3, revenue: 145 },
  { month: 'Oct', count: 5, revenue: 270 },
  { month: 'Nov', count: 6, revenue: 355 },
  { month: 'Dec', count: 8, revenue: 490 },
  { month: 'Jan', count: 9, revenue: 560 },
  { month: 'Feb', count: 10, revenue: 615 },
];

export const subscriberChurnData = {
  churnRate: 10,
  retentionRate: 90,
  avgDuration: 4.2,
  newThisMonth: 2,
  cancelledThisMonth: 1,
};

// ============ PACKAGES ============
export const packagesData = [
  { id: 1, waybill: 'LQ-2024-00001', customer: 'Joe Doe', phone: '+233551399333', email: 'joe@email.com', destination: 'Achimota Mall', locker: 'A-15', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: "Pick 'N' Go", daysInLocker: 2, value: 450, cod: true, weight: '2.5kg', createdAt: '2024-01-15 08:30' },
  { id: 2, waybill: 'LQ-2024-00002', customer: 'Jane Doe', phone: '+233557821456', email: 'jane@email.com', destination: 'Accra Mall', locker: 'B-08', size: 'Large', status: 'in_transit_to_locker', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 320, cod: false, weight: '5.2kg', createdAt: '2024-01-15 09:15' },
  { id: 3, waybill: 'LQ-2024-00003', customer: 'Michael Mensah', phone: '+233549876321', email: 'michael@email.com', destination: 'Dome', locker: '-', size: 'Small', status: 'delivered_to_home', deliveryMethod: 'locker_to_home', product: 'Home Delivery', daysInLocker: 0, value: 180, cod: false, weight: '0.8kg', createdAt: '2024-01-14 14:20' },
  { id: 4, waybill: 'LQ-2024-00004', customer: 'Sarah Asante', phone: '+233551234567', email: 'sarah@email.com', destination: 'Kotoka T3', locker: 'K-22', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: 'Airport Pickup', daysInLocker: 1, value: 890, cod: true, weight: '3.1kg', createdAt: '2024-01-15 07:45' },
  { id: 5, waybill: 'LQ-2024-00005', customer: 'Kwame Boateng', phone: '+233559876543', email: 'kwame@email.com', destination: 'Achimota Mall', locker: 'A-03', size: 'XLarge', status: 'expired', deliveryMethod: 'warehouse_to_locker', product: "Pick 'N' Go", daysInLocker: 7, value: 275, cod: false, weight: '8.5kg', createdAt: '2024-01-08 10:00' },
  { id: 6, waybill: 'LQ-2024-00006', customer: 'Ama Serwaa', phone: '+233542345678', email: 'ama@email.com', destination: 'Accra Mall', locker: '-', size: 'Small', status: 'at_warehouse', deliveryMethod: 'warehouse_to_locker', product: 'Standard', daysInLocker: 0, value: 150, cod: true, weight: '1.2kg', createdAt: '2024-01-15 11:30' },
  { id: 7, waybill: 'LQ-2024-00007', customer: 'Kofi Mensah', phone: '+233551112222', email: 'kofi@email.com', destination: 'West Hills', locker: '-', size: 'Medium', status: 'pending', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 220, cod: false, weight: '2.0kg', createdAt: '2024-01-15 12:00' },
  { id: 8, waybill: 'LQ-2024-00008', customer: 'Efua Owusu', phone: '+233553334444', email: 'efua@email.com', destination: 'Tema', locker: '-', size: 'Large', status: 'in_transit_to_home', deliveryMethod: 'locker_to_home', product: 'Home Delivery', daysInLocker: 0, value: 550, cod: true, weight: '6.5kg', createdAt: '2024-01-15 06:30' },
  { id: 9, waybill: 'LQ-2024-00009', customer: 'Yaw Asiedu', phone: '+233555556666', email: 'yaw@email.com', destination: 'Achimota Mall', locker: '-', size: 'Small', status: 'at_dropbox', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 95, cod: false, weight: '0.5kg', createdAt: '2024-01-15 13:45' },
  { id: 10, waybill: 'LQ-2024-00010', customer: 'Akosua Mensah', phone: '+233557778888', email: 'akosua@email.com', destination: 'Junction Mall', locker: 'J-05', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: 'Standard', daysInLocker: 3, value: 340, cod: false, weight: '2.8kg', createdAt: '2024-01-12 09:00' },
];

// ============ LOCKERS & TERMINALS ============
export const lockersData = [
  { id: 'A-01', terminal: 'Achimota Mall', size: 'Small', status: 'available', temp: 24, battery: 95 },
  { id: 'A-15', terminal: 'Achimota Mall', size: 'Medium', status: 'occupied', temp: 25, battery: 91, package: 'LQ-2024-00001' },
  { id: 'A-20', terminal: 'Achimota Mall', size: 'Large', status: 'maintenance', temp: null, battery: 15 },
  { id: 'B-01', terminal: 'Accra Mall', size: 'Small', status: 'available', temp: 23, battery: 98 },
  { id: 'B-08', terminal: 'Accra Mall', size: 'Large', status: 'reserved', temp: 24, battery: 85 },
  { id: 'K-22', terminal: 'Kotoka T3', size: 'Medium', status: 'occupied', temp: 22, battery: 90, package: 'LQ-2024-00004' },
  { id: 'A-03', terminal: 'Achimota Mall', size: 'XLarge', status: 'occupied', temp: 24, battery: 88, package: 'LQ-2024-00005' },
  { id: 'J-05', terminal: 'Junction Mall', size: 'Medium', status: 'occupied', temp: 23, battery: 92, package: 'LQ-2024-00010' },
];

export const terminalsData = [
  { id: 'TRM-001', name: 'Achimota Mall', location: 'Achimota', region: 'Greater Accra', city: 'Achimota', totalLockers: 120, available: 45, occupied: 68, maintenance: 7, status: 'online', lat: 5.6145, lng: -0.2270 },
  { id: 'TRM-002', name: 'Accra Mall', location: 'Tetteh Quarshie', region: 'Greater Accra', city: 'Accra', totalLockers: 85, available: 32, occupied: 50, maintenance: 3, status: 'online', lat: 5.6280, lng: -0.1750 },
  { id: 'TRM-003', name: 'Kotoka T3', location: 'Airport', region: 'Greater Accra', city: 'Airport', totalLockers: 70, available: 28, occupied: 40, maintenance: 2, status: 'online', lat: 5.6052, lng: -0.1668 },
  { id: 'TRM-004', name: 'West Hills Mall', location: 'Weija', region: 'Greater Accra', city: 'Weija', totalLockers: 60, available: 20, occupied: 35, maintenance: 5, status: 'maintenance', lat: 5.5580, lng: -0.3150 },
  { id: 'TRM-005', name: 'Junction Mall', location: 'Nungua', region: 'Greater Accra', city: 'Nungua', totalLockers: 50, available: 18, occupied: 30, maintenance: 2, status: 'online', lat: 5.5920, lng: -0.0780 },
];

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
export const phonePinData = [
  { phone: '+233551399333', customer: 'Joe Doe', pinnedTerminal: 'Achimota Mall', pinnedAddress: 'ACH-LQ001', pinnedAt: '2024-01-10' },
  { phone: '+233557821456', customer: 'Jane Doe', pinnedTerminal: 'Accra Mall', pinnedAddress: 'ACC-LQ002', pinnedAt: '2024-01-12' },
  { phone: '+233549876321', customer: 'Michael Mensah', pinnedTerminal: 'Achimota Mall', pinnedAddress: 'ACH-LQ001', pinnedAt: '2023-12-05' },
  { phone: '+233551234567', customer: 'Sarah Asante', pinnedTerminal: 'Kotoka T3', pinnedAddress: 'AIR-LQ003', pinnedAt: '2024-01-08' },
  { phone: '+233559876543', customer: 'Kwame Boateng', pinnedTerminal: 'Achimota Mall', pinnedAddress: 'ACH-LQ001', pinnedAt: '2023-11-20' },
  { phone: '+233542345678', customer: 'Ama Serwaa', pinnedTerminal: 'Accra Mall', pinnedAddress: 'ACC-LQ002', pinnedAt: '2024-01-14' },
  { phone: '+233551112222', customer: 'Kofi Mensah', pinnedTerminal: 'West Hills Mall', pinnedAddress: 'WEI-LQ004', pinnedAt: '2024-01-03' },
  { phone: '+233553334444', customer: 'Efua Owusu', pinnedTerminal: 'Junction Mall', pinnedAddress: 'NUN-LQ005', pinnedAt: '2023-12-18' },
];

// Continue in next file due to length...
export * from './mockDataPart2';
