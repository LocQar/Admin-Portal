import React from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems
}) => {
  const { theme } = useTheme();

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-t"
      style={{ borderColor: theme.border.primary }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: theme.text.muted }}>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 rounded-lg text-sm border"
          style={{
            backgroundColor: theme.bg.tertiary,
            borderColor: theme.border.primary,
            color: theme.text.primary
          }}
        >
          {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
        </select>
        <span className="text-sm" style={{ color: theme.text.muted }}>
          of {totalItems} items
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg disabled:opacity-50"
          style={{ color: theme.text.secondary }}
        >
          <ChevronFirst size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg disabled:opacity-50"
          style={{ color: theme.text.secondary }}
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-8 h-8 rounded-lg text-sm"
            style={{
              backgroundColor: currentPage === page ? theme.accent.primary : 'transparent',
              color: currentPage === page ? '#fff' : theme.text.secondary
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg disabled:opacity-50"
          style={{ color: theme.text.secondary }}
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg disabled:opacity-50"
          style={{ color: theme.text.secondary }}
        >
          <ChevronLast size={16} />
        </button>
      </div>
    </div>
  );
};
