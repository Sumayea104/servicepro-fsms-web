'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface MonthlyEarning { month: string; BDT: number; USD: number }

export function EarningsChart({ data }: { data: MonthlyEarning[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Monthly earnings by currency">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={56} />
          <Tooltip />
          <Legend />
          <Bar dataKey="BDT" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="USD" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
