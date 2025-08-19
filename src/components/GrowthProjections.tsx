import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Calendar } from 'lucide-react';
import { MoneyModelInputs, MoneyModelResults } from '../types/MoneyModel';
import { ProjectionData } from '../types/CostBreakdown';

interface GrowthProjectionsProps {
  inputs: MoneyModelInputs;
  results: MoneyModelResults;
}

export const GrowthProjections: React.FC<GrowthProjectionsProps> = ({ inputs, results }) => {
  const [initialCustomers, setInitialCustomers] = useState(10);
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [reinvestmentRate, setReinvestmentRate] = useState(100); // % of profit reinvested

  const projections = useMemo(() => {
    const data: ProjectionData[] = [];
    let cumulativeCustomers = 0;
    let cumulativeProfit = 0;
    let availableForAcquisition = initialCustomers * results.totalCAC; // Initial investment

    for (let month = 1; month <= projectionMonths; month++) {
      // Calculate how many new customers we can acquire this month
      const newCustomers = Math.floor(availableForAcquisition / results.totalCAC);
      cumulativeCustomers += newCustomers;

      // Calculate revenue from all offer types
      const attractionRevenue = newCustomers * inputs.attractionOfferRevenue;
      const upsellRevenue = newCustomers * inputs.upsellRevenue * (inputs.upsellTakeRate / 100);
      const downsellRevenue = newCustomers * inputs.downsellRevenue * (inputs.downsellTakeRate / 100);
      
      // Continuity revenue includes all previous customers still subscribed
      const continuityRevenue = cumulativeCustomers * inputs.continuityFirstPayment * (inputs.continuityTakeRate / 100);
      
      const totalRevenue = attractionRevenue + upsellRevenue + downsellRevenue + continuityRevenue;

      // Calculate costs
      const acquisitionCosts = newCustomers * results.totalCAC;
      const fulfillmentCosts = newCustomers * results.costs30Days;
      const totalCosts = acquisitionCosts + fulfillmentCosts;

      // Calculate profit
      const monthProfit = totalRevenue - totalCosts;
      cumulativeProfit += monthProfit;

      // Calculate how much is available for next month's acquisition
      const profitForReinvestment = monthProfit * (reinvestmentRate / 100);
      availableForAcquisition = Math.max(0, profitForReinvestment);

      // Add to projections
      data.push({
        month,
        newCustomers,
        totalCustomers: cumulativeCustomers,
        revenue: {
          attraction: attractionRevenue,
          upsell: upsellRevenue,
          downsell: downsellRevenue,
          continuity: continuityRevenue,
          total: totalRevenue
        },
        costs: {
          cac: acquisitionCosts,
          fulfillment: fulfillmentCosts,
          total: totalCosts
        },
        profit: monthProfit,
        cumulativeProfit,
        customersPayedFor: results.customersPayedFor
      });
    }

    return data;
  }, [inputs, results, initialCustomers, projectionMonths, reinvestmentRate]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const totalRevenue = projections[projections.length - 1]?.cumulativeProfit || 0;
  const totalCustomers = projections[projections.length - 1]?.totalCustomers || 0;
  const avgMonthlyGrowth = projections.length > 1 
    ? ((projections[projections.length - 1].totalCustomers / projections[0].totalCustomers) ** (1 / (projections.length - 1)) - 1) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Growth Projections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Customers to Acquire
            </label>
            <input
              type="number"
              value={initialCustomers}
              onChange={(e) => setInitialCustomers(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
            />
            <span className="text-xs text-gray-500">
              Starting point for projections
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projection Period (Months)
            </label>
            <input
              type="number"
              value={projectionMonths}
              onChange={(e) => setProjectionMonths(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              max="36"
            />
            <span className="text-xs text-gray-500">
              How far to project (max 36)
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profit Reinvestment Rate (%)
            </label>
            <input
              type="number"
              value={reinvestmentRate}
              onChange={(e) => setReinvestmentRate(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              max="100"
            />
            <span className="text-xs text-gray-500">
              % of profit used to acquire new customers
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold">{totalCustomers.toLocaleString()}</p>
              <p className="text-xs text-gray-500">After {projectionMonths} months</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cumulative Profit</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-gray-500">Total earnings</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Monthly Growth</p>
              <p className="text-2xl font-bold">{avgMonthlyGrowth.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Customer growth rate</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Multiple</p>
              <p className="text-2xl font-bold">{results.customersPayedFor.toFixed(2)}x</p>
              <p className="text-xs text-gray-500">Customers paid for</p>
            </div>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Customer Growth Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Customer Growth Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={projections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Customers', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="newCustomers" 
              stackId="1"
              stroke="#3b82f6" 
              fill="#93c5fd" 
              name="New Customers"
            />
            <Area 
              type="monotone" 
              dataKey="totalCustomers" 
              stroke="#10b981" 
              fill="#86efac" 
              name="Total Customers"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Revenue Streams Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="revenue.attraction" stackId="a" fill="#3b82f6" name="Attraction" />
            <Bar dataKey="revenue.upsell" stackId="a" fill="#10b981" name="Upsell" />
            <Bar dataKey="revenue.downsell" stackId="a" fill="#f59e0b" name="Downsell" />
            <Bar dataKey="revenue.continuity" stackId="a" fill="#8b5cf6" name="Continuity" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Profit Growth Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Profit Growth & Accumulation
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Monthly Profit" 
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeProfit" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Cumulative Profit" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Month-by-Month Breakdown
        </h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Month</th>
              <th className="text-right py-2">New Customers</th>
              <th className="text-right py-2">Total Customers</th>
              <th className="text-right py-2">Revenue</th>
              <th className="text-right py-2">Costs</th>
              <th className="text-right py-2">Profit</th>
              <th className="text-right py-2">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((month) => (
              <tr key={month.month} className="border-b hover:bg-gray-50">
                <td className="py-2">Month {month.month}</td>
                <td className="text-right py-2">{month.newCustomers.toLocaleString()}</td>
                <td className="text-right py-2">{month.totalCustomers.toLocaleString()}</td>
                <td className="text-right py-2">{formatCurrency(month.revenue.total)}</td>
                <td className="text-right py-2">{formatCurrency(month.costs.total)}</td>
                <td className={`text-right py-2 font-semibold ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(month.profit)}
                </td>
                <td className="text-right py-2 font-bold">{formatCurrency(month.cumulativeProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold mb-3 text-blue-900">Growth Insights</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              {results.customersPayedFor >= 2 
                ? `With a ${results.customersPayedFor.toFixed(2)}x multiplier, your business can achieve exponential growth. Each customer funds ${results.customersPayedFor.toFixed(1)} new acquisitions!`
                : `Your ${results.customersPayedFor.toFixed(2)}x multiplier limits growth. Improve your offers to reach 2.0x for exponential scaling.`}
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Starting with {initialCustomers} customers and reinvesting {reinvestmentRate}% of profits, 
              you'll have {totalCustomers.toLocaleString()} customers after {projectionMonths} months.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Continuity revenue becomes increasingly important over time, 
              representing ${formatCurrency(projections[projections.length - 1]?.revenue.continuity || 0)} 
              ({((projections[projections.length - 1]?.revenue.continuity || 0) / (projections[projections.length - 1]?.revenue.total || 1) * 100).toFixed(0)}%) 
              of revenue by month {projectionMonths}.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};