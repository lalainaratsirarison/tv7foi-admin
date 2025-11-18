"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface VideoChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#1e1b73', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function VideoChart({ data }: VideoChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Pas assez de données pour afficher le graphique.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            interval={0} // Affiche toutes les étiquettes
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
        />
        <YAxis allowDecimals={false} />
        <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}