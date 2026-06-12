import { AssessmentState, FootprintData } from '@/types';

/**
 * Emission factors (approximate kg CO2e per unit)
 * Sources derived from IPCC and EPA average datasets for personal consumption.
 */
export const FACTORS = {
  TRANSPORT: {
    GAS: 0.19, // per km
    ELECTRIC: 0.05,
    HYBRID: 0.12,
    FLIGHT: 250, // per average flight
  },
  FOOD: {
    VEGAN: 1.5, // per day
    VEGETARIAN: 2.2,
    OMNIVORE: 3.5,
    HEAVY_MEAT: 5.5,
  },
  ENERGY: {
    ELECTRICITY: 0.4, // per kWh
    AC_SURCHARGE: 50, // per month flat if AC used heavily
  },
  SHOPPING: {
    ONLINE_ORDER: 2.5, // packaging + delivery
    CLOTHING_ITEM: 15, // average production footprint
  },
  WASTE: {
    RECYCLING_OFFSET: -20, // offset if recycling always
    BASE_WASTE: 30, // monthly base
  }
} as const;

export function calculateTransportEmission(state: AssessmentState): number {
  let dailyEmissions = 0;
  if (state.vehicleType !== 'none') {
    const factor = FACTORS.TRANSPORT[state.vehicleType.toUpperCase() as keyof typeof FACTORS.TRANSPORT] as number;
    dailyEmissions = state.dailyCommute * factor;
  }
  const monthlyCommute = dailyEmissions * 22; // average work days
  const monthlyFlights = (state.flightsPerYear * FACTORS.TRANSPORT.FLIGHT) / 12;
  return monthlyCommute + monthlyFlights;
}

export function calculateFoodEmission(state: AssessmentState): number {
  const factor = FACTORS.FOOD[state.dietType.toUpperCase() as keyof typeof FACTORS.FOOD] as number;
  return factor * 30; // monthly
}

export function calculateEnergyEmission(state: AssessmentState): number {
  let electricityEmissions = state.monthlyElectricity * FACTORS.ENERGY.ELECTRICITY;
  // Apply renewable offset
  electricityEmissions = electricityEmissions * (1 - state.renewableEnergy / 100);
  const acSurcharge = state.hasAC ? FACTORS.ENERGY.AC_SURCHARGE : 0;
  return electricityEmissions + acSurcharge;
}

export function calculateShoppingEmission(state: AssessmentState): number {
  const onlineEmissions = state.onlinePurchasesPerMonth * FACTORS.SHOPPING.ONLINE_ORDER;
  const clothingEmissions = (state.clothingItemsPerYear * FACTORS.SHOPPING.CLOTHING_ITEM) / 12;
  return onlineEmissions + clothingEmissions;
}

export function calculateWasteEmission(state: AssessmentState): number {
  let waste = FACTORS.WASTE.BASE_WASTE;
  if (state.recyclingFrequency === 'always') waste += FACTORS.WASTE.RECYCLING_OFFSET;
  if (state.recyclingFrequency === 'never') waste += 10;
  return Math.max(5, waste);
}

/**
 * Calculates the EcoScore (0-100).
 * 100 is ideal, 0 is very high impact.
 * Average monthly footprint globally is around 400kg.
 */
export function calculateEcoScore(totalKg: number): number {
  const IDEAL_MONTHLY = 150; // Near net zero per capita target
  const MAX_THRESHOLD = 800; // High impact threshold
  
  if (totalKg <= IDEAL_MONTHLY) return 100;
  if (totalKg >= MAX_THRESHOLD) return 0;
  
  const score = 100 - ((totalKg - IDEAL_MONTHLY) / (MAX_THRESHOLD - IDEAL_MONTHLY)) * 100;
  return Math.round(Math.min(100, Math.max(0, score)));
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
