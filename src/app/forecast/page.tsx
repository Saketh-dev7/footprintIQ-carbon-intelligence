"use client"

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useFootprint } from '@/hooks/use-footprint';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Leaf, ArrowDownCircle, RefreshCw, Zap, TrendingDown, LayoutPanelLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForecastPage() {
  const { data: baseData, isLoading } = useFootprint();
  const [savings, setSavings] = useState({
    transport: 0,
    food: 0,
    energy: 0,
  });

  if (isLoading) return <ForecastSkeleton />;

  if (!baseData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-background">
        <Navigation />
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <LayoutPanelLeft className="w-16 h-16 text-primary mx-auto opacity-50" />
          <h1 className="text-4xl font-headline font-bold">No Baseline Data</h1>
          <p className="text-muted-foreground max-w-sm text-lg">Complete your assessment to unlock the Impact Forecast Studio.</p>
          <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg">
            <Link href="/assessment">Start Assessment</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentTotal = baseData.total;
  const projectedTotal = Math.max(0, currentTotal - (currentTotal * (savings.transport + savings.food + savings.energy) / 100));
  const reductionPercent = Math.round((currentTotal - projectedTotal) / currentTotal * 100);
  const annualSavingsKg = Math.round((currentTotal - projectedTotal) * 12);
  const monthlyCostSavings = Math.round(annualSavingsKg * 0.15 / 12); 

  const chartData = [
    { name: 'Current', value: currentTotal, fill: 'hsl(var(--muted))' },
    { name: 'Projected', value: projectedTotal, fill: 'hsl(var(--primary))' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">Impact Forecast Studio</h1>
          <p className="text-muted-foreground text-lg">Simulate habit changes and visualize your sustainable future.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label icon={Zap} label="Switch to Clean Energy" />
                    <span className="text-primary font-bold">{savings.energy}%</span>
                  </div>
                  <Slider 
                    value={[savings.energy]} 
                    onValueChange={([v]) => setSavings({...savings, energy: v})} 
                    max={30} step={5}
                    aria-label="Clean Energy Slider"
                  />
                  <p className="text-xs text-muted-foreground">Switching to solar or wind power offsets home emissions.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label icon={Leaf} label="Dietary Efficiency" />
                    <span className="text-primary font-bold">{savings.food}%</span>
                  </div>
                  <Slider 
                    value={[savings.food]} 
                    onValueChange={([v]) => setSavings({...savings, food: v})} 
                    max={20} step={2}
                    aria-label="Dietary Efficiency Slider"
                  />
                  <p className="text-xs text-muted-foreground">Reducing meat and dairy intake significantly lowers food footprint.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label icon={TrendingDown} label="Low-Carbon Transport" />
                    <span className="text-primary font-bold">{savings.transport}%</span>
                  </div>
                  <Slider 
                    value={[savings.transport]} 
                    onValueChange={([v]) => setSavings({...savings, transport: v})} 
                    max={40} step={5}
                    aria-label="Transport Slider"
                  />
                  <p className="text-xs text-muted-foreground">Walking or using public transit reduces direct emissions.</p>
                </div>
              </div>

              <Button 
                className="w-full mt-12 h-14 rounded-2xl bg-secondary hover:bg-white/10"
                onClick={() => setSavings({ transport: 0, food: 0, energy: 0 })}
              >
                <RefreshCw className="mr-2 w-4 h-4" /> Reset Simulation
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryBox label="Reduction" value={`${reductionPercent}%`} color="text-accent" />
              <SummaryBox label="Annual Offset" value={`${annualSavingsKg}kg`} color="text-primary" />
              <SummaryBox label="Monthly Savings" value={`$${monthlyCostSavings}`} color="text-blue-400" />
            </div>

            <Card className="glass border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8">
                <CardTitle className="font-headline text-2xl">Projected Monthly Emissions</CardTitle>
                <CardDescription>Current vs Simulated (kg CO2e)</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={14} tickLine={false} axisLine={false} width={100} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ background: 'rgba(11, 17, 16, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="glass p-8 rounded-[2rem] border-accent/20 bg-accent/5 flex items-center gap-6 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                <ArrowDownCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-accent mb-2">Sustainable Pathway Found</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By implementing these changes, you could reduce your total emissions by {reductionPercent}%. This is equivalent to planting {Math.round(annualSavingsKg / 20)} trees every single year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium text-lg">{label}</span>
    </div>
  );
}

function SummaryBox({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="glass p-6 rounded-3xl border-white/5 text-center shadow-lg">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className={`text-4xl font-headline font-bold ${color}`}>{value}</div>
    </div>
  );
}

function ForecastSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <div className="container mx-auto px-6 py-12 space-y-8">
        <div className="h-24 w-1/2 bg-white/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 h-[500px] bg-white/5 animate-pulse rounded-3xl" />
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-3 gap-6 h-32">
              <div className="bg-white/5 animate-pulse rounded-3xl" />
              <div className="bg-white/5 animate-pulse rounded-3xl" />
              <div className="bg-white/5 animate-pulse rounded-3xl" />
            </div>
            <div className="h-[400px] bg-white/5 animate-pulse rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
