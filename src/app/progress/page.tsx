"use client"

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FootprintData, Badge as BadgeType } from '@/types';
import { Trophy, ShieldCheck, Flame, Leaf, Globe, Star, ChevronRight, Zap } from 'lucide-react';

const BADGES: BadgeType[] = [
  { id: '1', name: 'Green Beginner', description: 'Completed first assessment', icon: 'Leaf', unlocked: true },
  { id: '2', name: 'Eco Explorer', description: 'Used Forecast Studio to plan reductions', icon: 'Globe', unlocked: true },
  { id: '3', name: 'Carbon Warrior', description: 'Monthly footprint under 200kg', icon: 'ShieldCheck', unlocked: false },
  { id: '4', name: 'Planet Protector', description: 'Implemented 5+ AI suggestions', icon: 'Trophy', unlocked: false },
];

export default function ProgressPage() {
  const [data, setData] = useState<FootprintData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('footprint_iq_data');
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">Sustainability Journey</h1>
          <p className="text-muted-foreground text-lg">Track your improvements and earn rewards for a cleaner planet.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Milestone Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-white/5 rounded-3xl p-8 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Active Streak</h3>
                    <p className="text-sm text-muted-foreground">3 Days Tracking</p>
                  </div>
                </div>
                <div className="text-5xl font-headline font-black text-primary">03</div>
              </Card>
              <Card className="glass border-white/5 rounded-3xl p-8 bg-gradient-to-br from-accent/10 to-transparent">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Eco Points</h3>
                    <p className="text-sm text-muted-foreground">Level 2 Path</p>
                  </div>
                </div>
                <div className="text-5xl font-headline font-black text-accent">850</div>
              </Card>
            </div>

            <Card className="glass border-white/5 rounded-[2rem]">
              <CardHeader>
                <CardTitle className="font-headline">Achievement Progress</CardTitle>
                <CardDescription>You are 75% away from your next milestone</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Carbon Warrior Progress</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-3 bg-white/5" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Planet Protector Progress</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-3 bg-white/5" />
                </div>
              </CardContent>
            </Card>

            <div className="glass rounded-[2rem] border-white/5 p-12 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-3xl font-headline font-bold mb-4">Carbon History Timeline</h3>
                <p className="text-muted-foreground mb-8">Visualization of your footprint reduction over the last year.</p>
                <div className="h-40 flex items-end gap-3 md:gap-6">
                  {[45, 42, 38, 40, 35, 32, 30, 28, 25, 22, 24, 20].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all" style={{ height: `${h * 4}px` }}>
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 rounded-t-lg transition-opacity" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold px-4">Earned Badges</h3>
            {BADGES.map((badge) => (
              <Card key={badge.id} className={`glass border-white/5 rounded-3xl p-6 transition-all duration-300 ${badge.unlocked ? 'opacity-100 hover:scale-105' : 'opacity-40 grayscale'}`}>
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${badge.unlocked ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
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
                    <div className="ml-auto">
                      <Zap className="w-5 h-5 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
            <Button variant="outline" className="w-full h-14 rounded-2xl glass border-white/10 hover:bg-white/5">
              View All 24 Achievements <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}