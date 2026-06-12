import { describe, it, expect } from 'vitest';
import { 
  calculateTransportEmission, 
  calculateFoodEmission, 
  calculateEnergyEmission, 
  calculateShoppingEmission, 
  calculateWasteEmission, 
  calculateTotalFootprint 
} from './carbon-calculator';
import { AssessmentState } from '@/types';

const baseMockState: AssessmentState = {
  vehicleType: 'gas',
  dailyCommute: 10,
  flightsPerYear: 0,
  dietType: 'omnivore',
  monthlyElectricity: 100,
  hasAC: false,
  renewableEnergy: 0,
  onlinePurchasesPerMonth: 0,
  clothingItemsPerYear: 0,
  recyclingFrequency: 'sometimes'
};

describe('FootprintIQ Carbon Calculator Intelligence', () => {
  
  describe('calculateTransportEmission', () => {
    it('should calculate commuting emissions for a gas vehicle', () => {
      // 10km * 0.19 (GAS factor) * 22 (workdays) = 41.8
      const emission = calculateTransportEmission(baseMockState);
      expect(emission).toBeCloseTo(41.8);
    });

    it('should handle zero commute when vehicle is none', () => {
      const state = { ...baseMockState, vehicleType: 'none' as const, dailyCommute: 50 };
      expect(calculateTransportEmission(state)).toBe(0);
    });

    it('should include annual flight emissions pro-rated monthly', () => {
      const state = { ...baseMockState, flightsPerYear: 1 };
      // 41.8 (commute) + (1 * 250 / 12) = 41.8 + 20.833 = 62.633
      const emission = calculateTransportEmission(state);
      expect(emission).toBeCloseTo(62.633, 2);
    });
  });

  describe('calculateFoodEmission', () => {
    it('should calculate emissions for an omnivore diet', () => {
      // 3.5 * 30 = 105
      expect(calculateFoodEmission(baseMockState)).toBe(105);
    });

    it('should calculate significantly lower emissions for a vegan diet', () => {
      const state = { ...baseMockState, dietType: 'vegan' as const };
      // 1.5 * 30 = 45
      expect(calculateFoodEmission(state)).toBe(45);
    });

    it('should handle heavy-meat diet correctly', () => {
      const state = { ...baseMockState, dietType: 'heavy-meat' as const };
      // 5.5 * 30 = 165
      expect(calculateFoodEmission(state)).toBe(165);
    });
  });

  describe('calculateEnergyEmission', () => {
    it('should calculate base electricity emissions', () => {
      // 100 kWh * 0.4 = 40
      expect(calculateEnergyEmission(baseMockState)).toBe(40);
    });

    it('should apply renewable energy offsets', () => {
      const state = { ...baseMockState, renewableEnergy: 100 };
      expect(calculateEnergyEmission(state)).toBe(0);
    });

    it('should apply AC surcharge when enabled', () => {
      const state = { ...baseMockState, hasAC: true };
      // 40 + 50 = 90
      expect(calculateEnergyEmission(state)).toBe(90);
    });
  });

  describe('calculateShoppingEmission', () => {
    it('should calculate emissions for online purchases and clothing', () => {
      const state = { 
        ...baseMockState, 
        onlinePurchasesPerMonth: 4, 
        clothingItemsPerYear: 12 
      };
      // (4 * 2.5) + (12 * 15 / 12) = 10 + 15 = 25
      expect(calculateShoppingEmission(state)).toBe(25);
    });
  });

  describe('calculateWasteEmission', () => {
    it('should apply offset for strict recycling', () => {
      const state = { ...baseMockState, recyclingFrequency: 'always' as const };
      // 30 - 20 = 10
      expect(calculateWasteEmission(state)).toBe(10);
    });

    it('should apply penalty for no recycling', () => {
      const state = { ...baseMockState, recyclingFrequency: 'never' as const };
      // 30 + 10 = 40
      expect(calculateWasteEmission(state)).toBe(40);
    });
  });

  describe('calculateTotalFootprint', () => {
    it('should aggregate all categories into a rounded total', () => {
      const result = calculateTotalFootprint(baseMockState);
      
      // Transport: 41.8 -> 42
      // Food: 105
      // Energy: 40
      // Shopping: 0
      // Waste: 30
      // Total: 41.8 + 105 + 40 + 0 + 30 = 216.8
      
      expect(result.total).toBe(217);
      expect(result.ecoScore).toBeGreaterThan(0);
      expect(result.ecoScore).toBeLessThanOrEqual(100);
    });

    it('should produce a high EcoScore for low footprints', () => {
      const lowState: AssessmentState = {
        ...baseMockState,
        vehicleType: 'none',
        dietType: 'vegan',
        monthlyElectricity: 10,
        recyclingFrequency: 'always'
      };
      const result = calculateTotalFootprint(lowState);
      expect(result.ecoScore).toBe(100);
    });
  });
});
