/**
 * @fileOverview Unit tests for the FootprintIQ Carbon Calculator.
 * Run these tests in your preferred testing environment (Jest/Vitest).
 */
import { calculateTotalFootprint, calculateEcoScore, FACTORS } from './carbon-calculator';
import { AssessmentState } from '@/types';

const mockState: AssessmentState = {
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

describe('Carbon Calculator', () => {
  test('calculates transport emissions correctly', () => {
    const result = calculateTotalFootprint(mockState);
    // 10km * 0.19 (factor) * 22 (workdays) = 41.8 ~ 42kg
    expect(result.transport).toBe(42);
  });

  test('calculates food emissions correctly', () => {
    const result = calculateTotalFootprint(mockState);
    // 3.5 (omnivore) * 30 days = 105kg
    expect(result.food).toBe(105);
  });

  test('EcoScore scales correctly', () => {
    expect(calculateEcoScore(150)).toBe(100); // Ideal
    expect(calculateEcoScore(800)).toBe(0);   // Max threshold
    expect(calculateEcoScore(475)).toBe(50);  // Midpoint
  });

  test('Renewable energy offsets electricity', () => {
    const greenState: AssessmentState = { ...mockState, renewableEnergy: 100 };
    const result = calculateTotalFootprint(greenState);
    expect(result.energy).toBe(0);
  });
});
