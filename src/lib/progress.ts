import { Badge, HistoryEntry } from '@/types';
import { ECO_SCORE_POOR_KG } from '@/lib/carbon-calculator';

const CARBON_WARRIOR_TARGET_KG = 200;
const PLANET_PROTECTOR_TARGET_COUNT = 5;

/** Buckets a timestamp into a calendar-day key in the viewer's local timezone. */
function dayKey(timestamp: number): string {
  return new Date(timestamp).toDateString();
}

/**
 * Counts consecutive calendar days of tracking activity, ending at the most
 * recent entry. Returns 0 only when there is no history at all.
 */
export function calculateStreakDays(history: HistoryEntry[]): number {
  if (history.length === 0) return 0;

  const uniqueDays = Array.from(new Set(history.map(h => dayKey(h.timestamp))))
    .map(key => new Date(key).getTime())
    .sort((a, b) => b - a);

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const diffDays = Math.round((uniqueDays[i] - uniqueDays[i + 1]) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

/** Eco Points scale directly with EcoScore so they always agree with the dashboard. */
export function calculateEcoPoints(ecoScore: number): number {
  return ecoScore * 10;
}

/** Progress (0-100) toward the Carbon Warrior badge's <200kg/month threshold. */
export function calculateWarriorProgress(totalKg: number): number {
  if (totalKg <= CARBON_WARRIOR_TARGET_KG) return 100;
  if (totalKg >= ECO_SCORE_POOR_KG) return 0;
  return Math.round(100 - ((totalKg - CARBON_WARRIOR_TARGET_KG) / (ECO_SCORE_POOR_KG - CARBON_WARRIOR_TARGET_KG)) * 100);
}

/** Progress (0-100) toward the Planet Protector badge's 5-implemented-suggestions threshold. */
export function calculateProtectorProgress(completedCount: number): number {
  return Math.min(100, Math.round((completedCount / PLANET_PROTECTOR_TARGET_COUNT) * 100));
}

export interface BadgeInputs {
  hasAssessment: boolean;
  visitedForecast: boolean;
  totalKg: number;
  completedTaskCount: number;
}

export function computeBadges({ hasAssessment, visitedForecast, totalKg, completedTaskCount }: BadgeInputs): Badge[] {
  return [
    {
      id: '1',
      name: 'Green Beginner',
      description: 'Completed first assessment',
      icon: 'Leaf',
      unlocked: hasAssessment,
    },
    {
      id: '2',
      name: 'Eco Explorer',
      description: 'Used Forecast Studio to plan reductions',
      icon: 'Globe',
      unlocked: visitedForecast,
    },
    {
      id: '3',
      name: 'Carbon Warrior',
      description: 'Monthly footprint under 200kg',
      icon: 'ShieldCheck',
      unlocked: totalKg < CARBON_WARRIOR_TARGET_KG,
    },
    {
      id: '4',
      name: 'Planet Protector',
      description: 'Implemented 5+ AI suggestions',
      icon: 'Trophy',
      unlocked: completedTaskCount >= PLANET_PROTECTOR_TARGET_COUNT,
    },
  ];
}
