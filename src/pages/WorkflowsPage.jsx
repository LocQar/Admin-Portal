import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Package, Truck, ArrowRight, ArrowDown, Box, Phone, CreditCard,
  QrCode, Scan, DoorOpen, Bell, RefreshCw, Globe, Users, ShoppingCart,
  ChevronRight, CheckCircle, AlertTriangle, Clock, MapPin, Lock,
  Unlock, Mail, DollarSign, RotateCcw, Warehouse, Home, Building2,
  LogIn, Maximize2, CircleDot
} from 'lucide-react';

// ============ WORKFLOW DEFINITIONS ============

const WORKFLOWS = [
  { id: 'delivery', label: 'Package Delivery', icon: Truck },
  { id: 'request', label: 'Request for Delivery', icon: Phone },
  { id: 'cod', label: 'Cash On Delivery', icon: CreditCard },
  { id: 'returns', label: 'Package Returns', icon: RotateCcw },
  { id: 'international', label: 'International Pickup', icon: Globe },
  { id: 'courier', label: 'Courier Drop-off', icon: Scan },
];

// Node types: 'start', 'process', 'decision', 'api', 'notification', 'end', 'action'
const buildWorkflowData = (theme) => ({
  delivery: {
    title: 'Package Delivery Flow',
    description: 'End-to-end package lifecycle from distribution center to customer pickup, including failed delivery and return-to-source handling.',
    apis: ['Data Collection API', 'Drop off Request API', 'Courier Drop-off API', 'Recipient Pickup API', 'Package Recall API', 'Failed Delivery API', 'Return To Source API', 'Remittance API'],
    nodes: [
      { id: 'd1', label: 'Delivery to Distribution Center', type: 'start', icon: Warehouse, row: 0, col: 0 },
      { id: 'd2', label: 'Receiving & Scan into Inventory', type: 'process', icon: Scan, row: 0, col: 1,
        details: '1. Order/Waybill Number\n2. Phone Number\n3. Drop off Location\n4. Amount (if COD)' },
      { id: 'd3', label: 'Pull Package for Distribution', type: 'process', icon: Package, row: 0, col: 2 },
      { id: 'd4', label: 'Drop off in LocQar', type: 'action', icon: Box, row: 0, col: 3 },
      { id: 'd5', label: 'Send Notification to Recipient', type: 'notification', icon: Bell, row: 0, col: 4 },
      { id: 'd6', label: 'Customer Pickup / Delivery', type: 'end', icon: CheckCircle, row: 0, col: 5 },
      { id: 'd7', label: 'Failed Pickup / Delivery', type: 'decision', icon: AlertTriangle, row: 1, col: 3 },
      { id: 'd8', label: 'Send Aging Package Alert', type: 'notification', icon: Mail, row: 1, col: 4 },
      { id: 'd9', label: 'Scan Package into Inventory', type: 'process', icon: Scan, row: 2, col: 3 },
      { id: 'd10', label: 'Return Package to Warehouse', type: 'process', icon: Warehouse, row: 2, col: 4 },
      { id: 'd11', label: 'Return to Source', type: 'end', icon: RotateCcw, row: 2, col: 5 },
      { id: 'd12', label: 'Send Remittance', type: 'action', icon: DollarSign, row: 1, col: 5 },
      { id: 'd13', label: 'Customer Returns Package', type: 'process', icon: RotateCcw, row: 3, col: 0 },
      { id: 'd14', label: 'Drop off at Holding Center', type: 'action', icon: Building2, row: 3, col: 1 },
      { id: 'd15', label: 'Request for Delivery', type: 'notification', icon: Truck, row: 3, col: 2 },
      { id: 'd16', label: 'Send Notification to Recipient', type: 'notification', icon: Bell, row: 3, col: 3 },
    ],
    connections: [
      { from: 'd1', to: 'd2' },
      { from: 'd2', to: 'd3' },
      { from: 'd3', to: 'd4' },
      { from: 'd4', to: 'd5' },
      { from: 'd5', to: 'd6' },
      { from: 'd6', to: 'd7', label: 'Failed' },
      { from: 'd7', to: 'd8' },
      { from: 'd7', to: 'd9', label: 'Retrieve' },
      { from: 'd9', to: 'd10' },
      { from: 'd10', to: 'd11' },
      { from: 'd6', to: 'd12', label: 'Success' },
      { from: 'd13', to: 'd14' },
      { from: 'd14', to: 'd15' },
      { from: 'd15', to: 'd16' },
    ]
  },
  request: {
    title: 'Request for Delivery',
    description: 'Mobile app flow where customers drop off packages and request door-to-door delivery with scheduling.',
    apis: ['Sender Dropoff API', 'Customer Drop off API', "Drop 'N' Go API", 'Package Pickup API', 'Request for Delivery API', 'Scheduling API', 'Recipient Pickup API', 'Delivery API'],
    nodes: [
      { id: 'r1', label: 'Customer Gets Drop off PIN', type: 'start', icon: Lock, row: 0, col: 0 },
      { id: 'r2', label: 'Customer Drops off Package', type: 'action', icon: Box, row: 0, col: 1 },
      { id: 'r3', label: 'Request to Move Package Sent', type: 'notification', icon: Bell, row: 0, col: 2 },
      { id: 'r4', label: 'Package is Picked Up', type: 'process', icon: Truck, row: 0, col: 3 },
      { id: 'r5', label: 'Customer Requests Door-to-Door Delivery', type: 'decision', icon: Home, row: 1, col: 1 },
      { id: 'r6', label: 'Drop off at Holding Center / LocQar', type: 'action', icon: Building2, row: 1, col: 2 },
      { id: 'r7', label: 'Recipient Gets Notification', type: 'notification', icon: Bell, row: 1, col: 3 },
      { id: 'r8', label: 'Schedule Delivery', type: 'process', icon: Clock, row: 1, col: 4,
        details: 'Notification to schedule delivery sent to recipient' },
      { id: 'r9', label: 'Package is Delivered', type: 'end', icon: CheckCircle, row: 0, col: 5 },
    ],
    connections: [
      { from: 'r1', to: 'r2' },
      { from: 'r2', to: 'r3' },
      { from: 'r3', to: 'r4' },
      { from: 'r4', to: 'r9', label: 'Direct' },
      { from: 'r2', to: 'r5', label: 'D2D' },
      { from: 'r5', to: 'r6' },
      { from: 'r6', to: 'r7' },
      { from: 'r7', to: 'r8' },
      { from: 'r8', to: 'r9' },
    ]
  },
  cod: {
    title: 'Cash On Delivery',
    description: 'Business app workflow for COD orders where recipients pay via SMS link or at the station before pickup PIN activates.',
    apis: ['Cash On Delivery API', "Drop 'N' Go API", 'Package Drop off API', 'Notification API', 'Recipient Pickup API'],
    nodes: [
      { id: 'c1', label: 'Business Creates COD Order', type: 'start', icon: ShoppingCart, row: 0, col: 0,
        details: '1. Order/Waybill Number\n2. Phone Number\n3. Drop off Location\n4. Amount (COD)' },
      { id: 'c2', label: 'Customer Gets Drop off PIN or Waybill', type: 'process', icon: QrCode, row: 0, col: 1 },
      { id: 'c3', label: 'Package Dropped off at LocQar', type: 'action', icon: Box, row: 0, col: 2 },
      { id: 'c4', label: 'Notification to Move Package Sent', type: 'notification', icon: Bell, row: 0, col: 3 },
      { id: 'c5', label: 'Package Picked Up & Delivered to LocQar', type: 'process', icon: Truck, row: 0, col: 4 },
      { id: 'c6', label: 'Recipient Gets Pickup Notification', type: 'notification', icon: Bell, row: 1, col: 0 },
      { id: 'c7', label: 'Payment via SMS Link or at Station', type: 'decision', icon: CreditCard, row: 1, col: 1,
        details: 'Customer either pays via link in SMS or at the station' },
      { id: 'c8', label: 'Payment Successful', type: 'process', icon: CheckCircle, row: 1, col: 2 },
      { id: 'c9', label: 'Pickup PIN Activated', type: 'action', icon: Unlock, row: 1, col: 3,
        details: 'Pickup PIN becomes active when payment condition is met' },
      { id: 'c10', label: 'LocQar Box Opens', type: 'end', icon: DoorOpen, row: 1, col: 4 },
    ],
    connections: [
      { from: 'c1', to: 'c2' },
      { from: 'c2', to: 'c3' },
      { from: 'c3', to: 'c4' },
      { from: 'c4', to: 'c5' },
      { from: 'c5', to: 'c6' },
      { from: 'c6', to: 'c7' },
      { from: 'c7', to: 'c8' },
      { from: 'c8', to: 'c9' },
      { from: 'c9', to: 'c10' },
    ]
  },
  returns: {
    title: 'Package Returns',
    description: 'Manual return process where customers generate a drop-off PIN to return packages via LocQar.',
    apis: ['Drop off Request API', 'Return To Source API'],
    nodes: [
      { id: 'rt1', label: 'Create Return Request', type: 'start', icon: RotateCcw, row: 0, col: 0,
        details: '1. Tracking Number\n2. Sender\'s Phone Number\n3. Confirm Phone Number' },
      { id: 'rt2', label: 'Drop off PIN Generated', type: 'process', icon: Lock, row: 0, col: 1 },
      { id: 'rt3', label: 'Customer Drops off Package at LocQar', type: 'action', icon: Box, row: 0, col: 2 },
      { id: 'rt4', label: 'Notification Sent to Move Package', type: 'notification', icon: Bell, row: 0, col: 3 },
      { id: 'rt5', label: 'Package Picked Up by Courier', type: 'process', icon: Truck, row: 0, col: 4 },
      { id: 'rt6', label: 'Return to Source', type: 'end', icon: Warehouse, row: 0, col: 5 },
    ],
    connections: [
      { from: 'rt1', to: 'rt2' },
      { from: 'rt2', to: 'rt3' },
      { from: 'rt3', to: 'rt4' },
      { from: 'rt4', to: 'rt5' },
      { from: 'rt5', to: 'rt6' },
    ]
  },
  international: {
    title: 'International Pickup Request',
    description: 'International package pickup flow with location selection and payment processing.',
    apis: ['Request for Delivery API', 'Payment API', 'Notification API'],
    nodes: [
      { id: 'i1', label: 'Create Pickup Request', type: 'start', icon: Globe, row: 0, col: 0,
        details: '1. Tracking Number\n2. Receiver\'s Phone Number\n3. Confirm Phone Number' },
      { id: 'i2', label: 'Select Pickup Location', type: 'process', icon: MapPin, row: 0, col: 1 },
      { id: 'i3', label: 'Payment Processing', type: 'decision', icon: CreditCard, row: 0, col: 2 },
      { id: 'i4', label: 'Payment Successful', type: 'process', icon: CheckCircle, row: 0, col: 3 },
      { id: 'i5', label: 'Drop off Activated', type: 'action', icon: Unlock, row: 0, col: 4 },
      { id: 'i6', label: 'Package Ready for Pickup', type: 'end', icon: Package, row: 0, col: 5 },
    ],
    connections: [
      { from: 'i1', to: 'i2' },
      { from: 'i2', to: 'i3' },
      { from: 'i3', to: 'i4' },
      { from: 'i4', to: 'i5' },
      { from: 'i5', to: 'i6' },
    ]
  },
  courier: {
    title: 'Courier Drop-off Flow',
    description: 'Courier login and package drop-off process with multi-parcel handling for same-recipient deliveries.',
    apis: ['Courier Drop-off API', 'SetDoorOpen API', 'Notification API'],
    nodes: [
      { id: 'cr1', label: 'Courier Login', type: 'start', icon: LogIn, row: 0, col: 0,
        details: 'Enter Username and Password' },
      { id: 'cr2', label: 'Choose Door Size', type: 'process', icon: Maximize2, row: 0, col: 1 },
      { id: 'cr3', label: 'Scan Parcel', type: 'action', icon: Scan, row: 0, col: 2 },
      { id: 'cr4', label: 'Phone Number Already in Locker?', type: 'decision', icon: Phone, row: 0, col: 3 },
      { id: 'cr5', label: 'Auto Open Box with Old Parcel', type: 'action', icon: DoorOpen, row: 1, col: 3,
        details: 'Ask courier to add new package to old parcel' },
      { id: 'cr6', label: 'Auto Open New Box', type: 'action', icon: Unlock, row: 1, col: 4 },
      { id: 'cr7', label: 'Courier Drops off Parcel & Closes Box', type: 'end', icon: CheckCircle, row: 1, col: 5 },
    ],
    connections: [
      { from: 'cr1', to: 'cr2' },
      { from: 'cr2', to: 'cr3' },
      { from: 'cr3', to: 'cr4' },
      { from: 'cr4', to: 'cr5', label: 'Yes' },
      { from: 'cr4', to: 'cr6', label: 'No' },
      { from: 'cr5', to: 'cr7' },
      { from: 'cr6', to: 'cr7' },
    ]
  }
});

// ============ NODE COLOR HELPERS ============
const getNodeColors = (type, theme) => {
  const map = {
    start:        { bg: 'rgba(129,201,149,0.12)', border: 'rgba(129,201,149,0.4)', text: theme.text.primary, icon: '#81C995' },
    end:          { bg: 'rgba(129,201,149,0.12)', border: 'rgba(129,201,149,0.4)', text: theme.text.primary, icon: '#81C995' },
    process:      { bg: 'rgba(126,168,201,0.12)', border: 'rgba(126,168,201,0.4)', text: theme.text.primary, icon: '#7EA8C9' },
    action:       { bg: 'rgba(181,160,209,0.12)', border: 'rgba(181,160,209,0.4)', text: theme.text.primary, icon: '#B5A0D1' },
    decision:     { bg: 'rgba(212,170,90,0.12)',  border: 'rgba(212,170,90,0.4)',  text: theme.text.primary, icon: '#D4AA5A' },
    notification: { bg: 'rgba(212,142,138,0.12)', border: 'rgba(212,142,138,0.4)', text: theme.text.primary, icon: '#D48E8A' },
    api:          { bg: theme.accent.light,        border: theme.accent.border,      text: theme.text.primary, icon: theme.accent.primary },
  };
  return map[type] || map.process;
};

const getTypeLabel = (type) => {
  const map = {
    start: 'Start', end: 'End', process: 'Process', action: 'Action',
    decision: 'Decision', notification: 'Notification', api: 'API Call'
  };
  return map[type] || type;
};

// ============ FLOW NODE COMPONENT ============
const FlowNode = ({ node, isSelected, onClick, theme }) => {
  const colors = getNodeColors(node.type, theme);
  const Icon = node.icon;
  const isTerminal = node.type === 'start' || node.type === 'end';

  return (
    <div
      onClick={() => onClick(node)}
      style={{
        background: isSelected ? colors.border : colors.bg,
        border: `1.5px solid ${colors.border}`,
        borderRadius: isTerminal ? 24 : node.type === 'decision' ? 4 : 12,
        padding: '14px 16px',
        minWidth: 150,
        maxWidth: 180,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
        boxShadow: isSelected ? `0 4px 20px ${colors.border}` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: `${colors.icon}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={14} style={{ color: colors.icon }} />
        </div>
        <span style={{
          fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
          color: colors.icon, opacity: 0.8,
        }}>
          {getTypeLabel(node.type)}
        </span>
      </div>
      <div style={{
        fontSize: 12, fontWeight: 500, color: isSelected ? theme.accent.contrast : colors.text,
        lineHeight: 1.4,
      }}>
        {node.label}
      </div>
    </div>
  );
};

// ============ ARROW COMPONENT ============
const FlowArrow = ({ label, direction = 'right', theme }) => {
  if (direction === 'down') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '2px 0', minHeight: 32,
      }}>
        <div style={{ width: 1.5, height: label ? 8 : 16, background: theme.border.secondary }} />
        {label && (
          <span style={{
            fontSize: 9, color: theme.text.muted, padding: '1px 6px',
            background: theme.bg.tertiary, borderRadius: 4, fontWeight: 500, whiteSpace: 'nowrap',
          }}>{label}</span>
        )}
        <div style={{ width: 1.5, flex: 1, minHeight: 4, background: theme.border.secondary }} />
        <ArrowDown size={12} style={{ color: theme.text.muted }} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '0 2px',
      minWidth: label ? 60 : 32, flexShrink: 0,
    }}>
      <div style={{ height: 1.5, flex: 1, background: theme.border.secondary }} />
      {label && (
        <span style={{
          fontSize: 9, color: theme.text.muted, padding: '1px 6px',
          background: theme.bg.tertiary, borderRadius: 4, fontWeight: 500, whiteSpace: 'nowrap',
          margin: '0 2px',
        }}>{label}</span>
      )}
      <div style={{ height: 1.5, flex: 1, background: theme.border.secondary }} />
      <ChevronRight size={12} style={{ color: theme.text.muted, flexShrink: 0 }} />
    </div>
  );
};

// ============ NODE DETAIL PANEL ============
const NodeDetail = ({ node, theme, onClose }) => {
  if (!node) return null;
  const colors = getNodeColors(node.type, theme);

  return (
    <div style={{
      background: theme.bg.card, border: `1px solid ${theme.border.primary}`,
      borderRadius: 12, padding: 20, marginTop: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: colors.bg, border: `1px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <node.icon size={20} style={{ color: colors.icon }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text.primary }}>{node.label}</div>
            <div style={{
              fontSize: 11, fontWeight: 500, color: colors.icon, marginTop: 2,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>{getTypeLabel(node.type)}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: theme.text.muted, padding: 4,
          }}
        >&times;</button>
      </div>
      {node.details && (
        <div style={{
          marginTop: 14, padding: 12, borderRadius: 8,
          background: theme.bg.tertiary, border: `1px solid ${theme.border.primary}`,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: theme.text.muted, textTransform: 'uppercase', marginBottom: 6 }}>
            Details
          </div>
          <div style={{ fontSize: 12, color: theme.text.secondary, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {node.details}
          </div>
        </div>
      )}
    </div>
  );
};

// ============ FLOW RENDERER ============
const FlowRenderer = ({ workflow, theme }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  // Group nodes by row
  const rows = {};
  workflow.nodes.forEach(n => {
    if (!rows[n.row]) rows[n.row] = [];
    rows[n.row].push(n);
  });

  // Sort each row by col
  Object.keys(rows).forEach(r => {
    rows[r].sort((a, b) => a.col - b.col);
  });

  // Build a connection lookup for inter-row connectors
  const downConnections = {};
  workflow.connections.forEach(c => {
    const fromNode = workflow.nodes.find(n => n.id === c.from);
    const toNode = workflow.nodes.find(n => n.id === c.to);
    if (fromNode && toNode && fromNode.row !== toNode.row) {
      if (!downConnections[fromNode.id]) downConnections[fromNode.id] = [];
      downConnections[fromNode.id].push({ ...c, toNode });
    }
  });

  // Build same-row connections
  const getConnectionLabel = (fromId, toId) => {
    const conn = workflow.connections.find(c => c.from === fromId && c.to === toId);
    return conn?.label;
  };

  const sortedRowKeys = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

  return (
    <div>
      {/* API Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {workflow.apis.map((api, i) => (
          <span key={i} style={{
            fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 6,
            background: theme.accent.light, color: theme.text.secondary,
            border: `1px solid ${theme.border.primary}`,
          }}>
            {api}
          </span>
        ))}
      </div>

      {/* Flow Diagram */}
      <div style={{ overflowX: 'auto', paddingBottom: 12 }}>
        {sortedRowKeys.map((rowKey, ri) => {
          const rowNodes = rows[rowKey];
          return (
            <div key={rowKey}>
              {/* Inter-row arrows */}
              {ri > 0 && (
                <div style={{ display: 'flex', paddingLeft: 20, gap: 40, marginBottom: 4 }}>
                  {/* Find nodes from previous rows that connect down to this row */}
                </div>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                padding: '8px 0',
                minWidth: 'fit-content',
              }}>
                {rowNodes.map((node, ni) => {
                  // Check if there's a connection from the previous node in this row
                  const prevNode = ni > 0 ? rowNodes[ni - 1] : null;
                  const connLabel = prevNode ? getConnectionLabel(prevNode.id, node.id) : null;
                  const hasSameRowConn = prevNode && workflow.connections.some(
                    c => c.from === prevNode.id && c.to === node.id
                  );

                  return (
                    <React.Fragment key={node.id}>
                      {ni > 0 && hasSameRowConn && (
                        <FlowArrow label={connLabel} theme={theme} />
                      )}
                      {ni > 0 && !hasSameRowConn && (
                        <div style={{ width: 24 }} />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FlowNode
                          node={node}
                          isSelected={selectedNode?.id === node.id}
                          onClick={setSelectedNode}
                          theme={theme}
                        />
                        {/* Down arrows from this node */}
                        {downConnections[node.id] && (
                          <FlowArrow
                            direction="down"
                            label={downConnections[node.id][0]?.label}
                            theme={theme}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Detail */}
      {selectedNode && (
        <NodeDetail
          node={selectedNode}
          theme={theme}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20,
        padding: 12, borderRadius: 8,
        background: theme.bg.tertiary, border: `1px solid ${theme.border.primary}`,
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: theme.text.muted, textTransform: 'uppercase', marginRight: 4, alignSelf: 'center' }}>
          Legend:
        </span>
        {['start', 'process', 'action', 'decision', 'notification', 'end'].map(type => {
          const colors = getNodeColors(type, theme);
          return (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 10, height: 10,
                borderRadius: type === 'start' || type === 'end' ? '50%' : type === 'decision' ? 2 : 3,
                background: colors.bg, border: `1.5px solid ${colors.border}`,
              }} />
              <span style={{ fontSize: 10, color: theme.text.secondary }}>
                {getTypeLabel(type)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ MAIN WORKFLOWS PAGE ============
export const WorkflowsPage = ({ addToast }) => {
  const { theme } = useTheme();
  const [activeWorkflow, setActiveWorkflow] = useState('delivery');
  const workflowData = buildWorkflowData(theme);
  const currentWorkflow = workflowData[activeWorkflow];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text.primary, margin: 0 }}>
          Process Workflows
        </h1>
        <p style={{ fontSize: 13, color: theme.text.secondary, marginTop: 4 }}>
          Visual representation of LocQar operational process flows and API integrations.
        </p>
      </div>

      {/* Workflow Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto',
        padding: '4px', borderRadius: 12,
        background: theme.bg.secondary, border: `1px solid ${theme.border.primary}`,
      }}>
        {WORKFLOWS.map(wf => {
          const Icon = wf.icon;
          const isActive = activeWorkflow === wf.id;
          return (
            <button
              key={wf.id}
              onClick={() => setActiveWorkflow(wf.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8, border: 'none',
                background: isActive ? theme.accent.primary : 'transparent',
                color: isActive ? theme.accent.contrast : theme.text.secondary,
                cursor: 'pointer', fontSize: 12, fontWeight: 500,
                whiteSpace: 'nowrap', transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} />
              {wf.label}
            </button>
          );
        })}
      </div>

      {/* Workflow Content */}
      <div style={{
        background: theme.bg.card, borderRadius: 14,
        border: `1px solid ${theme.border.primary}`, padding: 24,
      }}>
        {/* Workflow Title & Description */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: theme.text.primary, margin: 0 }}>
            {currentWorkflow.title}
          </h2>
          <p style={{ fontSize: 12, color: theme.text.secondary, marginTop: 6, lineHeight: 1.6 }}>
            {currentWorkflow.description}
          </p>
        </div>

        {/* Flow Renderer */}
        <FlowRenderer workflow={currentWorkflow} theme={theme} />
      </div>
    </div>
  );
};

export default WorkflowsPage;
