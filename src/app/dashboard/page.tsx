"use client"

import { useEffect, useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFootprint } from '@/hooks/use-footprint';
import { aiSustainabilityAdvisor, AISustainabilityAdvisorOutput } from '@/ai/flows/ai-sustainability-advisor-flow';
import { Globe, TrendingUp, Sparkles, AlertCircle, Loader2, Calendar, Target, ShieldCheck, Leaf, CheckCircle2, Circle } from 'lucide-react';
import { ActionPlanDay } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/EmptyState';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/dashboard/MetricCard';

export default function DashboardPage() {
  const { data, isLoading, completedTasks, toggleTaskCompletion } = useFootprint();
  const { toast } = useToast();
  const [aiInsights, setAiInsights] = useState<AISustainabilityAdvisorOutput | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchAIInsights = async () => {
    if (!data) return;
    setLoadingAI(true);
    try {
      const result = await aiSustainabilityAdvisor({
        total: data.total,
        transport: data.transport,
        food: data.food,
        energy: data.energy,
        shopping: data.shopping,
        waste: data.waste,
      });
      setAiInsights(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Analysis Offline",
        description: "Unable to generate real-time insights. Please check your connection."
      });
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (data && !aiInsights && !loadingAI) {
      fetchAIInsights();
    }
  }, [data]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Transport', value: data.transport, color: 'hsl(var(--chart-1))' },
      { name: 'Food', value: data.food, color: 'hsl(var(--chart-2))' },
      { name: 'Energy', value: data.energy, color: 'hsl(var(--chart-3))' },
      { name: 'Shopping', value: data.shopping, color: 'hsl(var(--chart-4))' },
      { name: 'Waste', value: data.waste, color: 'hsl(var(--chart-5))' },
    ];
  }, [data]);

  const weeks = useMemo(() => {
    if (!aiInsights?.actionPlan) return [];
    const plan = aiInsights.actionPlan;
    return [
      { name: 'Week 1', days: plan.slice(0, 7) },
      { name: 'Week 2', days: plan.slice(7, 14) },
      { name: 'Week 3', days: plan.slice(14, 21) },
      { name: 'Week 4', days: plan.slice(21, 30) },
    ];
  }, [aiInsights]);

  if (isLoading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navigation />
        <EmptyState 
          icon={Leaf}
          title="Intelligence Hub Locked"
          description="Complete your first lifestyle assessment to unlock deep environmental analytics."
          actionText="Start Assessment"
          actionHref="/assessment"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="container mx-auto px-6 py-12" role="main">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Intelligence Hub</h1>
            <p className="text-muted-foreground text-lg">Detailed analysis of your footprint and reduction opportunities.</p>
          </div>
          <div className="glass p-6 rounded-3xl flex items-center gap-6 border-white/5 shadow-xl" aria-label={`Current EcoScore: ${data.ecoScore} out of 100`}>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">EcoScore</span>
              <div className="text-4xl font-headline font-bold text-accent">{data.ecoScore} / 100</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent" aria-hidden="true">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" aria-label="Key Sustainability Metrics">
          <MetricCard label="Total Impact" value={`${data.total} kg`} sub="CO2e / Month" icon={Globe} color="text-primary" />
          <MetricCard label="Daily Average" value={`${Math.round(data.total / 30)} kg`} sub="CO2e / Day" icon={TrendingUp} color="text-blue-400" />
          <MetricCard label="Sustainability Status" value={data.ecoScore > 70 ? 'Optimal' : 'Needs Action'} sub={data.ecoScore > 70 ? 'Great job!' : 'High impact detected'} icon={AlertCircle} color={data.ecoScore > 70 ? 'text-accent' : 'text-orange-400'} />
          <MetricCard label="Annual Projection" value={`${(data.total * 12 / 1000).toFixed(1)} t`} sub="Metric Tons CO2e" icon={Calendar} color="text-orange-400" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-2 glass border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="font-headline text-2xl">Emissions Profile</CardTitle>
              <CardDescription>Visual breakdown by lifestyle category</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-8 pt-0">
              <div className="w-full h-full" role="img" aria-label="Bar chart showing carbon emissions breakdown.">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                      contentStyle={{ background: 'rgba(11, 17, 16, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} 
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="glass border-primary/20 bg-primary/5 rounded-[2.5rem] overflow-hidden flex flex-col">
              <CardHeader className="p-8">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Target className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-widest">Monthly Tracker</span>
                </div>
                <CardTitle className="font-headline text-2xl">Reduction Goal</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                {loadingAI ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-4" aria-live="polite">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">Calculating targets...</p>
                  </div>
                ) : aiInsights?.monthlyReductionGoal ? (
                  <div className="space-y-6 animate-in fade-in duration-700">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-muted-foreground">Goal: {aiInsights.monthlyReductionGoal.title}</span>
                        <span className="font-bold text-primary" aria-live="polite">{aiInsights.monthlyReductionGoal.currentProgressPercent}%</span>
                      </div>
                      <Progress 
                        value={aiInsights.monthlyReductionGoal.currentProgressPercent} 
                        className="h-2 bg-white/5" 
                        aria-label={`Progress towards ${aiInsights.monthlyReductionGoal.title}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Target</span>
                        <div className="text-lg font-bold">{aiInsights.monthlyReductionGoal.targetReductionKg}kg</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Remaining</span>
                        <div className="text-lg font-bold">
                          {Math.max(0, aiInsights.monthlyReductionGoal.targetReductionKg - Math.round((aiInsights.monthlyReductionGoal.targetReductionKg * aiInsights.monthlyReductionGoal.currentProgressPercent) / 100))}kg
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "{aiInsights.monthlyReductionGoal.description}"
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Button onClick={fetchAIInsights} variant="outline" className="rounded-xl w-full">Initialize AI Advisor</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-accent/20 bg-accent/5 rounded-[2.5rem] p-8 shadow-xl">
              <div className="flex items-center gap-2 text-accent mb-4">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest">Sustainability Rank</span>
              </div>
              <div className="text-3xl font-headline font-bold mb-2">
                {data.ecoScore > 80 ? 'Eco Master' : data.ecoScore > 50 ? 'Green Warrior' : 'Emerging Guardian'}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your current habits place you in the top {Math.max(5, 100 - data.ecoScore)}% of global users for efficiency.
              </p>
            </Card>
          </aside>
        </div>

        {aiInsights?.actionPlan && (
          <section className="space-y-8 mt-16 animate-in slide-in-from-bottom duration-700" aria-label="30-Day Reduction Plan">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" aria-hidden="true" />
                <h2 className="text-3xl font-headline font-bold">30-Day Reduction Roadmap</h2>
              </div>
              <div className="text-sm text-muted-foreground font-medium bg-white/5 px-4 py-2 rounded-full border border-white/5">
                Daily Progressive Action Plan
              </div>
            </div>

            <Tabs defaultValue="week-1" className="w-full">
              <TabsList className="grid grid-cols-4 h-14 p-1 glass border-white/5 rounded-2xl mb-8">
                {weeks.map((w, idx) => (
                  <TabsTrigger 
                    key={idx} 
                    value={`week-${idx + 1}`} 
                    className="rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs"
                    aria-label={`Show ${w.name}`}
                  >
                    {w.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {weeks.map((w, idx) => (
                <TabsContent key={idx} value={`week-${idx + 1}`} className="outline-none" role="tabpanel">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4" role="list">
                    {w.days.map((day) => (
                      <ActionDayCard
                        key={day.day}
                        day={day}
                        completed={completedTasks.includes(day.day)}
                        onToggle={() => toggleTaskCompletion(day.day)}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}
      </main>
    </div>
  );
}

function ActionDayCard({ day, completed, onToggle }: { day: ActionPlanDay, completed: boolean, onToggle: () => void }) {
  return (
    <Card className={`glass border-white/5 rounded-2xl hover:border-primary/30 transition-all overflow-hidden group ${completed ? 'border-accent/40' : ''}`} role="listitem">
      <div className="bg-primary/10 p-3 flex justify-between items-center border-b border-white/5 group-hover:bg-primary/20 transition-colors">
        <span className="font-headline font-bold text-primary text-sm">Day {day.day}</span>
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
          day.impact === 'high' ? 'bg-orange-500/20 text-orange-400' :
          day.impact === 'medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-accent/20 text-accent'
        }`}>
          {day.impact} Impact
        </span>
      </div>
      <CardContent className="p-4 text-xs leading-relaxed min-h-[100px] flex flex-col gap-3">
        <p className="flex-1">{day.task}</p>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={completed}
          className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider self-start transition-colors ${completed ? 'text-accent' : 'text-muted-foreground hover:text-primary'}`}
        >
          {completed ? <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> : <Circle className="w-4 h-4" aria-hidden="true" />}
          {completed ? 'Implemented' : 'Mark Implemented'}
        </button>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <div className="container mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-24 w-64 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-[2.5rem]" />
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
