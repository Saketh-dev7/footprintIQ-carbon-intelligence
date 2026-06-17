import { describe, it, expect } from 'vitest';
import {
  calculateStreakDays,
  calculateEcoPoints,
  calculateWarriorProgress,
  calculateProtectorProgress,
  computeBadges,
} from './progress';
import { HistoryEntry } from '@/types';

function daysAgo(n: number): number {
  return Date.now() - n * 24 * 60 * 60 * 1000;
}

describe('calculateStreakDays', () => {
  it('returns 0 for an empty history', () => {
    expect(calculateStreakDays([])).toBe(0);
  });

  it('returns 1 for a single tracked day', () => {
    const history: HistoryEntry[] = [{ timestamp: Date.now(), total: 400, ecoScore: 60 }];
    expect(calculateStreakDays(history)).toBe(1);
  });

  it('counts consecutive days correctly', () => {
    const history: HistoryEntry[] = [
      { timestamp: daysAgo(2), total: 400, ecoScore: 60 },
      { timestamp: daysAgo(1), total: 380, ecoScore: 62 },
      { timestamp: daysAgo(0), total: 360, ecoScore: 65 },
    ];
    expect(calculateStreakDays(history)).toBe(3);
  });

  it('stops counting at the first gap', () => {
    const history: HistoryEntry[] = [
      { timestamp: daysAgo(10), total: 500, ecoScore: 40 },
      { timestamp: daysAgo(1), total: 380, ecoScore: 62 },
      { timestamp: daysAgo(0), total: 360, ecoScore: 65 },
    ];
    expect(calculateStreakDays(history)).toBe(2);
  });

  it('treats multiple entries on the same day as a single day', () => {
    const today = Date.now();
    const history: HistoryEntry[] = [
      { timestamp: today - 1000, total: 400, ecoScore: 60 },
      { timestamp: today, total: 390, ecoScore: 61 },
    ];
    expect(calculateStreakDays(history)).toBe(1);
  });
});

describe('calculateEcoPoints', () => {
  it('scales linearly with EcoScore', () => {
    expect(calculateEcoPoints(85)).toBe(850);
    expect(calculateEcoPoints(0)).toBe(0);
    expect(calculateEcoPoints(100)).toBe(1000);
  });
});

describe('calculateWarriorProgress', () => {
  it('is 100% at or below the 200kg target', () => {
    expect(calculateWarriorProgress(200)).toBe(100);
    expect(calculateWarriorProgress(50)).toBe(100);
  });

  it('is 0% at or above the 800kg poor anchor', () => {
    expect(calculateWarriorProgress(800)).toBe(0);
    expect(calculateWarriorProgress(1200)).toBe(0);
  });

  it('is partial progress between the anchors', () => {
    const progress = calculateWarriorProgress(500);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });
});

describe('calculateProtectorProgress', () => {
  it('reaches 100% at 5 completed tasks', () => {
    expect(calculateProtectorProgress(5)).toBe(100);
  });

  it('caps at 100% beyond the target', () => {
    expect(calculateProtectorProgress(9)).toBe(100);
  });

  it('is 0% with no completed tasks', () => {
    expect(calculateProtectorProgress(0)).toBe(0);
  });

  it('is partial progress below the target', () => {
    expect(calculateProtectorProgress(2)).toBe(40);
  });
});

describe('computeBadges', () => {
  it('unlocks only Green Beginner for a brand-new user', () => {
    const badges = computeBadges({
      hasAssessment: true,
      visitedForecast: false,
      totalKg: 600,
      completedTaskCount: 0,
    });
    const unlocked = badges.filter(b => b.unlocked).map(b => b.name);
    expect(unlocked).toEqual(['Green Beginner']);
  });

  it('unlocks Carbon Warrior once footprint drops below 200kg', () => {
    const badges = computeBadges({
      hasAssessment: true,
      visitedForecast: false,
      totalKg: 150,
      completedTaskCount: 0,
    });
    const warrior = badges.find(b => b.name === 'Carbon Warrior');
    expect(warrior?.unlocked).toBe(true);
  });

  it('unlocks Planet Protector once 5+ tasks are completed', () => {
    const badges = computeBadges({
      hasAssessment: true,
      visitedForecast: false,
      totalKg: 600,
      completedTaskCount: 5,
    });
    const protector = badges.find(b => b.name === 'Planet Protector');
    expect(protector?.unlocked).toBe(true);
  });

  it('unlocks Eco Explorer only after visiting the forecast tool', () => {
    const badges = computeBadges({
      hasAssessment: true,
      visitedForecast: true,
      totalKg: 600,
      completedTaskCount: 0,
    });
    const explorer = badges.find(b => b.name === 'Eco Explorer');
    expect(explorer?.unlocked).toBe(true);
  });
});
