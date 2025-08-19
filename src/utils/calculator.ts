import { MoneyModelInputs, MoneyModelResults } from '../types/MoneyModel';

export function calculateMoneyModel(inputs: MoneyModelInputs): MoneyModelResults {
  // Calculate Total CAC
  const totalCAC = inputs.adSpend + inputs.salesCosts + inputs.overheadAllocation;
  
  // Calculate Revenue per Offer Type (weighted by take rates)
  const attractionRev = inputs.attractionOfferRevenue;
  const upsellRev = inputs.upsellRevenue * (inputs.upsellTakeRate / 100);
  const downsellRev = inputs.downsellRevenue * (inputs.downsellTakeRate / 100);
  const continuityRev = inputs.continuityFirstPayment * (inputs.continuityTakeRate / 100);
  
  // Calculate Costs per Offer Type
  const attractionCost = inputs.attractionOfferCosts;
  const upsellCost = inputs.upsellCosts * (inputs.upsellTakeRate / 100);
  const downsellCost = inputs.downsellCosts * (inputs.downsellTakeRate / 100);
  const continuityCost = inputs.continuityCosts * (inputs.continuityTakeRate / 100);
  
  // Calculate Totals
  const revenue30Days = attractionRev + upsellRev + downsellRev + continuityRev;
  const costs30Days = attractionCost + upsellCost + downsellCost + continuityCost;
  const profit30Days = revenue30Days - costs30Days - totalCAC;
  
  // Calculate Key Metrics
  const customersPayedFor = totalCAC > 0 ? profit30Days / totalCAC : 0;
  const cashMultiplier = totalCAC > 0 ? revenue30Days / totalCAC : 0;
  const profitMargin30Days = revenue30Days > 0 ? (profit30Days / revenue30Days) * 100 : 0;
  
  return {
    totalCAC,
    revenue30Days,
    costs30Days,
    profit30Days,
    customersPayedFor,
    isHealthy: customersPayedFor >= 2,
    cashMultiplier,
    profitMargin30Days,
    attractionProfit: attractionRev - attractionCost,
    upsellProfit: upsellRev - upsellCost,
    downsellProfit: downsellRev - downsellCost,
    continuityProfit: continuityRev - continuityCost,
  };
}