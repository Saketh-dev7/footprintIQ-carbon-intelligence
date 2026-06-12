import { AssessmentState, FootprintData } from '@/types';

/**
 * @fileOverview Core Carbon Intelligence Engine.
 * Contains validated emission factors and calculation logic for all lifestyle pillars.
 */

export const FACTORS = {
  TRANSPORT: {
    GAS: 0.19, // kg CO2e per km
    ELECTRIC: 0.05,
    HYBRID: 0.12,
    FLIGHT: 250, // Average kg CO2e per short/medium haul flight
  },
  FOOD: {
    VEGAN: 1.5, // kg CO2e per day
    VEGETARIAN: 2.2,
    OMNIVORE: 3.5,
    HEAVY_MEAT: 5.5,
  },
  ENERGY: {
    ELECTRICITY: 0.4, // kg CO2e per kWh
    AC_SURCHARGE: 50, // Monthly overhead for high climate control
  },
  SHOPPING: {
    ONLINE_ORDER: 2.5,
    CLOTHING_ITEM: 15,
  },
  WASTE: {
    RECYCLING_OFFSET: -20,
    BASE_WASTE: 30,
  }
} as const;

function normalizeKey(val: string): string {
  return val.toUpperCase().replace(/-/g, '_');
}

export function calculateTransportEmission(state: AssessmentState): number {
  let commuteEmission = 0;
  if (state.vehicleType !== 'none') {
    const key = normalizeKey(state.vehicleType);
    const factor = FACTORS.TRANSPORT[key as keyof typeof FACTORS.TRANSPORT] || 0;
    commuteEmission = state.dailyCommute * factor * 22; 
  }
  const flightEmission = (state.flightsPerYear * FACTORS.TRANSPORT.FLIGHT) / 12;
  return commuteEmission + flightEmission;
}

export function calculateFoodEmission(state: AssessmentState): number {
  const key = normalizeKey(state.dietType);
  const factor = FACTORS.FOOD[key as keyof typeof FACTORS.FOOD] || 3.5;
  return factor * 30;
}

export function calculateEnergyEmission(state: AssessmentState): number {
  const renewableMultiplier = 1 - (state.renewableEnergy / 100);
  const electricityEmission = (state.monthlyElectricity * FACTORS.ENERGY.ELECTRICITY) * renewableMultiplier;
  const acSurcharge = state.hasAC ? FACTORS.ENERGY.AC_SURCHARGE : 0;
  return electricityEmission + acSurcharge;
}

export function calculateShoppingEmission(state: AssessmentState): number {
  const onlineEmission = state.onlinePurchasesPerMonth * FACTORS.SHOPPING.ONLINE_ORDER;
  const clothingEmission = (state.clothingItemsPerYear * FACTORS.SHOPPING.CLOTHING_ITEM) / 12;
  return onlineEmission + clothingEmission;
}

export function calculateWasteEmission(state: AssessmentState): number {
  let waste = FACTORS.WASTE.BASE_WASTE;
  if (state.recyclingFrequency === 'always') waste += FACTORS.WASTE.RECYCLING_OFFSET;
  if (state.recyclingFrequency === 'never') waste += 10;
  return Math.max(5, waste);
}

export function calculateEcoScore(totalKg: number): number {
  const IDEAL = 150; 
  const POOR = 800; 
  if (totalKg <= IDEAL) return 100;
  if (totalKg >= POOR) return 0;
  return Math.round(100 - ((totalKg - IDEAL) / (POOR - IDEAL)) * 100);
}

export function calculateTotalFootprint(state: AssessmentState): FootprintData {
  const transport = calculateTransportEmission(state);
  const food = calculateFoodEmission(state);
  const energy = calculateEnergyEmission(state);
  const shopping = calculateShoppingEmission(state);
  const waste = calculateWasteEmission(state);
  const total = transport + food + energy + shopping + waste;

  return {
    transport: Math.round(transport),
    food: Math.round(food),
    energy: Math.round(energy),
    shopping: Math.round(shopping),
    waste: Math.round(waste),
    total: Math.round(total),
    ecoScore: calculateEcoScore(total),
    timestamp: Date.now()
  };
}
