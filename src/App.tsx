import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, BookOpen, Download, BarChart3, Receipt, TrendingUp } from 'lucide-react';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { WaterfallChart } from './components/WaterfallChart';
import { CostBreakdown } from './components/CostBreakdown';
import { GrowthProjections } from './components/GrowthProjections';
import { calculateMoneyModel } from './utils/calculator';
import { industryTemplates } from './utils/templates';
import { MoneyModelInputs, MoneyModelResults } from './types/MoneyModel';
import './App.css';

function App() {
  const [inputs, setInputs] = useState<MoneyModelInputs>(industryTemplates.gym.inputs);
  const [results, setResults] = useState<MoneyModelResults | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('gym');
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'chart' | 'costs' | 'projections'>('inputs');

  useEffect(() => {
    const calculatedResults = calculateMoneyModel(inputs);
    setResults(calculatedResults);
  }, [inputs]);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setInputs(industryTemplates[templateKey].inputs);
  };

  const handleCostUpdate = useCallback((costUpdates: Partial<MoneyModelInputs>) => {
    setInputs(prev => ({
      ...prev,
      ...costUpdates
    }));
  }, []);

  const exportToCSV = () => {
    if (!results) return;
    
    const csvContent = `
Money Model Calculator Results
==============================
Customer Acquisition Costs
Ad Spend,${inputs.adSpend}
Sales Costs,${inputs.salesCosts}
Overhead Allocation,${inputs.overheadAllocation}
Total CAC,${results.totalCAC}

Offer Performance
Attraction Revenue,${inputs.attractionOfferRevenue}
Attraction Costs,${inputs.attractionOfferCosts}
Attraction Profit,${results.attractionProfit}

Upsell Revenue,${inputs.upsellRevenue * (inputs.upsellTakeRate / 100)}
Upsell Costs,${inputs.upsellCosts * (inputs.upsellTakeRate / 100)}
Upsell Profit,${results.upsellProfit}

Downsell Revenue,${inputs.downsellRevenue * (inputs.downsellTakeRate / 100)}
Downsell Costs,${inputs.downsellCosts * (inputs.downsellTakeRate / 100)}
Downsell Profit,${results.downsellProfit}

Continuity Revenue,${inputs.continuityFirstPayment * (inputs.continuityTakeRate / 100)}
Continuity Costs,${inputs.continuityCosts * (inputs.continuityTakeRate / 100)}
Continuity Profit,${results.continuityProfit}

Key Metrics
Total Revenue (30 Days),${results.revenue30Days}
Total Costs (30 Days),${results.costs30Days}
Net Profit (30 Days),${results.profit30Days}
Customers Paid For,${results.customersPayedFor}
Cash Multiplier,${results.cashMultiplier}
Profit Margin,${results.profitMargin30Days}%
Model Health,${results.isHealthy ? 'Healthy' : 'Needs Improvement'}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `money-model-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Calculator className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Money Model Calculator</h1>
                <p className="text-xs text-gray-500">Based on Alex Hormozi's $100M Offers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToCSV}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Template Selector */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Templates:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="bg-blue-700 text-white border border-blue-500 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              {Object.entries(industryTemplates).map(([key, template]) => (
                <option key={key} value={key}>
                  {template.name}
                </option>
              ))}
            </select>
            <span className="text-xs opacity-75 ml-2">
              {industryTemplates[selectedTemplate].description}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="sm:hidden bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'inputs' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'results' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'chart' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'costs' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
          >
            Costs
          </button>
          <button
            onClick={() => setActiveTab('projections')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'projections' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
          >
            Growth
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form - Left Column on Desktop, Tab on Mobile */}
          <div className={`${activeTab === 'inputs' ? 'block' : 'hidden'} sm:block`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Input Your Numbers
              </h2>
              <InputForm inputs={inputs} onChange={setInputs} />
            </div>
          </div>

          {/* Results - Right Column on Desktop, Tab on Mobile */}
          <div className={`${activeTab === 'results' ? 'block' : 'hidden'} sm:block`}>
            <div className="space-y-6">
              {results && <ResultsDashboard results={results} />}
            </div>
          </div>
        </div>

        {/* Waterfall Chart - Full Width Below on Desktop, Tab on Mobile */}
        <div className={`mt-8 ${activeTab === 'chart' ? 'block' : 'hidden'} sm:block`}>
          {results && <WaterfallChart results={results} />}
        </div>

        {/* Cost Breakdown - Full Width on Desktop, Tab on Mobile */}
        <div className={`mt-8 ${activeTab === 'costs' ? 'block' : 'hidden'} lg:block`}>
          <CostBreakdown 
            onCostsChange={handleCostUpdate}
            currentInputs={inputs}
          />
        </div>

        {/* Growth Projections - Full Width on Desktop, Tab on Mobile */}
        <div className={`mt-8 ${activeTab === 'projections' ? 'block' : 'hidden'} lg:block`}>
          {results && <GrowthProjections inputs={inputs} results={results} />}
        </div>

        {/* Formula Explanation */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            The Money Model Formula
          </h3>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-3">
              <strong>The Core Principle:</strong> A healthy business model should generate enough profit from 1 customer 
              to pay for acquiring 2+ more customers within 30 days.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-mono text-sm mb-2">
                Customers Paid For = (30-Day Profit) / (Total CAC)
              </p>
              <p className="text-sm">
                If this ratio is ≥ 2.0, your business can scale profitably through paid acquisition.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Why 30 Days?</p>
                <p>Cash flow timing matters. You need to recoup your investment quickly to reinvest in growth.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Why 2.0+ Ratio?</p>
                <p>1 pays for the customer you acquired, the other 2 fuel exponential growth without external capital.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;