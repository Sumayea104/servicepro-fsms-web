'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface MonthlyEarning { month: string; BDT: number; USD: number }
const tooltipStyle = { borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 8px 24px -8px rgba(5,11,36,.25)', fontSize: 13 };

export function EarningsChart({ data }: { data: MonthlyEarning[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Monthly earnings by currency">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8b97b4', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} width={56} tick={{ fill: '#8b97b4', fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="BDT" fill="#3b5bdb" radius={[8, 8, 0, 0]} />
          <Bar dataKey="USD" fill="#f5b942" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
