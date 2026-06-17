import { describe, it, expect } from 'vitest';
import { AssessmentSchema, AssessmentState } from './index';

const validState: AssessmentState = {
  vehicleType: 'gas',
  dailyCommute: 20,
  flightsPerYear: 2,
  dietType: 'omnivore',
  monthlyElectricity: 250,
  hasAC: true,
  renewableEnergy: 0,
  onlinePurchasesPerMonth: 5,
  clothingItemsPerYear: 12,
  recyclingFrequency: 'sometimes',
};

describe('AssessmentSchema', () => {
  it('accepts a fully valid assessment', () => {
    expect(AssessmentSchema.safeParse(validState).success).toBe(true);
  });

  it('rejects a vehicleType outside the enum', () => {
    const result = AssessmentSchema.safeParse({ ...validState, vehicleType: 'spaceship' });
    expect(result.success).toBe(false);
  });

  it('rejects a negative dailyCommute', () => {
    const result = AssessmentSchema.safeParse({ ...validState, dailyCommute: -5 });
    expect(result.success).toBe(false);
  });

  it('rejects a dailyCommute above the 500km ceiling', () => {
    const result = AssessmentSchema.safeParse({ ...validState, dailyCommute: 501 });
    expect(result.success).toBe(false);
  });

  it('accepts a dailyCommute exactly at the 500km ceiling', () => {
    const result = AssessmentSchema.safeParse({ ...validState, dailyCommute: 500 });
    expect(result.success).toBe(true);
  });

  it('rejects flightsPerYear above the 100 ceiling', () => {
    const result = AssessmentSchema.safeParse({ ...validState, flightsPerYear: 101 });
    expect(result.success).toBe(false);
  });

  it('rejects a dietType outside the enum', () => {
    const result = AssessmentSchema.safeParse({ ...validState, dietType: 'carnivore-extreme' });
    expect(result.success).toBe(false);
  });

  it('rejects negative monthlyElectricity', () => {
    const result = AssessmentSchema.safeParse({ ...validState, monthlyElectricity: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects monthlyElectricity above the 5000kWh ceiling', () => {
    const result = AssessmentSchema.safeParse({ ...validState, monthlyElectricity: 5001 });
    expect(result.success).toBe(false);
  });

  it('rejects renewableEnergy above 100 percent', () => {
    const result = AssessmentSchema.safeParse({ ...validState, renewableEnergy: 150 });
    expect(result.success).toBe(false);
  });

  it('rejects renewableEnergy below 0 percent', () => {
    const result = AssessmentSchema.safeParse({ ...validState, renewableEnergy: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects a non-boolean hasAC', () => {
    const result = AssessmentSchema.safeParse({ ...validState, hasAC: 'yes' });
    expect(result.success).toBe(false);
  });

  it('rejects onlinePurchasesPerMonth above the 100 ceiling', () => {
    const result = AssessmentSchema.safeParse({ ...validState, onlinePurchasesPerMonth: 101 });
    expect(result.success).toBe(false);
  });

  it('rejects clothingItemsPerYear above the 200 ceiling', () => {
    const result = AssessmentSchema.safeParse({ ...validState, clothingItemsPerYear: 201 });
    expect(result.success).toBe(false);
  });

  it('rejects a recyclingFrequency outside the enum', () => {
    const result = AssessmentSchema.safeParse({ ...validState, recyclingFrequency: 'occasionally' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing required field', () => {
    const { vehicleType: _vehicleType, ...incomplete } = validState;
    const result = AssessmentSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});
