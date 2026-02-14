import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { DELIVERY_METHODS } from '../../constants';

export const PackageStatusFlow = ({ status, deliveryMethod }) => {
  const method = DELIVERY_METHODS[deliveryMethod] || DELIVERY_METHODS.warehouse_to_locker;

  let steps = deliveryMethod === 'dropbox_to_locker'
    ? ['Pending', 'At Dropbox', 'In Transit', 'In Locker', 'Picked Up']
    : deliveryMethod === 'locker_to_home'
    ? ['Pending', 'At Warehouse', 'In Transit', 'Delivered']
    : ['Pending', 'At Warehouse', 'In Transit', 'In Locker', 'Picked Up'];

  const statusMap = {
    pending: 0,
    at_warehouse: 1,
    at_dropbox: 1,
    in_transit_to_locker: 2,
    in_transit_to_home: 2,
    delivered_to_locker: 3,
    delivered_to_home: 3,
    picked_up: 4
  };

  const currentStep = statusMap[status] ?? 0;

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${idx === currentStep ? 'ring-2 ring-offset-1' : ''}`}
              style={{
                backgroundColor: idx <= currentStep ? method.color : 'rgba(107, 114, 128, 0.2)',
                ringColor: method.color
              }}
            >
              {idx < currentStep ? (
                <CheckCircle size={14} style={{ color: '#1C1917' }} />
              ) : idx === currentStep ? (
                <Circle size={8} style={{ color: '#1C1917', fill: '#1C1917' }} />
              ) : (
                <Circle size={8} style={{ color: 'rgba(107, 114, 128, 0.5)' }} />
              )}
            </div>
            <span
              className={`text-xs mt-1 ${idx === currentStep ? 'font-medium' : ''}`}
              style={{ color: idx <= currentStep ? method.color : '#78716C' }}
            >
              {step}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className="flex-1 h-0.5 -mt-4"
              style={{ backgroundColor: idx < currentStep ? method.color : 'rgba(107, 114, 128, 0.2)' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
