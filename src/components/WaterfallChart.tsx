import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MoneyModelResults } from '../types/MoneyModel';

interface WaterfallChartProps {
  results: MoneyModelResults;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({ results }) => {
  const data = [
    { 
      name: 'CAC', 
      value: -results.totalCAC, 
      color: '#ef4444',
      displayValue: -results.totalCAC
    },
    { 
      name: 'Attraction', 
      value: results.attractionProfit, 
      color: results.attractionProfit >= 0 ? '#3b82f6' : '#ef4444',
      displayValue: results.attractionProfit
    },
    { 
      name: 'Upsell', 
      value: results.upsellProfit, 
      color: results.upsellProfit >= 0 ? '#10b981' : '#ef4444',
      displayValue: results.upsellProfit
    },
    { 
      name: 'Downsell', 
      value: results.downsellProfit, 
      color: results.downsellProfit >= 0 ? '#f59e0b' : '#ef4444',
      displayValue: results.downsellProfit
    },
    { 
      name: 'Continuity', 
      value: results.continuityProfit, 
      color: results.continuityProfit >= 0 ? '#8b5cf6' : '#ef4444',
      displayValue: results.continuityProfit
    },
    { 
      name: 'Net Profit', 
      value: results.profit30Days, 
      color: results.isHealthy ? '#10b981' : '#ef4444',
      displayValue: results.profit30Days
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className={payload[0].value >= 0 ? 'text-green-600' : 'text-red-600'}>
            ${Math.abs(payload[0].value).toFixed(0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4">Profit Waterfall (30 Days)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#6b7280" strokeWidth={2} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          This waterfall shows how your profit builds up from each offer type after accounting for Customer Acquisition Costs (CAC).
        </p>
      </div>
    </div>
  );
};