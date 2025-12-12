import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HistoryItem } from '../types';

interface HistoryChartProps {
  history: HistoryItem[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ history }) => {
  // Aggregate data
  const dataMap = history.reduce((acc, item) => {
    const category = item.primary_category === 'None' ? 'Safe' : item.primary_category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(dataMap).map(key => ({
    name: key,
    count: dataMap[key],
  }));

  const COLORS: Record<string, string> = {
    'Safe': '#22c55e', // Green-500
    'Harassment': '#ef4444', // Red-500
    'Sexual': '#db2777', // Pink-600
    'Misinformation': '#f59e0b', // Amber-500
    'Age-Inappropriate': '#8b5cf6', // Violet-500
  };

  if (history.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p>No analysis history yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Category Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            interval={0}
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 7)}...` : value}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;