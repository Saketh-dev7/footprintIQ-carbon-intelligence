"use client"

import { useState, useMemo, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useFootprint } from '@/hooks/use-footprint';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Leaf, ArrowDownCircle, RefreshCw, Zap, TrendingDown, LayoutPanelLeft, LucideIcon } from 'lucide-react';
import { Label as LabelUI } from '@/components/ui/label';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

export default function ForecastPage() {
  const { data: baseData, isLoading, markForecastVisited } = useFootprint();
  const [savings, setSavings] = useState({
    transport: 0,
    food: 0,
    energy: 0,
  });

  useEffect(() => {
    if (baseData) {
      markForecastVisited();
    }
  }, [baseData, markForecastVisited]);

  const projection = useMemo(() => {
    if (!baseData) return null;
    const currentTotal = baseData.total;
    const totalSavingFactor = (savings.transport + savings.food + savings.energy) / 100;
    const projectedTotal = Math.max(0, currentTotal - (currentTotal * totalSavingFactor));
    const reductionPercent = Math.round(((currentTotal - projectedTotal) / currentTotal) * 100);
    const annualSavingsKg = Math.round((currentTotal - projectedTotal) * 12);
    
    return {
      currentTotal,
      projectedTotal,
      reductionPercent,
      annualSavingsKg,
      chartData: [
        { name: 'Baseline', value: currentTotal, fill: 'hsl(var(--muted))' },
        { name: 'Projected', value: projectedTotal, fill: 'hsl(var(--primary))' },
      ]
    };
  }, [baseData, savings]);

  if (isLoading) return <ForecastSkeleton />;

  if (!baseData || !projection) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navigation />
        <EmptyState 
          icon={LayoutPanelLeft}
          title="Simulator Locked"
          description="Baseline data is required for forecasting. Please complete an assessment."
          actionText="Begin Assessment"
          actionHref="/assessment"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="container mx-auto px-6 py-12" role="main">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">Impact Forecast Studio</h1>
          <p className="text-muted-foreground text-lg">Simulate lifestyle optimizations and project your carbon path.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-5 space-y-6" aria-label="Simulation Controls">
            <Card className="glass border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-12">
                <SimulationControl 
                  icon={Zap} 
                  label="Energy Transition" 
                  value={savings.energy} 
                  onChange={(v) => setSavings(s => ({...s, energy: v}))}
                  max={30}
                  desc="Investing in green energy infrastructure."
                  id="energy-slider"
                />
                <SimulationControl 
                  icon={Leaf} 
                  label="Dietary Efficiency" 
                  value={savings.food} 
                  onChange={(v) => setSavings(s => ({...s, food: v}))}
                  max={20}
                  desc="Optimizing protein sources and local sourcing."
                  id="food-slider"
                />
                <SimulationControl 
                  icon={TrendingDown} 
                  label="Mobility Shift" 
                  value={savings.transport} 
                  onChange={(v) => setSavings(s => ({...s, transport: v}))}
                  max={40}
                  desc="Transitioning to low-impact transit modes."
                  id="transport-slider"
                />
              </div>

              <Button 
                variant="ghost"
                className="w-full mt-12 h-14 rounded-2xl border border-white/5 hover:bg-white/5"
                onClick={() => setSavings({ transport: 0, food: 0, energy: 0 })}
                aria-label="Reset simulation to original baseline"
              >
                <RefreshCw className="mr-2 w-4 h-4" aria-hidden="true" /> Reset Simulation
              </Button>
            </Card>
          </section>

          <section className="lg:col-span-7 space-y-8" aria-label="Forecast Results">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Forecast Impact Summary">
              <SummaryBox label="Net Reduction" value={`${projection.reductionPercent}%`} color="text-accent" />
              <SummaryBox label="Annual Offset" value={`${projection.annualSavingsKg}kg`} color="text-primary" />
              <SummaryBox label="Efficiency Rank" value={projection.reductionPercent > 20 ? 'Gold' : 'Silver'} color="text-blue-400" />
            </div>

            <Card className="glass border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8">
                <CardTitle className="font-headline text-2xl">Projected Monthly Emissions</CardTitle>
                <CardDescription>Baseline vs Simulation Result (kg CO2e)</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] p-8">
                <div className="w-full h-full" role="img" aria-label={`Horizontal bar chart comparing baseline emissions (${projection.currentTotal}kg) with projected emissions after optimization (${projection.projectedTotal}kg).`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projection.chartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#888888" fontSize={14} tickLine={false} axisLine={false} width={100} />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ background: 'rgba(11, 17, 16, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={60}>
                        {projection.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="glass p-8 rounded-[2rem] border-accent/20 bg-accent/5 flex items-center gap-6 shadow-lg" role="region" aria-label="Impact Comparison">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0" aria-hidden="true">
                <ArrowDownCircle className="w-8 h-8" />
              </div>
              <div aria-live="polite">
                <h3 className="text-xl font-headline font-bold text-accent mb-2">Climate Impact Found</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These adjustments would prevent approximately {projection.annualSavingsKg}kg of CO2e annually. This equates to the sequestration power of {Math.round(projection.annualSavingsKg / 20)} mature trees.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SimulationControl({ icon: Icon, label, value, onChange, max, desc, id }: { icon: LucideIcon, label: string, value: number, onChange: (v: number) => void, max: number, desc: string, id: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <LabelUI htmlFor={id} className="font-medium text-lg">{label}</LabelUI>
        </div>
        <span className="text-primary font-bold text-lg" aria-live="polite">{value}%</span>
      </div>
      <Slider 
        id={id}
        value={[value]} 
        onValueChange={([v]) => onChange(v)} 
        max={max} step={1}
        aria-label={`${label} optimization percentage`}
      />
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function SummaryBox({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="glass p-6 rounded-3xl border-white/5 text-center shadow-lg" aria-label={`${label}: ${value}`}>
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
        <Skeleton className="h-24 w-1/2 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-5 h-[500px] rounded-3xl" />
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-3 gap-6 h-32">
              <Skeleton className="rounded-3xl" />
              <Skeleton className="rounded-3xl" />
              <Skeleton className="rounded-3xl" />
            </div>
            <Skeleton className="h-[400px] rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
