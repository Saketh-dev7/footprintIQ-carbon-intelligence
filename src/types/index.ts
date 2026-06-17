import { z } from 'zod';

export const AssessmentSchema = z.object({
  vehicleType: z.enum(['gas', 'electric', 'hybrid', 'none']),
  dailyCommute: z.number().min(0).max(500),
  flightsPerYear: z.number().min(0).max(100),
  dietType: z.enum(['vegan', 'vegetarian', 'omnivore', 'heavy-meat']),
  monthlyElectricity: z.number().min(0).max(5000),
  hasAC: z.boolean(),
  renewableEnergy: z.number().min(0).max(100),
  onlinePurchasesPerMonth: z.number().min(0).max(100),
  clothingItemsPerYear: z.number().min(0).max(200),
  recyclingFrequency: z.enum(['never', 'sometimes', 'always']),
});

export type AssessmentState = z.infer<typeof AssessmentSchema>;

export interface FootprintData {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
  waste: number;
  total: number;
  ecoScore: number;
  timestamp: number;
}

export interface ActionPlanDay {
  day: number;
  task: string;
  impact: 'low' | 'medium' | 'high';
}

export interface MonthlyGoal {
  title: string;
  description: string;
  targetReductionKg: number;
  currentProgressPercent: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'Leaf' | 'Globe' | 'ShieldCheck' | 'Trophy';
  unlocked: boolean;
}

/** A single recorded snapshot of a completed assessment, used to derive real
 * progress metrics (streaks, trend charts) instead of hardcoded placeholders. */
export interface HistoryEntry {
  timestamp: number;
  total: number;
  ecoScore: number;
}
