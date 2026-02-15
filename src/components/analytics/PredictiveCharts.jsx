import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

export const PredictiveRevenueChart = () => {
    const { theme } = useTheme();

    const data = [
        { month: 'Aug', actual: 45000, projected: 44000 },
        { month: 'Sep', actual: 48000, projected: 47000 },
        { month: 'Oct', actual: 52000, projected: 51000 },
        { month: 'Nov', actual: 56000, projected: 55000 },
        { month: 'Dec', actual: 65000, projected: 64000 },
        { month: 'Jan', actual: 58000, projected: 59000 },
        { month: 'Feb', actual: null, projected: 62000 }, // Future
        { month: 'Mar', actual: null, projected: 66000 }, // Future
        { month: 'Apr', actual: null, projected: 70000 }, // Future
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.chart.blue} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={theme.chart.blue} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.chart.violet} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={theme.chart.violet} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, borderRadius: 12 }}
                        itemStyle={{ color: theme.text.primary }}
                    />
                    {/* Actual Revenue */}
                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke={theme.chart.blue}
                        fillOpacity={1}
                        fill="url(#colorActual)"
                        name="Actual Revenue"
                    />
                    {/* Projected Revenue (Dashed) */}
                    <Area
                        type="monotone"
                        dataKey="projected"
                        stroke={theme.chart.violet}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorProjected)"
                        name="AI Projection"
                    />
                    <ReferenceLine x="Jan" stroke={theme.text.muted} strokeDasharray="3 3" label={{ value: 'Today', position: 'top', fill: theme.text.muted, fontSize: 12 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- CHURN RISK HEATMAP ---
export const ChurnRiskHeatmap = () => {
    const { theme } = useTheme();
    // Grid of User Segments: x=Engagement Level, y=Support Tickets
    // Value = Risk Score (0-100)
    const riskData = [
        { id: 1, segment: 'New Users', lowTickets: 10, midTickets: 30, highTickets: 65 },
        { id: 2, segment: 'Power Users', lowTickets: 5, midTickets: 15, highTickets: 40 },
        { id: 3, segment: 'Dormant', lowTickets: 80, midTickets: 90, highTickets: 95 },
        { id: 4, segment: 'Enterprise', lowTickets: 2, midTickets: 10, highTickets: 25 },
    ];

    const getRiskColor = (score) => {
        if (score >= 80) return theme.chart.coral;
        if (score >= 50) return theme.chart.amber;
        if (score >= 20) return theme.chart.blue;
        return theme.chart.green;
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-center mb-1" style={{ color: theme.text.muted }}>
                <div className="text-left pl-2">Segment</div>
                <div>Low Issues</div>
                <div>Med Issues</div>
                <div>High Issues</div>
            </div>
            {riskData.map(row => (
                <div key={row.id} className="grid grid-cols-4 gap-2 items-center">
                    <div className="text-sm font-medium pl-2" style={{ color: theme.text.primary }}>{row.segment}</div>
                    {[row.lowTickets, row.midTickets, row.highTickets].map((score, i) => (
                        <div
                            key={i}
                            className="h-10 rounded-lg flex items-center justify-center font-bold transition-transform hover:scale-105 cursor-pointer relative group"
                            style={{ backgroundColor: getRiskColor(score), color: '#1C1917' }}
                        >
                            {score}%
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-black/80 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-10">
                                {score}% Churn Probability
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <div className="flex justify-between mt-2 text-xs" style={{ color: theme.text.muted }}>
                <span>Safe</span>
                <span>At Risk</span>
                <span>Critical</span>
            </div>
            <div className="h-1 w-full rounded-full" style={{ background: `linear-gradient(to right, ${theme.chart.green}, ${theme.chart.blue}, ${theme.chart.amber}, ${theme.chart.coral})` }} />
        </div>
    );
};
