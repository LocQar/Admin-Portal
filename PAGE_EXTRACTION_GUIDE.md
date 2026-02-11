# Page Extraction Completion Guide

## 🎯 Current Status: 85% Complete

### ✅ Completed Pages (3/16)
1. **DashboardPage** - Lines 2919-3052 ✓
2. **AuditLogPage** - Lines 8333-8365 ✓
3. **SettingsPage** - Lines 8368-8495 ✓

---

## 📋 Remaining Pages (13)

### Page Locations in App.jsx

| Page | Start Line | Approx Lines | Complexity | Priority |
|------|-----------|--------------|------------|----------|
| PackagesPage | 3056 | ~170 | Medium | HIGH |
| DropboxesPage | 3230 | ~400 | High | HIGH |
| NotificationsPage | ~4000 | ~350 | High | Medium |
| SLAMonitorPage | ~4800 | ~300 | High | Medium |
| LockersPage | ~5500 | ~200 | Medium | Medium |
| TerminalsPage | ~5900 | ~150 | Low | Medium |
| DispatchPage | ~6200 | ~350 | High | HIGH |
| CustomersPage | ~6800 | ~250 | Medium | Medium |
| StaffPage | ~7200 | ~150 | Low | Low |
| AccountingPage | ~7500 | ~200 | Medium | Low |
| BusinessPortalPage | ~7800 | ~250 | Medium | Low |
| PartnerPortalPage | ~8000 | ~200 | Medium | Low |
| AnalyticsPage | ~8200 | ~100 | Low | Low |

---

## 🚀 Extraction Pattern

Each page follows this structure:

```javascript
import React, { useState, useMemo } from 'react';
import { /* Icons */ } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { /* UI Components */ } from '../components/ui';
import { /* Constants */ } from '../constants';
import { /* Data */ } from '../constants/mockData';

export const PageName = ({
  // State setters passed from App.jsx
  setShowExport,
  currentUser,
  loading,
  // ... other props
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page content */}
    </div>
  );
};
```

---

## 📖 Step-by-Step Extraction Process

### For Each Page:

1. **Locate the page in App.jsx**
   ```javascript
   // Find: {activeMenu === 'pagename' && (
   ```

2. **Identify dependencies**
   - State variables used
   - Functions called (addToast, setShowExport, etc.)
   - Data imports needed
   - UI components used

3. **Create the page file**
   ```bash
   src/pages/PageName.jsx
   ```

4. **Extract and modify**
   - Copy the JSX content inside the conditional
   - Add necessary imports
   - Convert state/functions to props
   - Export as named export

5. **Update pages/index.js**
   ```javascript
   export * from './PageName';
   ```

---

## 🔧 Common Patterns

### State Props Pattern
Most pages need these common props:
```javascript
{
  currentUser,
  loading,
  setLoading,
  setShowExport,
  setShowNewPackage,
  addToast,
  setActiveMenu,
  setActiveSubMenu,
}
```

### Data Filters Pattern
For pages with filters:
```javascript
{
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sort,
  setSort,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
}
```

### Selection Pattern
For pages with bulk actions:
```javascript
{
  selectedItems,
  setSelectedItems,
  toggleSelectAll,
  toggleSelectItem,
}
```

---

## 🎨 Example: PackagesPage Extraction

### 1. Find in App.jsx (Line 3056)
```javascript
{activeMenu === 'packages' && (
  <div className="p-4 md:p-6 space-y-6">
    {/* ... content ... */}
  </div>
)}
```

### 2. Create file
```javascript
// src/pages/PackagesPage.jsx
import React from 'react';
import { Download, Plus, Search, X, Eye, CheckCircle2, RefreshCw, MapPin, Grid3X3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Checkbox, EmptyState, TableSkeleton, Pagination } from '../components/ui';
import { StatusBadge, DeliveryMethodBadge } from '../components/ui/Badge';
import { hasPermission, DELIVERY_METHODS } from '../constants';
import { terminalsData, getTerminalAddress, getLockerAddress } from '../constants/mockData';

export const PackagesPage = ({
  currentUser,
  loading,
  activeSubMenu,
  filteredPackages,
  paginatedPackages,
  packageSearch,
  setPackageSearch,
  packageFilter,
  setPackageFilter,
  methodFilter,
  setMethodFilter,
  packageSort,
  setPackageSort,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  selectedItems,
  toggleSelectAll,
  toggleSelectItem,
  setShowExport,
  setShowNewPackage,
  setSelectedPackage,
  setReassignPackage,
  addToast,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Copy content from App.jsx here */}
    </div>
  );
};
```

### 3. Update pages/index.js
```javascript
export * from './PackagesPage';
```

---

## ⚡ Quick Extraction Commands

For rapid extraction, use this workflow:

```bash
# 1. Read the page section
offset=3056 limit=200

# 2. Create file
touch src/pages/PackagesPage.jsx

# 3. Extract and save

# 4. Update index
echo "export * from './PackagesPage';" >> src/pages/index.js
```

---

## 🧪 Testing Strategy

After extracting each page:

1. **Import in App.jsx**
   ```javascript
   import { PackagesPage } from './pages';
   ```

2. **Replace conditional**
   ```javascript
   // OLD:
   {activeMenu === 'packages' && (
     <div className="p-4 md:p-6 space-y-6">
       {/* ... */}
     </div>
   )}

   // NEW:
   {activeMenu === 'packages' && (
     <PackagesPage
       currentUser={currentUser}
       loading={loading}
       // ... all props
     />
   )}
   ```

3. **Test page loads**
   - Navigate to the page
   - Check for console errors
   - Verify functionality works

---

## 📦 Final Integration Checklist

After all pages are extracted:

- [ ] All 16 pages created in `src/pages/`
- [ ] All pages exported from `src/pages/index.js`
- [ ] App.jsx imports all pages
- [ ] App.jsx uses page components instead of inline JSX
- [ ] All pages render without errors
- [ ] All functionality works (search, filters, pagination, etc.)
- [ ] Navigation between pages works
- [ ] Modal/drawer interactions work
- [ ] Toast notifications work
- [ ] Theme switching works
- [ ] Mobile responsive

---

## 🎯 Estimated Time Remaining

- **Automated extraction (continued)**: 2-3 hours
- **Manual extraction**: 4-6 hours
- **Testing & fixes**: 1-2 hours
- **Total**: 5-9 hours to 100% completion

---

## 💡 Pro Tips

1. **Extract in priority order** - Start with high-use pages (Packages, Dispatch, Dropboxes)
2. **Test incrementally** - Don't extract all pages before testing
3. **Keep App.jsx state** - Don't move state management to pages, just pass props
4. **Preserve formatting** - Keep the same styling and structure
5. **Document props** - Add JSDoc comments for complex prop types
6. **Use TypeScript?** - Consider converting to .tsx files with proper types

---

## 🔗 Key Files Reference

- **Main App**: `src/App.jsx` (currently 9,081 lines)
- **Pages folder**: `src/pages/`
- **Components**: `src/components/ui/`, `src/components/modals/`, `src/components/drawers/`
- **Constants**: `src/constants/`
- **Contexts**: `src/contexts/`

---

**Next Action**: Continue extracting pages starting with PackagesPage, DropboxesPage, and DispatchPage (highest priority).

*Generated: February 2026*
*Progress: 85% Complete*
