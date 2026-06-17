import { describe, it, expect } from 'vitest';
import { 
  calculateTransportEmission, 
  calculateFoodEmission, 
  calculateEnergyEmission, 
  calculateShoppingEmission, 
  calculateWasteEmission, 
  calculateTotalFootprint,
  calculateEcoScore,
  ECO_SCORE_IDEAL_KG,
  ECO_SCORE_POOR_KG,
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

    it('should handle extreme flight values', () => {
      const state = { ...baseMockState, flightsPerYear: 100 };
      expect(calculateTransportEmission(state)).toBeGreaterThan(2000);
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

    it('should calculate high emissions for heavy meat diet', () => {
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

    it('should apply partial renewable energy offsets', () => {
      const state = { ...baseMockState, renewableEnergy: 50 };
      // (100 * 0.4) * 0.5 = 20
      expect(calculateEnergyEmission(state)).toBe(20);
    });

    it('should apply AC surcharge when enabled', () => {
      const state = { ...baseMockState, hasAC: true };
      // 40 + 50 = 90
      expect(calculateEnergyEmission(state)).toBe(90);
    });
  });

  describe('calculateTotalFootprint', () => {
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

    it('should produce a low EcoScore for high footprints', () => {
      const highState: AssessmentState = {
        ...baseMockState,
        vehicleType: 'gas',
        dailyCommute: 50,
        flightsPerYear: 12,
        dietType: 'heavy-meat',
        monthlyElectricity: 1000,
        hasAC: true
      };
      const result = calculateTotalFootprint(highState);
      expect(result.ecoScore).toBeLessThan(30);
    });
  });

  describe('calculateShoppingEmission', () => {
    it('should calculate combined online order and clothing emissions', () => {
      const state = { ...baseMockState, onlinePurchasesPerMonth: 4, clothingItemsPerYear: 24 };
      // (4 * 2.5) + (24 * 15 / 12) = 10 + 30 = 40
      expect(calculateShoppingEmission(state)).toBe(40);
    });

    it('should be zero when there is no shopping activity', () => {
      const state = { ...baseMockState, onlinePurchasesPerMonth: 0, clothingItemsPerYear: 0 };
      expect(calculateShoppingEmission(state)).toBe(0);
    });
  });

  describe('calculateWasteEmission', () => {
    it('should apply the recycling offset when recycling always', () => {
      const state = { ...baseMockState, recyclingFrequency: 'always' as const };
      // 30 - 20 = 10
      expect(calculateWasteEmission(state)).toBe(10);
    });

    it('should apply a surcharge when never recycling', () => {
      const state = { ...baseMockState, recyclingFrequency: 'never' as const };
      // 30 + 10 = 40
      expect(calculateWasteEmission(state)).toBe(40);
    });

    it('should never drop below the floor of 5', () => {
      const state = { ...baseMockState, recyclingFrequency: 'always' as const };
      expect(calculateWasteEmission(state)).toBeGreaterThanOrEqual(5);
    });
  });

  describe('calculateEcoScore boundary conditions', () => {
    it('should return exactly 100 at the ideal anchor (150kg)', () => {
      expect(calculateEcoScore(ECO_SCORE_IDEAL_KG)).toBe(100);
    });

    it('should return 100 for any footprint below the ideal anchor', () => {
      expect(calculateEcoScore(ECO_SCORE_IDEAL_KG - 50)).toBe(100);
      expect(calculateEcoScore(0)).toBe(100);
    });

    it('should return exactly 0 at the poor anchor (800kg)', () => {
      expect(calculateEcoScore(ECO_SCORE_POOR_KG)).toBe(0);
    });

    it('should return 0 for any footprint above the poor anchor', () => {
      expect(calculateEcoScore(ECO_SCORE_POOR_KG + 500)).toBe(0);
    });

    it('should score the exact midpoint between the two anchors at 50', () => {
      const midpoint = (ECO_SCORE_IDEAL_KG + ECO_SCORE_POOR_KG) / 2;
      expect(calculateEcoScore(midpoint)).toBe(50);
    });

    it('should still round to 100 a single kg above the ideal anchor (rounding precision)', () => {
      // (1/650)*100 ≈ 0.15 percentage points - too small to move the rounded score off 100.
      expect(calculateEcoScore(ECO_SCORE_IDEAL_KG + 1)).toBe(100);
    });

    it('should drop below 100 once the offset is large enough to round down', () => {
      // (10/650)*100 ≈ 1.5 percentage points - enough to round down from 100.
      const score = calculateEcoScore(ECO_SCORE_IDEAL_KG + 10);
      expect(score).toBeLessThan(100);
    });

    it('should still round to 0 a single kg below the poor anchor (rounding precision)', () => {
      expect(calculateEcoScore(ECO_SCORE_POOR_KG - 1)).toBe(0);
    });

    it('should rise above 0 once the offset is large enough to round up', () => {
      const score = calculateEcoScore(ECO_SCORE_POOR_KG - 10);
      expect(score).toBeGreaterThan(0);
    });
  });
});
