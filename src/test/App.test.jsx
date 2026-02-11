import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LocQarERP from '../App.jsx';

// Mock recharts to avoid canvas/SVG rendering issues in jsdom
vi.mock('recharts', () => ({
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  AreaChart: ({ children }) => <div>{children}</div>,
  Area: () => null,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
}));

describe('LocQarERP', () => {
  it('renders without crashing', async () => {
    const { container } = render(<LocQarERP />);
    expect(container).toBeTruthy();
  });

  it('shows loading state initially', () => {
    render(<LocQarERP />);
    // The app shows a loading spinner on mount
    expect(document.querySelector('[style]')).toBeTruthy();
  });

  it('renders the main app after loading', async () => {
    render(<LocQarERP />);
    // Wait for loading to finish (1s timeout in component)
    await waitFor(() => {
      expect(screen.getByText('LocQar')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('displays the default user name', async () => {
    render(<LocQarERP />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows the dashboard by default', async () => {
    render(<LocQarERP />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
