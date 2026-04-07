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
  { id: 1, waybill: 'LQ-2024-00001', customer: 'Joe Doe', phone: '+233551399333', email: 'joe@email.com', destination: 'Achimota Mall', locker: 'A-15', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: "Pick 'N' Go", daysInLocker: 2, value: 450, cod: true, weight: '2.5kg', createdAt: '2024-01-15 08:30', pickupPin: '482931' },
  { id: 2, waybill: 'LQ-2024-00002', customer: 'Jane Doe', phone: '+233557821456', email: 'jane@email.com', destination: 'Accra Mall', locker: 'B-08', size: 'Large', status: 'in_transit_to_locker', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 320, cod: false, weight: '5.2kg', createdAt: '2024-01-15 09:15' },
  { id: 3, waybill: 'LQ-2024-00003', customer: 'Michael Mensah', phone: '+233549876321', email: 'michael@email.com', destination: 'Dome', locker: '-', size: 'Small', status: 'delivered_to_home', deliveryMethod: 'locker_to_home', product: 'Home Delivery', daysInLocker: 0, value: 180, cod: false, weight: '0.8kg', createdAt: '2024-01-14 14:20' },
  { id: 4, waybill: 'LQ-2024-00004', customer: 'Sarah Asante', phone: '+233551234567', email: 'sarah@email.com', destination: 'Kotoka T3', locker: 'K-22', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: 'Airport Pickup', daysInLocker: 1, value: 890, cod: true, weight: '3.1kg', createdAt: '2024-01-15 07:45', pickupPin: '739045' },
  { id: 5, waybill: 'LQ-2024-00005', customer: 'Kwame Boateng', phone: '+233559876543', email: 'kwame@email.com', destination: 'Achimota Mall', locker: 'A-03', size: 'XLarge', status: 'expired', deliveryMethod: 'warehouse_to_locker', product: "Pick 'N' Go", daysInLocker: 7, value: 275, cod: false, weight: '8.5kg', createdAt: '2024-01-08 10:00' },
  { id: 6, waybill: 'LQ-2024-00006', customer: 'Ama Serwaa', phone: '+233542345678', email: 'ama@email.com', destination: 'Accra Mall', locker: '-', size: 'Small', status: 'at_warehouse', deliveryMethod: 'warehouse_to_locker', product: 'Standard', daysInLocker: 0, value: 150, cod: true, weight: '1.2kg', createdAt: '2024-01-15 11:30' },
  { id: 7, waybill: 'LQ-2024-00007', customer: 'Kofi Mensah', phone: '+233551112222', email: 'kofi@email.com', destination: 'West Hills', locker: '-', size: 'Medium', status: 'pending', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 220, cod: false, weight: '2.0kg', createdAt: '2024-01-15 12:00' },
  { id: 8, waybill: 'LQ-2024-00008', customer: 'Efua Owusu', phone: '+233553334444', email: 'efua@email.com', destination: 'Tema', locker: '-', size: 'Large', status: 'in_transit_to_home', deliveryMethod: 'locker_to_home', product: 'Home Delivery', daysInLocker: 0, value: 550, cod: true, weight: '6.5kg', createdAt: '2024-01-15 06:30' },
  { id: 9, waybill: 'LQ-2024-00009', customer: 'Yaw Asiedu', phone: '+233555556666', email: 'yaw@email.com', destination: 'Achimota Mall', locker: '-', size: 'Small', status: 'at_dropbox', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 95, cod: false, weight: '0.5kg', createdAt: '2024-01-15 13:45' },
  { id: 10, waybill: 'LQ-2024-00010', customer: 'Akosua Mensah', phone: '+233557778888', email: 'akosua@email.com', destination: 'Junction Mall', locker: 'J-05', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: 'Standard', daysInLocker: 3, value: 340, cod: false, weight: '2.8kg', createdAt: '2024-01-12 09:00', pickupPin: '261874' },
];

// ============ LOCKERS & TERMINALS ============
export const lockersData = [
  { id: 'A-01', terminal: 'Achimota Mall', terminalSn: 'WNS-ACH-001', doorNo: 1, size: 2, sizeLabel: 'Small', status: 'available', enabled: 1, occupied: 0, opened: 0, temp: 24, battery: 95 },
  { id: 'A-15', terminal: 'Achimota Mall', terminalSn: 'WNS-ACH-001', doorNo: 15, size: 1, sizeLabel: 'Medium', status: 'occupied', enabled: 1, occupied: 1, opened: 0, temp: 25, battery: 91, package: 'LQ-2024-00001' },
  { id: 'A-20', terminal: 'Achimota Mall', terminalSn: 'WNS-ACH-001', doorNo: 20, size: 0, sizeLabel: 'Large', status: 'maintenance', enabled: 0, occupied: 0, opened: 0, temp: null, battery: 15 },
  { id: 'B-01', terminal: 'Accra Mall', terminalSn: 'WNS-ACC-002', doorNo: 1, size: 2, sizeLabel: 'Small', status: 'available', enabled: 1, occupied: 0, opened: 0, temp: 23, battery: 98 },
  { id: 'B-08', terminal: 'Accra Mall', terminalSn: 'WNS-ACC-002', doorNo: 8, size: 0, sizeLabel: 'Large', status: 'reserved', enabled: 1, occupied: 1, opened: 0, temp: 24, battery: 85 },
  { id: 'K-22', terminal: 'Kotoka T3', terminalSn: 'WNS-KOT-003', doorNo: 22, size: 1, sizeLabel: 'Medium', status: 'occupied', enabled: 1, occupied: 1, opened: 0, temp: 22, battery: 90, package: 'LQ-2024-00004' },
  { id: 'A-03', terminal: 'Achimota Mall', terminalSn: 'WNS-ACH-001', doorNo: 3, size: 4, sizeLabel: 'XLarge', status: 'occupied', enabled: 1, occupied: 1, opened: 0, temp: 24, battery: 88, package: 'LQ-2024-00005' },
  { id: 'J-05', terminal: 'Junction Mall', terminalSn: 'WNS-JUN-005', doorNo: 5, size: 1, sizeLabel: 'Medium', status: 'occupied', enabled: 1, occupied: 1, opened: 0, temp: 23, battery: 92, package: 'LQ-2024-00010' },
];

export const terminalsData = [
  { id: 'TRM-001', sn: 'WNS-ACH-001', name: 'Achimota Mall', location: 'Achimota', region: 'Greater Accra', city: 'Achimota', totalLockers: 120, available: 45, occupied: 68, maintenance: 7, status: 'online', connect: 1, lat: 5.6145, lng: -0.2270 },
  { id: 'TRM-002', sn: 'WNS-ACC-002', name: 'Accra Mall', location: 'Tetteh Quarshie', region: 'Greater Accra', city: 'Accra', totalLockers: 85, available: 32, occupied: 50, maintenance: 3, status: 'online', connect: 1, lat: 5.6280, lng: -0.1750 },
  { id: 'TRM-003', sn: 'WNS-KOT-003', name: 'Kotoka T3', location: 'Airport', region: 'Greater Accra', city: 'Airport', totalLockers: 70, available: 28, occupied: 40, maintenance: 2, status: 'online', connect: 1, lat: 5.6052, lng: -0.1668 },
  { id: 'TRM-004', sn: 'WNS-WHM-004', name: 'West Hills Mall', location: 'Weija', region: 'Greater Accra', city: 'Weija', totalLockers: 60, available: 20, occupied: 35, maintenance: 5, status: 'maintenance', connect: 0, lat: 5.5580, lng: -0.3150 },
  { id: 'TRM-005', sn: 'WNS-JUN-005', name: 'Junction Mall', location: 'Nungua', region: 'Greater Accra', city: 'Nungua', totalLockers: 50, available: 18, occupied: 30, maintenance: 2, status: 'online', connect: 1, lat: 5.5920, lng: -0.0780 },
];

// Portal terminal availability (computed from terminalsData)
export const portalTerminalAvailability = terminalsData.map(t => ({
  ...t,
  small: { total: Math.floor(t.totalLockers * 0.3), available: Math.floor(t.available * 0.35) },
  medium: { total: Math.floor(t.totalLockers * 0.35), available: Math.floor(t.available * 0.3) },
  large: { total: Math.floor(t.totalLockers * 0.25), available: Math.floor(t.available * 0.25) },
  xlarge: { total: Math.floor(t.totalLockers * 0.1), available: Math.floor(t.available * 0.1) },
}));

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

// ============ COURIERS (Winnsen API Aligned) ============
export const couriersData = [
  { id: 1, name: 'Kwesi Asante', title: 'Lead Courier', status: 1, phone: '+233551234567', email: 'kwesi.a@locqar.com', qrCode: 'CUR-QR-001', cardNo: 'CRD-001', terminal: 'Achimota Mall', zone: 'North Accra', joinDate: '2023-03-15', totalDeliveries: 412, rating: 4.8, vehicleType: 'Motorcycle', vehiclePlate: 'GW-1234-23', notes: 'Senior courier, team lead.' },
  { id: 2, name: 'Kofi Mensah', title: 'Senior Courier', status: 1, phone: '+233559876543', email: 'kofi.m@locqar.com', qrCode: 'CUR-QR-002', cardNo: 'CRD-002', terminal: 'Kotoka T3', zone: 'Airport Area', joinDate: '2023-05-20', totalDeliveries: 378, rating: 4.6, vehicleType: 'Bicycle', vehiclePlate: null, notes: 'Handles airport-area deliveries.' },
  { id: 3, name: 'Yaw Boateng', title: 'Courier', status: 0, phone: '+233542345678', email: 'yaw.b@locqar.com', qrCode: 'CUR-QR-003', cardNo: 'CRD-003', terminal: 'West Hills Mall', zone: 'Weija', joinDate: '2023-07-01', totalDeliveries: 189, rating: 3.9, vehicleType: 'Motorcycle', vehiclePlate: 'GR-4567-22', notes: 'On suspension pending investigation.' },
  { id: 4, name: 'Kwame Asiedu', title: 'Courier', status: 1, phone: '+233553456789', email: 'kwame.asi@locqar.com', qrCode: 'CUR-QR-004', cardNo: 'CRD-004', terminal: 'West Hills Mall', zone: 'Weija', joinDate: '2023-04-10', totalDeliveries: 295, rating: 4.5, vehicleType: 'Motorcycle', vehiclePlate: 'GW-8821-23', notes: '' },
  { id: 5, name: 'Ama Serwaa', title: 'Senior Courier', status: 1, phone: '+233542345679', email: 'ama.s@locqar.com', qrCode: 'CUR-QR-005', cardNo: 'CRD-005', terminal: 'Accra Mall', zone: 'Central Accra', joinDate: '2023-06-18', totalDeliveries: 443, rating: 4.9, vehicleType: 'Bicycle', vehiclePlate: null, notes: 'Top-rated courier.' },
  { id: 6, name: 'Fiifi Atta', title: 'Courier', status: 0, phone: '+233551000011', email: 'fiifi.a@locqar.com', qrCode: 'CUR-QR-006', cardNo: 'CRD-006', terminal: 'Junction Mall', zone: 'Nungua', joinDate: '2023-09-05', totalDeliveries: 102, rating: 3.5, vehicleType: 'Motorcycle', vehiclePlate: 'GE-3322-23', notes: 'Disabled pending retraining.' },
  { id: 7, name: 'Efua Amponsah', title: 'Courier', status: 1, phone: '+233557771234', email: 'efua.amp@locqar.com', qrCode: 'CUR-QR-007', cardNo: 'CRD-007', terminal: 'Achimota Mall', zone: 'North Accra', joinDate: '2023-11-12', totalDeliveries: 211, rating: 4.3, vehicleType: 'Bicycle', vehiclePlate: null, notes: '' },
  { id: 8, name: 'Adjei Bonsu', title: 'Junior Courier', status: 1, phone: '+233554443322', email: 'adjei.b@locqar.com', qrCode: 'CUR-QR-008', cardNo: 'CRD-008', terminal: 'Accra Mall', zone: 'Central Accra', joinDate: '2024-01-08', totalDeliveries: 87, rating: 4.1, vehicleType: 'Motorcycle', vehiclePlate: 'GW-0099-24', notes: 'Newest team member.' },
  { id: 9, name: 'Nana Owusu', title: 'Senior Courier', status: 1, phone: '+233559998877', email: 'nana.o@locqar.com', qrCode: 'CUR-QR-009', cardNo: 'CRD-009', terminal: 'Junction Mall', zone: 'Nungua', joinDate: '2023-08-22', totalDeliveries: 320, rating: 4.7, vehicleType: 'Motorcycle', vehiclePlate: 'GE-7711-23', notes: '' },
  { id: 10, name: 'Akosua Darko', title: 'Courier', status: 0, phone: '+233541122334', email: 'akosua.d@locqar.com', qrCode: 'CUR-QR-010', cardNo: 'CRD-010', terminal: 'Kotoka T3', zone: 'Airport Area', joinDate: '2023-10-30', totalDeliveries: 155, rating: 3.8, vehicleType: 'Bicycle', vehiclePlate: null, notes: 'On extended leave.' },
];

// ============ TERMINAL ERRORS (Winnsen API Aligned) ============
export const terminalErrorsData = [
  { id: 1, createTime: '2024-01-15 14:32:00', errorCode: 'E-101', describe: 'Door sensor malfunction - Door 20', terminal: 'WNS-ACH-001', terminalName: 'Achimota Mall', doorNo: 20 },
  { id: 2, createTime: '2024-01-15 12:15:00', errorCode: 'E-205', describe: 'Network timeout during payment verification', terminal: 'WNS-WHM-004', terminalName: 'West Hills Mall', doorNo: null },
  { id: 3, createTime: '2024-01-15 10:45:00', errorCode: 'E-102', describe: 'Door failed to lock after deposit', terminal: 'WNS-ACC-002', terminalName: 'Accra Mall', doorNo: 8 },
  { id: 4, createTime: '2024-01-14 18:20:00', errorCode: 'E-301', describe: 'QR scanner unresponsive', terminal: 'WNS-KOT-003', terminalName: 'Kotoka T3', doorNo: null },
  { id: 5, createTime: '2024-01-14 09:30:00', errorCode: 'E-103', describe: 'Door stuck open - manual reset required', terminal: 'WNS-ACH-001', terminalName: 'Achimota Mall', doorNo: 3 },
  { id: 6, createTime: '2024-01-13 16:00:00', errorCode: 'E-401', describe: 'Temperature sensor reading out of range', terminal: 'WNS-JUN-005', terminalName: 'Junction Mall', doorNo: 5 },
  { id: 7, createTime: '2024-01-13 11:45:00', errorCode: 'E-206', describe: 'API callback failed - courier dropoff event', terminal: 'WNS-ACC-002', terminalName: 'Accra Mall', doorNo: 1 },
];

// Continue in next file due to length...
export * from './mockDataPart2';
