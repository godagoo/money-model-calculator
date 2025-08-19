import { MoneyModelInputs } from '../types/MoneyModel';

export interface IndustryTemplate {
  name: string;
  description: string;
  inputs: MoneyModelInputs;
}

export const industryTemplates: Record<string, IndustryTemplate> = {
  gym: {
    name: "Gym (Hormozi's Example)",
    description: "Based on Alex Hormozi's gym model from $100M Offers",
    inputs: {
      adSpend: 200,
      salesCosts: 100,
      overheadAllocation: 50,
      attractionOfferRevenue: 600,
      attractionOfferCosts: 100,
      upsellRevenue: 300,
      upsellCosts: 50,
      upsellTakeRate: 50,
      downsellRevenue: 150,
      downsellCosts: 25,
      downsellTakeRate: 30,
      continuityFirstPayment: 99,
      continuityCosts: 10,
      continuityTakeRate: 40
    }
  },
  saas: {
    name: "SaaS Business",
    description: "Typical B2B SaaS with free trial to paid conversion",
    inputs: {
      adSpend: 500,
      salesCosts: 200,
      overheadAllocation: 100,
      attractionOfferRevenue: 99,  // First month at discount
      attractionOfferCosts: 20,
      upsellRevenue: 199,  // Premium plan
      upsellCosts: 30,
      upsellTakeRate: 25,
      downsellRevenue: 49,  // Basic plan for those who don't convert
      downsellCosts: 10,
      downsellTakeRate: 20,
      continuityFirstPayment: 149,  // Regular monthly price
      continuityCosts: 25,
      continuityTakeRate: 70
    }
  },
  ecommerce: {
    name: "E-commerce Store",
    description: "Physical product e-commerce with upsells",
    inputs: {
      adSpend: 30,
      salesCosts: 10,
      overheadAllocation: 10,
      attractionOfferRevenue: 49,  // Core product
      attractionOfferCosts: 20,
      upsellRevenue: 29,  // Add-on product
      upsellCosts: 10,
      upsellTakeRate: 40,
      downsellRevenue: 19,  // Smaller version
      downsellCosts: 8,
      downsellTakeRate: 15,
      continuityFirstPayment: 39,  // Subscription box
      continuityCosts: 15,
      continuityTakeRate: 20
    }
  },
  course: {
    name: "Online Course",
    description: "Info product with high margins",
    inputs: {
      adSpend: 150,
      salesCosts: 50,
      overheadAllocation: 30,
      attractionOfferRevenue: 497,  // Main course
      attractionOfferCosts: 30,  // Platform & support costs
      upsellRevenue: 297,  // Advanced module
      upsellCosts: 10,
      upsellTakeRate: 35,
      downsellRevenue: 97,  // Mini course
      downsellCosts: 5,
      downsellTakeRate: 25,
      continuityFirstPayment: 47,  // Monthly membership
      continuityCosts: 5,
      continuityTakeRate: 30
    }
  },
  agency: {
    name: "Marketing Agency",
    description: "Service business with retainer model",
    inputs: {
      adSpend: 300,
      salesCosts: 500,  // High sales cost for B2B
      overheadAllocation: 200,
      attractionOfferRevenue: 1500,  // Setup/audit fee
      attractionOfferCosts: 300,  // Delivery costs
      upsellRevenue: 500,  // Additional services
      upsellCosts: 100,
      upsellTakeRate: 60,
      downsellRevenue: 500,  // Smaller package
      downsellCosts: 100,
      downsellTakeRate: 20,
      continuityFirstPayment: 2000,  // Monthly retainer
      continuityCosts: 800,
      continuityTakeRate: 80
    }
  },
  consulting: {
    name: "Consulting Business",
    description: "High-ticket consulting with implementation",
    inputs: {
      adSpend: 500,
      salesCosts: 300,
      overheadAllocation: 100,
      attractionOfferRevenue: 2000,  // Strategy session
      attractionOfferCosts: 200,
      upsellRevenue: 5000,  // Full implementation
      upsellCosts: 1000,
      upsellTakeRate: 30,
      downsellRevenue: 997,  // DIY course
      downsellCosts: 50,
      downsellTakeRate: 40,
      continuityFirstPayment: 497,  // Group coaching
      continuityCosts: 50,
      continuityTakeRate: 25
    }
  },
  coaching: {
    name: "Coaching Program",
    description: "Personal or business coaching",
    inputs: {
      adSpend: 200,
      salesCosts: 100,
      overheadAllocation: 50,
      attractionOfferRevenue: 297,  // Discovery package
      attractionOfferCosts: 30,
      upsellRevenue: 1997,  // 3-month intensive
      upsellCosts: 200,
      upsellTakeRate: 25,
      downsellRevenue: 97,  // Group sessions
      downsellCosts: 10,
      downsellTakeRate: 35,
      continuityFirstPayment: 297,  // Monthly coaching
      continuityCosts: 30,
      continuityTakeRate: 50
    }
  },
  blank: {
    name: "Start from Scratch",
    description: "Empty template to input your own numbers",
    inputs: {
      adSpend: 0,
      salesCosts: 0,
      overheadAllocation: 0,
      attractionOfferRevenue: 0,
      attractionOfferCosts: 0,
      upsellRevenue: 0,
      upsellCosts: 0,
      upsellTakeRate: 0,
      downsellRevenue: 0,
      downsellCosts: 0,
      downsellTakeRate: 0,
      continuityFirstPayment: 0,
      continuityCosts: 0,
      continuityTakeRate: 0
    }
  }
};