'use client';

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#f59e0b', '#0ea5e9', '#6366f1', '#8b5cf6', '#10b981', '#f43f5e'];

export function JobsByStatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Jobs by status">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsersByRoleChart({ data }: { data: { role: string; users: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Users by role">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="role" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
          <Tooltip />
          <Bar dataKey="users" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
