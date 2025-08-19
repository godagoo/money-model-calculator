export interface MoneyModelInputs {
  // Customer Acquisition Costs
  adSpend: number;
  salesCosts: number;
  overheadAllocation: number;
  
  // Revenue from Customer Journey (First 30 Days)
  attractionOfferRevenue: number;
  attractionOfferCosts: number;
  
  upsellRevenue: number;
  upsellCosts: number;
  upsellTakeRate: number; // percentage
  
  downsellRevenue: number;
  downsellCosts: number;
  downsellTakeRate: number; // percentage
  
  continuityFirstPayment: number;
  continuityCosts: number;
  continuityTakeRate: number; // percentage
}

export interface MoneyModelResults {
  // Core Metrics
  totalCAC: number;
  revenue30Days: number;
  costs30Days: number;
  profit30Days: number;
  
  // The Golden Ratio
  customersPayedFor: number; // profit30Days / totalCAC
  
  // Health Indicators
  isHealthy: boolean; // customersPayedFor >= 2
  cashMultiplier: number; // revenue30Days / totalCAC
  profitMargin30Days: number; // (profit30Days / revenue30Days) * 100
  
  // Breakdown by Offer Type
  attractionProfit: number;
  upsellProfit: number;
  downsellProfit: number;
  continuityProfit: number;
}