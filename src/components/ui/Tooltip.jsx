import React, { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Tooltip = ({ children, content, position = 'top', delay = 200 }) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  if (!content) return children;

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  };

  const arrowBorderColor = {
    top: `borderTopColor: ${theme.bg.tooltip || theme.bg.card}`,
    bottom: `borderBottomColor: ${theme.bg.tooltip || theme.bg.card}`,
    left: `borderLeftColor: ${theme.bg.tooltip || theme.bg.card}`,
    right: `borderRightColor: ${theme.bg.tooltip || theme.bg.card}`,
  };

  const getArrowStyle = () => {
    const bg = theme.bg.tooltip || theme.bg.card;
    switch (position) {
      case 'top': return { borderTopColor: bg };
      case 'bottom': return { borderBottomColor: bg };
      case 'left': return { borderLeftColor: bg };
      case 'right': return { borderRightColor: bg };
      default: return { borderTopColor: bg };
    }
  };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div className={`absolute z-50 ${positions[position]} pointer-events-none`}>
          <div
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg"
            style={{
              backgroundColor: theme.bg.tooltip || theme.bg.card,
              color: theme.text.primary,
              border: `1px solid ${theme.border.primary}`,
            }}
          >
            {content}
          </div>
          <div
            className={`absolute w-0 h-0 border-4 ${arrows[position]}`}
            style={getArrowStyle()}
          />
        </div>
      )}
    </div>
  );
};
