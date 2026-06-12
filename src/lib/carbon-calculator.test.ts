import { calculateTotalFootprint, calculateEcoScore, FACTORS } from './carbon-calculator';
import { AssessmentState } from '@/types';

const mockBaseState: AssessmentState = {
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

describe('Carbon Intelligence Calculator', () => {
  test('calculates transport accurately including monthly conversion', () => {
    const result = calculateTotalFootprint(mockBaseState);
    // 10km * 0.19 (factor) * 22 (workdays) = 41.8 ~ 42kg
    expect(result.transport).toBe(42);
  });

  test('calculates diet emissions correctly for a month', () => {
    const result = calculateTotalFootprint(mockBaseState);
    // 3.5 (omnivore) * 30 days = 105kg
    expect(result.food).toBe(105);
  });

  test('EcoScore scales as expected between thresholds', () => {
    expect(calculateEcoScore(150)).toBe(100); 
    expect(calculateEcoScore(800)).toBe(0);   
    expect(calculateEcoScore(475)).toBe(50);  
  });

  test('Renewable energy multiplier correctly offsets electricity', () => {
    const greenState: AssessmentState = { ...mockBaseState, renewableEnergy: 100 };
    const result = calculateTotalFootprint(greenState);
    expect(result.energy).toBe(0);
  });

  test('Waste management frequency affects total correctly', () => {
    const lowWasteState: AssessmentState = { ...mockBaseState, recyclingFrequency: 'always' };
    const highWasteState: AssessmentState = { ...mockBaseState, recyclingFrequency: 'never' };
    
    const lowResult = calculateTotalFootprint(lowWasteState);
    const highResult = calculateTotalFootprint(highWasteState);
    
    expect(lowResult.waste).toBeLessThan(highResult.waste);
  });

  test('Shopping emissions aggregate correctly', () => {
    const shoppingState: AssessmentState = { 
      ...mockBaseState, 
      onlinePurchasesPerMonth: 10, // 10 * 2.5 = 25
      clothingItemsPerYear: 12    // (12 * 15) / 12 = 15
    };
    const result = calculateTotalFootprint(shoppingState);
    expect(result.shopping).toBe(40);
  });
});
