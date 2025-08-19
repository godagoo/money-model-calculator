import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, DollarSign, Package, TrendingUp, Users, Briefcase, Home } from 'lucide-react';
import { CostItem, DetailedCosts } from '../types/CostBreakdown';
import { MoneyModelInputs } from '../types/MoneyModel';

interface CostBreakdownProps {
  onCostsChange: (inputs: Partial<MoneyModelInputs>) => void;
  currentInputs: MoneyModelInputs;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ onCostsChange, currentInputs }) => {
  const [costs, setCosts] = useState<DetailedCosts>({
    salesCosts: [],
    attractionCosts: [],
    upsellCosts: [],
    downsellCosts: [],
    continuityCosts: [],
    overheadCosts: []
  });

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<CostItem>>({});
  const [addingCategory, setAddingCategory] = useState<string | null>(null);

  // Calculate totals and update main inputs whenever costs change
  useEffect(() => {
    const salesTotal = costs.salesCosts.reduce((sum, item) => sum + item.amount, 0);
    const attractionTotal = costs.attractionCosts.reduce((sum, item) => sum + item.amount, 0);
    const upsellTotal = costs.upsellCosts.reduce((sum, item) => sum + item.amount, 0);
    const downsellTotal = costs.downsellCosts.reduce((sum, item) => sum + item.amount, 0);
    const continuityTotal = costs.continuityCosts.reduce((sum, item) => sum + item.amount, 0);
    const overheadTotal = costs.overheadCosts.reduce((sum, item) => sum + item.amount, 0);

    onCostsChange({
      salesCosts: salesTotal,
      attractionOfferCosts: attractionTotal,
      upsellCosts: upsellTotal,
      downsellCosts: downsellTotal,
      continuityCosts: continuityTotal,
      overheadAllocation: overheadTotal
    });
  }, [costs]); // Remove onCostsChange from dependencies

  const addCostItem = (category: keyof DetailedCosts) => {
    if (!newItem.name || !newItem.amount) return;

    const item: CostItem = {
      id: Date.now().toString(),
      name: newItem.name,
      amount: newItem.amount,
      category: category.replace('Costs', '') as any,
      description: newItem.description
    };

    setCosts(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }));

    setNewItem({});
    setAddingCategory(null);
  };

  const removeCostItem = (category: keyof DetailedCosts, id: string) => {
    setCosts(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const updateCostItem = (category: keyof DetailedCosts, id: string, updates: Partial<CostItem>) => {
    setCosts(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
    setEditingItem(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'salesCosts': return <Briefcase className="w-5 h-5" />;
      case 'attractionCosts': return <Package className="w-5 h-5" />;
      case 'upsellCosts': return <TrendingUp className="w-5 h-5" />;
      case 'downsellCosts': return <Package className="w-5 h-5" />;
      case 'continuityCosts': return <Users className="w-5 h-5" />;
      case 'overheadCosts': return <Home className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'salesCosts': return 'orange';
      case 'attractionCosts': return 'blue';
      case 'upsellCosts': return 'green';
      case 'downsellCosts': return 'yellow';
      case 'continuityCosts': return 'purple';
      case 'overheadCosts': return 'red';
      default: return 'gray';
    }
  };

  const renderCostCategory = (
    category: keyof DetailedCosts,
    title: string,
    description: string
  ) => {
    const items = costs[category];
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const color = getCategoryColor(category);

    return (
      <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {getCategoryIcon(category)}
            <h3 className={`font-bold text-${color}-900 ml-2`}>{title}</h3>
          </div>
          <div className={`text-lg font-bold text-${color}-900`}>
            Total: ${total.toFixed(0)}
          </div>
        </div>
        <p className={`text-xs text-${color}-700 mb-3`}>{description}</p>

        {/* List of cost items */}
        <div className="space-y-2 mb-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-2 rounded border border-gray-200">
              {editingItem === item.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateCostItem(category, item.id, { name: e.target.value })}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateCostItem(category, item.id, { amount: parseFloat(e.target.value) || 0 })}
                    className="w-24 px-2 py-1 border rounded text-sm"
                  />
                  <button
                    onClick={() => setEditingItem(null)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500">{item.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${item.amount.toFixed(0)}</span>
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeCostItem(category, item.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add new item form */}
        {addingCategory === category ? (
          <div className="bg-white p-3 rounded border-2 border-dashed border-gray-300">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Cost item name (e.g., Facebook Ads, Sales Manager)"
                value={newItem.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={newItem.amount || ''}
                  onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
                <button
                  onClick={() => addCostItem(category)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setAddingCategory(null);
                    setNewItem({});
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                placeholder="Optional description"
                value={newItem.description || ''}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCategory(category)}
            className={`w-full py-2 border-2 border-dashed border-${color}-300 text-${color}-700 rounded hover:bg-${color}-100 flex items-center justify-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            Add Cost Item
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Detailed Cost Breakdown</h2>
        <p className="text-sm text-gray-600 mb-4">
          Break down your costs into specific line items for better accuracy and understanding.
          These totals will automatically update your main calculator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCostCategory(
          'salesCosts',
          'Sales Costs',
          'Salaries, commissions, CRM tools, sales training, etc.'
        )}
        
        {renderCostCategory(
          'overheadCosts',
          'Overhead Allocation',
          'Rent, utilities, admin staff, software, insurance, etc.'
        )}

        {renderCostCategory(
          'attractionCosts',
          'Attraction Offer Costs',
          'Product costs, fulfillment, shipping, customer support, etc.'
        )}

        {renderCostCategory(
          'upsellCosts',
          'Upsell Costs',
          'Premium features, expedited delivery, additional support, etc.'
        )}

        {renderCostCategory(
          'downsellCosts',
          'Downsell Costs',
          'Lite version costs, payment plan fees, reduced service costs, etc.'
        )}

        {renderCostCategory(
          'continuityCosts',
          'Continuity/Recurring Costs',
          'Monthly service delivery, content creation, platform fees, etc.'
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-3">Cost Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total CAC:</span>
            <span className="ml-2 font-bold">
              ${(costs.salesCosts.reduce((s, i) => s + i.amount, 0) + 
                 costs.overheadCosts.reduce((s, i) => s + i.amount, 0) + 
                 currentInputs.adSpend).toFixed(0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Fulfillment:</span>
            <span className="ml-2 font-bold">
              ${(costs.attractionCosts.reduce((s, i) => s + i.amount, 0) +
                 costs.upsellCosts.reduce((s, i) => s + i.amount, 0) +
                 costs.downsellCosts.reduce((s, i) => s + i.amount, 0) +
                 costs.continuityCosts.reduce((s, i) => s + i.amount, 0)).toFixed(0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">All Costs:</span>
            <span className="ml-2 font-bold">
              ${Object.values(costs).flat().reduce((sum, item) => sum + item.amount, 0).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};