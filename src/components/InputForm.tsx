import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Package, Info } from 'lucide-react';
import { MoneyModelInputs } from '../types/MoneyModel';

interface InputFormProps {
  inputs: MoneyModelInputs;
  onChange: (inputs: MoneyModelInputs) => void;
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block ml-1">
      <Info 
        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help inline"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
          <div className="relative">
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const InputForm: React.FC<InputFormProps> = ({ inputs, onChange }) => {
  // Track which fields are being edited (show empty string instead of 0)
  const [focusedFields, setFocusedFields] = useState<Set<keyof MoneyModelInputs>>(new Set());

  const handleChange = (field: keyof MoneyModelInputs, value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // If the field is empty, set it to 0 in the model
    const numValue = cleanValue === '' ? 0 : parseFloat(cleanValue) || 0;
    onChange({
      ...inputs,
      [field]: numValue
    });
  };

  const handleFocus = (field: keyof MoneyModelInputs, e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedFields(new Set(focusedFields).add(field));
    // Select all text when focusing on a field with value 0
    if (inputs[field] === 0) {
      e.target.select();
    }
  };

  const handleBlur = (field: keyof MoneyModelInputs) => {
    const newFocusedFields = new Set(focusedFields);
    newFocusedFields.delete(field);
    setFocusedFields(newFocusedFields);
  };

  // Helper function to get display value
  const getDisplayValue = (field: keyof MoneyModelInputs): string => {
    const value = inputs[field];
    // If focused and value is 0, show empty string for better UX
    if (focusedFields.has(field) && value === 0) {
      return '';
    }
    // Show empty string for 0 values when not focused (cleaner UI)
    return value === 0 ? '' : value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Customer Acquisition Costs Section */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="font-bold text-red-900 mb-1 flex items-center">
          <DollarSign className="inline w-4 h-4 mr-2" />
          Customer Acquisition Costs
        </h3>
        <p className="text-xs text-red-700 mb-3">The total cost to acquire one customer</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Spend
              <InfoTooltip text="Money spent on paid advertising (Facebook, Google, etc.) to generate leads or sales. This is your direct marketing investment per customer." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('adSpend')}
              onChange={(e) => handleChange('adSpend', e.target.value)}
              onFocus={(e) => handleFocus('adSpend', e)}
              onBlur={() => handleBlur('adSpend')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="200"
            />
            <span className="text-xs text-gray-500">Per customer acquired</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sales Costs
              <InfoTooltip text="Cost of sales team, commissions, CRM tools, and sales activities required to convert a lead into a customer. Include both fixed and variable sales costs." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('salesCosts')}
              onChange={(e) => handleChange('salesCosts', e.target.value)}
              onFocus={(e) => handleFocus('salesCosts', e)}
              onBlur={() => handleBlur('salesCosts')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="100"
            />
            <span className="text-xs text-gray-500">Sales team & tools</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overhead Allocation
              <InfoTooltip text="Portion of general business expenses (rent, utilities, admin staff, software) allocated to each customer acquisition. Usually 10-20% of direct costs." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('overheadAllocation')}
              onChange={(e) => handleChange('overheadAllocation', e.target.value)}
              onFocus={(e) => handleFocus('overheadAllocation', e)}
              onBlur={() => handleBlur('overheadAllocation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="50"
            />
            <span className="text-xs text-gray-500">Fixed costs portion</span>
          </div>
        </div>
      </div>
      
      {/* Attraction Offer Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-1 flex items-center">
          <Package className="inline w-4 h-4 mr-2" />
          Attraction Offer (100% take rate)
        </h3>
        <p className="text-xs text-blue-700 mb-3">Your main front-end offer that attracts customers - everyone who buys gets this</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue
              <InfoTooltip text="The price of your main product/service. This is what customers pay for your core offer (e.g., gym membership, course, product). Should be attractive enough to overcome buying resistance." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('attractionOfferRevenue')}
              onChange={(e) => handleChange('attractionOfferRevenue', e.target.value)}
              onFocus={(e) => handleFocus('attractionOfferRevenue', e)}
              onBlur={() => handleBlur('attractionOfferRevenue')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="600"
            />
            <span className="text-xs text-gray-500">Price customer pays</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costs
              <InfoTooltip text="Direct costs to deliver your main offer (product costs, fulfillment, shipping, support). For services, include time cost and any materials. Keep this as low as possible while maintaining quality." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('attractionOfferCosts')}
              onChange={(e) => handleChange('attractionOfferCosts', e.target.value)}
              onFocus={(e) => handleFocus('attractionOfferCosts', e)}
              onBlur={() => handleBlur('attractionOfferCosts')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
            />
            <span className="text-xs text-gray-500">Delivery & fulfillment</span>
          </div>
        </div>
      </div>
      
      {/* Upsell Section */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-bold text-green-900 mb-1 flex items-center">
          <TrendingUp className="inline w-4 h-4 mr-2" />
          Upsells
        </h3>
        <p className="text-xs text-green-700 mb-3">Additional offers presented immediately after the main purchase</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue
              <InfoTooltip text="Price of your upsell offer (premium version, add-ons, faster delivery, extended warranty). Should complement and enhance the main offer. Typically 50-100% of main offer price." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('upsellRevenue')}
              onChange={(e) => handleChange('upsellRevenue', e.target.value)}
              onFocus={(e) => handleFocus('upsellRevenue', e)}
              onBlur={() => handleBlur('upsellRevenue')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="300"
            />
            <span className="text-xs text-gray-500">Price if they buy</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costs
              <InfoTooltip text="Direct costs to deliver the upsell. Often lower margin than main offer since customer is already acquired. Include any additional fulfillment or support costs." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('upsellCosts')}
              onChange={(e) => handleChange('upsellCosts', e.target.value)}
              onFocus={(e) => handleFocus('upsellCosts', e)}
              onBlur={() => handleBlur('upsellCosts')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="50"
            />
            <span className="text-xs text-gray-500">Delivery cost</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take Rate (%)
              <InfoTooltip text="Percentage of customers who accept the upsell. Good upsells achieve 30-50%. Improve by making it irresistible and presenting at the right moment (post-purchase high)." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('upsellTakeRate')}
              onChange={(e) => handleChange('upsellTakeRate', e.target.value)}
              onFocus={(e) => handleFocus('upsellTakeRate', e)}
              onBlur={() => handleBlur('upsellTakeRate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="50"
              min="0"
              max="100"
            />
            <span className="text-xs text-gray-500">% who accept</span>
          </div>
        </div>
      </div>
      
      {/* Downsell Section */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-yellow-900 mb-1 flex items-center">
          <Package className="inline w-4 h-4 mr-2" />
          Downsells
        </h3>
        <p className="text-xs text-yellow-700 mb-3">Smaller offers for those who decline the upsell - captures additional value</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue
              <InfoTooltip text="Price of downsell offer (payment plan, lite version, smaller quantity). Presented to those who said no to upsell. Should be easier to say yes to - remove risk or reduce price." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('downsellRevenue')}
              onChange={(e) => handleChange('downsellRevenue', e.target.value)}
              onFocus={(e) => handleFocus('downsellRevenue', e)}
              onBlur={() => handleBlur('downsellRevenue')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="150"
            />
            <span className="text-xs text-gray-500">Fallback price</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costs
              <InfoTooltip text="Direct costs for the downsell offer. Usually proportionally lower than upsell since it's a smaller offer. Keep margins healthy even at lower price point." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('downsellCosts')}
              onChange={(e) => handleChange('downsellCosts', e.target.value)}
              onFocus={(e) => handleFocus('downsellCosts', e)}
              onBlur={() => handleBlur('downsellCosts')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="25"
            />
            <span className="text-xs text-gray-500">Delivery cost</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take Rate (%)
              <InfoTooltip text="Percentage who accept the downsell after declining upsell. Typically 20-40%. Improves when positioned as 'last chance' or 'special deal just for you'." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('downsellTakeRate')}
              onChange={(e) => handleChange('downsellTakeRate', e.target.value)}
              onFocus={(e) => handleFocus('downsellTakeRate', e)}
              onBlur={() => handleBlur('downsellTakeRate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="30"
              min="0"
              max="100"
            />
            <span className="text-xs text-gray-500">% who accept</span>
          </div>
        </div>
      </div>
      
      {/* Continuity Section */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-bold text-purple-900 mb-1 flex items-center">
          <Users className="inline w-4 h-4 mr-2" />
          Continuity (30-Day Revenue)
        </h3>
        <p className="text-xs text-purple-700 mb-3">Recurring revenue from subscriptions or memberships within first 30 days</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Payment
              <InfoTooltip text="First month's payment for subscription/membership (monthly coaching, software, supplement subscription). Recurring revenue is the holy grail - focus on retention." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('continuityFirstPayment')}
              onChange={(e) => handleChange('continuityFirstPayment', e.target.value)}
              onFocus={(e) => handleFocus('continuityFirstPayment', e)}
              onBlur={() => handleBlur('continuityFirstPayment')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="99"
            />
            <span className="text-xs text-gray-500">Monthly subscription</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costs
              <InfoTooltip text="Monthly cost to service the subscription (hosting, support, content creation, product costs). Keep this low to maximize lifetime value. Automation helps." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('continuityCosts')}
              onChange={(e) => handleChange('continuityCosts', e.target.value)}
              onFocus={(e) => handleFocus('continuityCosts', e)}
              onBlur={() => handleBlur('continuityCosts')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="10"
            />
            <span className="text-xs text-gray-500">Monthly service cost</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take Rate (%)
              <InfoTooltip text="Percentage who join the continuity program. Can be automatic (included with purchase) or optional. Higher take rates with trials or first month discounts." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={getDisplayValue('continuityTakeRate')}
              onChange={(e) => handleChange('continuityTakeRate', e.target.value)}
              onFocus={(e) => handleFocus('continuityTakeRate', e)}
              onBlur={() => handleBlur('continuityTakeRate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="40"
              min="0"
              max="100"
            />
            <span className="text-xs text-gray-500">% who subscribe</span>
          </div>
        </div>
      </div>
    </div>
  );
};