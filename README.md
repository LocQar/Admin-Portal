# LocQar Admin Portal

A comprehensive React-based admin dashboard for managing a nationwide smart locker delivery network. The portal provides end-to-end operations management including package tracking, dispatch routing, fleet management, customer subscriptions, business partnerships, and real-time analytics.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Components](#components)
- [State Management](#state-management)
- [Theming](#theming)
- [Roles & Permissions](#roles--permissions)
- [Delivery Methods](#delivery-methods)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Scripts](#scripts)

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Leaflet + React-Leaflet |
| Linting | ESLint 9 |

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Project Structure

```
src/
├── assets/                  # Static assets
├── components/
│   ├── analytics/           # Predictive analytics charts
│   ├── charts/              # StatusPieChart and data visualizations
│   ├── drawers/             # Slide-out drawers (NewPackage, Dispatch, PackageDetail, NewVehicle)
│   ├── layout/              # Sidebar navigation
│   ├── modals/              # Modals (GlobalSearch, Export, Scan, Reassign, Return, Shortcuts, SessionTimeout)
│   ├── operations/          # OperationsMap (interactive Leaflet map)
│   └── ui/                  # Reusable UI primitives (Badge, Card, Checkbox, Pagination, Toast, etc.)
├── constants/
│   ├── index.js             # Roles, shortcuts, menu groups, delivery methods, statuses
│   ├── mockData.js          # Mock data (packages, lockers, terminals, customers)
│   └── mockDataPart2.js     # Mock data (subscribers, partners, staff, drivers, routes, etc.)
├── contexts/
│   ├── ThemeContext.jsx      # Dark/light theme provider
│   └── ToastContext.jsx      # Toast notification provider
├── pages/                   # 18 page-level components
└── App.jsx                  # Root component with navigation state and page rendering
```

## Pages

### Overview

| Page | Description |
|------|-------------|
| **Dashboard** | Key metrics, terminal performance charts, hourly trends, quick actions, operations map, and recent notifications |

### Operations

| Page | Sub-sections | Description |
|------|-------------|-------------|
| **Packages** | All Packages, In Locker, Pending Pickup, Expired | Full package lifecycle management with search, filters, bulk actions, and status tracking |
| **Dispatch** | Outgoing, Route Planning, Driver Assignment | Route creation, driver assignment, real-time route tracking with stop timelines |
| **Notifications** | Message Center, Templates, Auto-Rules, History, Settings | Multi-channel notification management (SMS, WhatsApp, Email) with templates and auto-triggers |
| **Fleet** | — | Vehicle fleet management, driver profiles, maintenance tracking |
| **SLA Monitor** | Live Monitor, Escalation Rules, Compliance, Incident Log | SLA breach tracking, escalation workflows, and compliance reporting |

### Management

| Page | Sub-sections | Description |
|------|-------------|-------------|
| **Lockers** | All Lockers, Maintenance, Configuration | Smart locker management with temperature/battery monitoring and terminal assignment |
| **Dropboxes** | Overview, Collections, Agents, Package Flow | Dropbox collection management, agent tracking, and package flow visualization |
| **Terminals** | — | Terminal location management with online/offline/maintenance status |
| **Customers** | All Customers, Subscribers, B2B Partners, Support Tickets | Customer profiles, university-based subscription plans, partner tier management, and support tickets |
| **Staff** | Agents, Teams, Performance | Employee management, team organization, role assignment, and performance tracking |

### Business

| Page | Sub-sections | Description |
|------|-------------|-------------|
| **Business Portal** | Partner Dashboard, Bulk Shipments, Invoices & Billing, API Management, Partner Analytics | B2B partner administration and API management |
| **Partner Portal** | Portal Home, Ship Now, Track Packages, Locker Map, My Billing, API Console, Help Center | Self-service partner interface |
| **Accounting** | Transactions, Invoices, Reports | Financial tracking, invoicing, and revenue reports |
| **Pricing Engine** | Rate Card, Delivery Methods, SLA Tiers, Surcharges, Volume Discounts, Partner Overrides | Dynamic pricing configuration |
| **Analytics** | — | Revenue trends, delivery metrics, and predictive analytics |
| **Audit Log** | — | System audit trail and user activity logging |
| **Settings** | — | System configuration, preferences, and API key management |

## Components

### UI Components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `Badge` | Status, delivery method, and role badges with theme-aware colors |
| `Card` | MetricCard for dashboard stats, QuickAction for action buttons |
| `Checkbox` | Custom styled checkbox |
| `Pagination` | Table pagination with configurable page sizes |
| `Toast` / `ToastContainer` | Toast notifications (success, error, warning, info) with auto-dismiss |
| `Skeleton` | Loading skeleton screens |
| `EmptyState` | Placeholder UI for empty data states |
| `PackageStatusFlow` | Visual status flow diagram for package lifecycle |
| `BulkActionsBar` | Sticky bottom bar for bulk operations on selected items |
| `Tooltip` | Hover tooltip |
| `Breadcrumb` | Breadcrumb navigation |
| `ConfirmDialog` | Confirmation dialog modal |
| `Dropdown` | Dropdown menu |
| `FormInput` | Styled form input field |

### Modals (`components/modals/`)

| Component | Purpose |
|-----------|---------|
| `GlobalSearchModal` | Ctrl+K search across packages, customers, and lockers |
| `ExportModal` | Export data as CSV/Excel/PDF |
| `ScanModal` | QR code scanning interface |
| `ReassignModal` | Reassign a package to a different locker/terminal |
| `ReturnModal` | Process package returns/refunds |
| `ShortcutsModal` | Keyboard shortcuts reference |
| `SessionTimeoutModal` | Session expiry warning |

### Drawers (`components/drawers/`)

| Component | Purpose |
|-----------|---------|
| `NewPackageDrawer` | Create a new package entry |
| `DispatchDrawer` | Initiate dispatch operations |
| `PackageDetailDrawer` | View full package details in a side panel |
| `NewVehicleDrawer` | Add a new fleet vehicle |

### Other Components

| Component | Path | Purpose |
|-----------|------|---------|
| `Sidebar` | `components/layout/` | Collapsible sidebar navigation with menu groups |
| `StatusPieChart` | `components/charts/` | Pie chart for status distribution |
| `PredictiveCharts` | `components/analytics/` | Predictive analytics visualizations |
| `OperationsMap` | `components/operations/` | Interactive Leaflet map showing terminals, dropboxes, and drivers |

## State Management

The application uses **React Context API** and **local component state** — no external state management library is needed.

### Contexts

| Context | Hook | Purpose |
|---------|------|---------|
| `ThemeContext` | `useTheme()` | Provides the active theme (dark/light) with color tokens for backgrounds, text, borders, and status colors |
| `ToastContext` | `useToast()` | Manages toast notification queue with auto-dismiss (4 seconds) |

### Navigation

Navigation is state-based rather than URL-based. The `App.jsx` component maintains `activeMenu` and `activeSubMenu` state variables and conditionally renders the corresponding page component. The sidebar menu structure is defined in `src/constants/index.js` under `MENU_GROUPS`.

## Theming

Two built-in themes are available and can be toggled at runtime:

| Token | Dark Theme | Light Theme |
|-------|-----------|-------------|
| Background (primary) | `#0A1628` | `#FFFFFF` |
| Background (secondary) | `#152238` | `#F1F5F9` |
| Text (primary) | `#FFFFFF` | `#0A1628` |
| Text (secondary) | `#8B9AAF` | `#64748B` |
| Accent | `#FF6B58` | `#FF6B58` |
| Success | `#34D399` | `#10B981` |
| Error | `#FF4D4D` | `#EF4444` |
| Warning | `#f59e0b` | `#f59e0b` |
| Info | `#3b82f6` | `#3b82f6` |

All components consume theme tokens via `useTheme()` and apply them through inline styles, ensuring consistent theming across the entire application.

## Roles & Permissions

Six user roles are defined with a hierarchical permission system:

| Role | Level | Access |
|------|-------|--------|
| **Super Admin** | 100 | Full access to all features (`*`) |
| **Admin** | 80 | Dashboard, packages, lockers, dropboxes, terminals, customers, staff, reports, dispatch, accounting |
| **Manager** | 60 | View and manage operations within their own region |
| **Agent** | 40 | Field operations — scan, receive, and view packages |
| **Support** | 30 | Dashboard view, package tracking, customer management |
| **Viewer** | 10 | Read-only access to dashboard, packages, and lockers |

Permissions are checked via `hasPermission(userRole, permission)` with wildcard support (e.g., `packages.*` grants all package-related permissions).

## Delivery Methods

| Method | Flow | Color |
|--------|------|-------|
| Warehouse → Locker | Central warehouse directly to a smart locker | Blue `#3b82f6` |
| Dropbox → Locker | Dropoff box to a smart locker | Purple `#8b5cf6` |
| Locker → Home | Smart locker to the customer's home address | Green `#10b981` |

### Package Statuses

Packages move through the following statuses:

```
Pending → At Warehouse / At Dropbox → In Transit (→ Locker / → Home) → Delivered (to Locker / to Home) → Picked Up
                                                                                                      ↘ Expired
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open global search |
| `Ctrl + S` | Scan package |
| `Ctrl + N` | New package |
| `Ctrl + D` | Open dispatch |
| `Esc` | Close active modal |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
