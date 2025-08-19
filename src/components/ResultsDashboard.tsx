import React from 'react';
import { CheckCircle, XCircle, TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { MoneyModelResults } from '../types/MoneyModel';

interface ResultsDashboardProps {
  results: MoneyModelResults;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className={`bg-white p-4 rounded-lg border-2 border-${color}-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  const healthBgColor = results.isHealthy ? 'bg-green-100' : 'bg-red-100';
  const healthBorderColor = results.isHealthy ? 'border-green-500' : 'border-red-500';
  const healthTextColor = results.isHealthy ? 'text-green-900' : 'text-red-900';
  
  return (
    <div className="space-y-6">
      {/* Hero Metric */}
      <div className={`${healthBgColor} p-6 rounded-lg border-2 ${healthBorderColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${healthTextColor}`}>
              Customers Paid For
            </h2>
            <p className={`text-5xl font-bold ${healthTextColor} mt-2`}>
              {results.customersPayedFor.toFixed(2)}
            </p>
            <p className="text-sm mt-2 text-gray-700">
              Target: 2.0+ customers (You pay for 1, profit pays for 2 more)
            </p>
            {results.isHealthy ? (
              <p className="text-sm font-semibold text-green-700 mt-2">
                ✅ Healthy! Your business model can scale profitably.
              </p>
            ) : (
              <p className="text-sm font-semibold text-red-700 mt-2">
                ⚠️ Needs improvement. Optimize your offers to reach 2.0+
              </p>
            )}
          </div>
          {results.isHealthy ? (
            <CheckCircle className="w-20 h-20 text-green-500" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500" />
          )}
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="30-Day Profit" 
          value={`$${results.profit30Days.toFixed(0)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color={results.profit30Days >= 0 ? 'green' : 'red'}
        />
        <MetricCard 
          title="Cash Multiplier" 
          value={`${results.cashMultiplier.toFixed(2)}x`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard 
          title="Total CAC" 
          value={`$${results.totalCAC.toFixed(0)}`}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
        <MetricCard 
          title="Profit Margin" 
          value={`${results.profitMargin30Days.toFixed(1)}%`}
          icon={<Target className="w-6 h-6" />}
          color={results.profitMargin30Days >= 30 ? 'green' : 'yellow'}
        />
      </div>
      
      {/* Revenue & Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold mb-3">Revenue Breakdown (30 Days)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue:</span>
              <span className="font-semibold">${results.revenue30Days.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Product Costs:</span>
              <span className="font-semibold">-${results.costs30Days.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer Acquisition:</span>
              <span className="font-semibold">-${results.totalCAC.toFixed(0)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold">Net Profit:</span>
              <span className={`font-bold ${results.profit30Days >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.profit30Days.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold mb-3">Profit by Offer Type</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Attraction Offer:</span>
              <span className={`font-semibold ${results.attractionProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.attractionProfit.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Upsells:</span>
              <span className={`font-semibold ${results.upsellProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.upsellProfit.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Downsells:</span>
              <span className={`font-semibold ${results.downsellProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.downsellProfit.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Continuity:</span>
              <span className={`font-semibold ${results.continuityProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${results.continuityProfit.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insights Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-3">Key Insights</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              {results.customersPayedFor >= 2 
                ? "✅ Your model is scalable! Each customer generates enough profit to acquire 2+ more customers."
                : results.customersPayedFor >= 1
                ? "⚠️ You're breaking even but not scaling. Improve offers to reach 2.0+ ratio."
                : "❌ You're losing money on each customer. Review your CAC and pricing strategy."}
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Your cash multiplier is {results.cashMultiplier.toFixed(2)}x, meaning you generate ${results.cashMultiplier.toFixed(2)} 
              for every $1 spent on customer acquisition.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              {results.profitMargin30Days >= 30 
                ? "Strong profit margin indicates healthy pricing and cost structure."
                : results.profitMargin30Days >= 15
                ? "Moderate profit margin. Consider optimizing costs or increasing prices."
                : "Low profit margin. Focus on reducing costs or increasing average order value."}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};