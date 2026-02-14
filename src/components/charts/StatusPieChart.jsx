import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const StatusPieChart = ({ data, theme }) => {
  const COLORS = ['#81C995', '#7EA8C9', '#D4AA5A', '#D48E8A', '#A8A29E'];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme.bg.card,
            border: `1px solid ${theme.border.primary}`,
            borderRadius: 12
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
