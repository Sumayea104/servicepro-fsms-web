'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#f5b942', '#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f43f5e'];
const tooltipStyle = { borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 8px 24px -8px rgba(5,11,36,.25)', fontSize: 13 };
const axis = { tickLine: false, axisLine: false, tick: { fill: '#8b97b4', fontSize: 12 } } as const;

export function DonutChart({ data, label }: { data: { name: string; value: number }[]; label: string }) {
  return (
    <div className="h-72 w-full" role="img" aria-label={label}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={98} paddingAngle={3} stroke="none">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export const JobsByStatusChart = ({ data }: { data: { name: string; value: number }[] }) => <DonutChart data={data} label="Jobs by status" />;

export function JobsTrendChart({ data }: { data: { day: string; jobs: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="New requests per day">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: -18, right: 6, top: 8 }}>
          <defs><linearGradient id="trend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b5bdb" stopOpacity={0.35} /><stop offset="100%" stopColor="#3b5bdb" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="day" {...axis} interval="preserveStartEnd" />
          <YAxis allowDecimals={false} {...axis} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="jobs" name="New requests" stroke="#3b5bdb" strokeWidth={2.5} fill="url(#trend)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsersByRoleChart({ data }: { data: { role: string; users: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Users by role">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="role" {...axis} /><YAxis allowDecimals={false} {...axis} width={32} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="users" fill="#3b5bdb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
