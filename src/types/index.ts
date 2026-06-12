export interface FootprintData {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
  waste: number;
  total: number;
  timestamp: number;
}

export interface AssessmentState {
  // Transport
  vehicleType: 'gas' | 'electric' | 'hybrid' | 'none';
  dailyCommute: number; // km
  flightsPerYear: number;
  // Food
  dietType: 'vegan' | 'vegetarian' | 'omnivore' | 'heavy-meat';
  // Energy
  monthlyElectricity: number; // kWh
  hasAC: boolean;
  renewableEnergy: number; // percentage 0-100
  // Shopping
  onlinePurchasesPerMonth: number;
  clothingItemsPerYear: number;
  // Waste
  recyclingFrequency: 'never' | 'sometimes' | 'always';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}