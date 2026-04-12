import type { Order, OrderStatusCode } from '@/features/orders/types';

/**
 * A customer is derived from order activity. The dashboard-api treats phone
 * numbers as the customer key — there is no separate `customer` table yet.
 *
 * `CustomerSummary` is the row shape returned by the list endpoint; it carries
 * just enough to power the search results table without loading every order.
 */
export interface CustomerSummary {
  /** E.164 phone number — also the URL slug for the detail page. */
  phone: string;
  /** Display name if known (resolved from a future user lookup). */
  name: string | null;
  /** First time we ever saw this phone in an order. */
  firstSeenAt: string;
  /** Most recent order createdAt. */
  lastOrderAt: string;
  totalOrders: number;
  /** Currently in-flight (not in a terminal state). */
  activeOrders: number;
  completedOrders: number;
  /** Status code of the most-recent order. */
  lastStatus: OrderStatusCode;
}

export interface CustomersPage {
  data: CustomerSummary[];
  pageable: { page: number; size: number; total: number };
}

export interface CustomerDetail extends CustomerSummary {
  /** Recent orders newest-first. The full timeline lives on each order. */
  orders: Order[];
}

export interface CustomerListFilters {
  page?: number;
  size?: number;
  /** Searches phone (substring) and name (case-insensitive). */
  q?: string;
}
