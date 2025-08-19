export interface CostItem {
  id: string;
  name: string;
  amount: number;
  category: 'sales' | 'attraction' | 'upsell' | 'downsell' | 'continuity' | 'overhead';
  description?: string;
}

export interface DetailedCosts {
  salesCosts: CostItem[];
  attractionCosts: CostItem[];
  upsellCosts: CostItem[];
  downsellCosts: CostItem[];
  continuityCosts: CostItem[];
  overheadCosts: CostItem[];
}

export interface ProjectionData {
  month: number;
  newCustomers: number;
  totalCustomers: number;
  revenue: {
    attraction: number;
    upsell: number;
    downsell: number;
    continuity: number;
    total: number;
  };
  costs: {
    cac: number;
    fulfillment: number;
    total: number;
  };
  profit: number;
  cumulativeProfit: number;
  customersPayedFor: number;
}