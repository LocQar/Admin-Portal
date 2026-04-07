export const SUBSCRIPTION_PLANS = [
  {
    id: 'PLAN-BASIC',
    name: 'Basic',
    price: 25,
    period: 'month',
    deliveries: 5,
    lockerAccess: 'standard',
    color: '#A8A29E',
    description: '5 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-STD',
    name: 'Standard',
    price: 45,
    period: 'month',
    deliveries: 15,
    lockerAccess: 'standard',
    color: '#7EA8C9',
    description: '15 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-PREM',
    name: 'Premium',
    price: 75,
    period: 'month',
    deliveries: 40,
    lockerAccess: 'priority',
    color: '#B5A0D1',
    description: '40 deliveries/mo, priority lockers'
  },
  {
    id: 'PLAN-UNLIM',
    name: 'Unlimited',
    price: 120,
    period: 'month',
    deliveries: -1,
    lockerAccess: 'priority',
    color: '#D4AA5A',
    description: 'Unlimited deliveries, priority lockers'
  },
];
