"use client"

import { useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFootprint } from '@/hooks/use-footprint';
import { Trophy, ShieldCheck, Flame, Leaf, Globe, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  calculateStreakDays,
  calculateEcoPoints,
  calculateWarriorProgress,
  calculateProtectorProgress,
  computeBadges,
} from '@/lib/progress';

export default function ProgressPage() {
  const { data, isLoading, history, visitedForecast, completedTasks } = useFootprint();

  // All derived values recomputed from scratch on every render previously;
  // memoized here since none of these depend on anything but the four inputs below.
  const metrics = useMemo(() => {
    if (!data) return null;

    const effectiveHistory = history.length > 0
      ? history
      : [{ timestamp: data.timestamp, total: data.total, ecoScore: data.ecoScore }];

    const streakDays = calculateStreakDays(effectiveHistory);
    const ecoPoints = calculateEcoPoints(data.ecoScore);
    const ecoLevel = Math.floor(ecoPoints / 250) + 1;
    const warriorProgress = calculateWarriorProgress(data.total);
    const protectorProgress = calculateProtectorProgress(completedTasks.length);

    const badges = computeBadges({
      hasAssessment: true,
      visitedForecast,
      totalKg: data.total,
      completedTaskCount: completedTasks.length,
    });
    const unlockedCount = badges.filter(b => b.unlocked).length;

    const carbonWarriorBadge = badges.find(b => b.id === '3');
    const planetProtectorBadge = badges.find(b => b.id === '4');
    const lockedProgress = [
      carbonWarriorBadge && !carbonWarriorBadge.unlocked ? warriorProgress : null,
      planetProtectorBadge && !planetProtectorBadge.unlocked ? protectorProgress : null,
    ].filter((p): p is number => p !== null);
    const milestoneDescription = lockedProgress.length > 0
      ? `You are ${100 - Math.max(...lockedProgress)}% away from your next milestone`
      : "You've unlocked every milestone — incredible work!";

    // Real footprint trend, built from each completed assessment rather than a static placeholder.
    const timelineEntries = effectiveHistory.slice(-12);
    const maxTrackedTotal = Math.max(...timelineEntries.map(e => e.total), 1);
    const hasTrend = timelineEntries.length > 1;
    const trendDirection = hasTrend
      ? timelineEntries[timelineEntries.length - 1].total < timelineEntries[0].total
        ? 'a downward'
        : timelineEntries[timelineEntries.length - 1].total > timelineEntries[0].total
          ? 'an upward'
          : 'a flat'
      : null;

    return {
      streakDays,
      ecoPoints,
      ecoLevel,
      warriorProgress,
      protectorProgress,
      badges,
      unlockedCount,
      milestoneDescription,
      timelineEntries,
      maxTrackedTotal,
      hasTrend,
      trendDirection,
    };
  }, [data, history, visitedForecast, completedTasks]);

  if (isLoading) return null;

  if (!data || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-background">
        <Navigation />
        <main className="space-y-6 animate-in fade-in zoom-in duration-500" role="main">
          <Trophy className="w-16 h-16 text-primary mx-auto opacity-50" aria-hidden="true" />
          <h1 className="text-4xl font-headline font-bold">No Journey Data</h1>
          <p className="text-muted-foreground max-w-sm text-lg">Start your assessment to begin earning eco-badges.</p>
          <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg">
            <Link href="/assessment">Get Started</Link>
          </Button>
        </main>
      </div>
    );
  }

  const {
    streakDays,
    ecoPoints,
    ecoLevel,
    warriorProgress,
    protectorProgress,
    badges,
    unlockedCount,
    milestoneDescription,
    timelineEntries,
    maxTrackedTotal,
    hasTrend,
    trendDirection,
  } = metrics;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="container mx-auto px-6 py-12" role="main">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">Sustainability Journey</h1>
          <p className="text-muted-foreground text-lg">Track your improvements and earn rewards for a cleaner planet.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Activity Highlights">
              <Card className="glass border-white/5 rounded-3xl p-8 bg-gradient-to-br from-primary/10 to-transparent shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary" aria-hidden="true">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Active Streak</h3>
                    <p className="text-sm text-muted-foreground">{streakDays} {streakDays === 1 ? 'Day' : 'Days'} Tracking</p>
                  </div>
                </div>
                <div className="text-5xl font-headline font-black text-primary" aria-label={`${streakDays} day streak`}>
                  {String(streakDays).padStart(2, '0')}
                </div>
              </Card>
              <Card className="glass border-white/5 rounded-3xl p-8 bg-gradient-to-br from-accent/10 to-transparent shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent" aria-hidden="true">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Eco Points</h3>
                    <p className="text-sm text-muted-foreground">Level {ecoLevel} Path</p>
                  </div>
                </div>
                <div className="text-5xl font-headline font-black text-accent" aria-label={`${ecoPoints} eco points`}>{ecoPoints}</div>
              </Card>
            </section>

            <section aria-labelledby="achievement-progress-title">
              <Card className="glass border-white/5 rounded-[2rem] shadow-xl">
                <CardHeader>
                  <CardTitle id="achievement-progress-title" className="font-headline">Achievement Progress</CardTitle>
                  <CardDescription>{milestoneDescription}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Carbon Warrior Progress</span>
                      <span aria-live="polite">{warriorProgress}%</span>
                    </div>
                    <Progress value={warriorProgress} className="h-3 bg-white/5" aria-label="Carbon Warrior milestone progress" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Planet Protector Progress</span>
                      <span aria-live="polite">{protectorProgress}%</span>
                    </div>
                    <Progress value={protectorProgress} className="h-3 bg-white/5" aria-label="Planet Protector milestone progress" />
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="glass rounded-[2rem] border-white/5 p-12 overflow-hidden relative shadow-2xl" aria-labelledby="history-title">
              <div className="relative z-10">
                <h3 id="history-title" className="text-3xl font-headline font-bold mb-4">Carbon History Timeline</h3>
                <p className="text-muted-foreground mb-8">
                  {hasTrend
                    ? 'Your footprint across every completed assessment.'
                    : 'Complete another assessment over time to start seeing your trend here.'}
                </p>
                <div
                  className="h-40 flex items-end gap-3 md:gap-6"
                  role="img"
                  aria-label={
                    hasTrend
                      ? `Bar chart showing ${trendDirection} trend in carbon emissions across ${timelineEntries.length} tracked assessments.`
                      : `Bar chart showing a single tracked assessment of ${timelineEntries[0]?.total ?? data.total}kg CO2e.`
                  }
                >
                  {timelineEntries.map((entry) => (
                    <div
                      key={entry.timestamp}
                      className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all"
                      style={{ height: `${Math.max(4, (entry.total / maxTrackedTotal) * 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 rounded-t-lg transition-opacity" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
                  <span>{new Date(timelineEntries[0]?.timestamp ?? data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  {timelineEntries.length > 1 && (
                    <span>{new Date(timelineEntries[timelineEntries.length - 1].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  )}
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6" aria-labelledby="badges-title">
            <h3 id="badges-title" className="text-xl font-headline font-bold px-4">Earned Badges</h3>
            <div className="space-y-4" role="list">
              {badges.map((badge) => (
                <Card 
                  key={badge.id} 
                  role="listitem"
                  className={`glass border-white/5 rounded-3xl p-6 transition-all duration-300 shadow-lg ${badge.unlocked ? 'opacity-100 hover:scale-105' : 'opacity-40 grayscale'}`}
                  aria-label={`${badge.name}: ${badge.description}. ${badge.unlocked ? 'Unlocked' : 'Locked'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${badge.unlocked ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`} aria-hidden="true">
                      {badge.icon === 'Leaf' && <Leaf className="w-7 h-7" />}
                      {badge.icon === 'Globe' && <Globe className="w-7 h-7" />}
                      {badge.icon === 'ShieldCheck' && <ShieldCheck className="w-7 h-7" />}
                      {badge.icon === 'Trophy' && <Trophy className="w-7 h-7" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {badge.unlocked && <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Unlocked</span>}
                    </div>
                    {!badge.unlocked && (
                      <div className="ml-auto" aria-hidden="true">
                        <Zap className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div
              className="w-full h-14 rounded-2xl glass border border-white/10 shadow-md flex items-center justify-center font-medium text-sm text-muted-foreground"
              aria-label={`${unlockedCount} of ${badges.length} achievements unlocked`}
            >
              {unlockedCount} of {badges.length} Achievements Unlocked
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
