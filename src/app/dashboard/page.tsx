"use client"

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFootprint } from '@/hooks/use-footprint';
import { aiSustainabilityAdvisor, AISustainabilityAdvisorOutput } from '@/ai/flows/ai-sustainability-advisor-flow';
import { Leaf, Globe, Flame, Target, TrendingUp, Sparkles, AlertCircle, CheckCircle2, Loader2, Calendar, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading } = useFootprint();
  const { toast } = useToast();
  const [aiInsights, setAiInsights] = useState<AISustainabilityAdvisorOutput | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (data && !aiInsights) {
      fetchAIInsights();
    }
  }, [data, aiInsights]);

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
        title: "AI Analysis Failed",
        description: "We couldn't generate personalized insights right now. Please try again."
      });
    } finally {
      setLoadingAI(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-background">
        <Navigation />
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <Leaf className="w-16 h-16 text-primary mx-auto animate-bounce" />
          <h1 className="text-4xl font-headline font-bold">No Data Found</h1>
          <p className="text-muted-foreground max-w-sm text-lg">Start your assessment to see your personalized carbon dashboard.</p>
          <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg">
            <Link href="/assessment">Start Assessment</Link>
          </Button>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Transport', value: data.transport, color: 'hsl(var(--chart-1))' },
    { name: 'Food', value: data.food, color: 'hsl(var(--chart-2))' },
    { name: 'Energy', value: data.energy, color: 'hsl(var(--chart-3))' },
    { name: 'Shopping', value: data.shopping, color: 'hsl(var(--chart-4))' },
    { name: 'Waste', value: data.waste, color: 'hsl(var(--chart-5))' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Intelligence Hub</h1>
            <p className="text-muted-foreground text-lg">Real-time analysis of your environmental impact.</p>
          </div>
          <div className="glass p-6 rounded-3xl flex items-center gap-6 border-white/5 shadow-xl">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">EcoScore</span>
              <div className="text-4xl font-headline font-bold text-accent">{data.ecoScore} / 100</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard label="Total Footprint" value={`${data.total} kg`} sub="CO2e / Month" icon={Globe} color="text-primary" />
          <MetricCard label="Daily Average" value={`${Math.round(data.total / 30)} kg`} sub="CO2e / Day" icon={TrendingUp} color="text-blue-400" />
          <MetricCard label="Eco Status" value={data.ecoScore > 70 ? 'Greener' : 'Improving'} sub="Based on score" icon={AlertCircle} color={data.ecoScore > 70 ? 'text-accent' : 'text-orange-400'} />
          <MetricCard label="Annual Estimate" value={`${(data.total * 12 / 1000).toFixed(1)} t`} sub="Metric Tons CO2e" icon={Flame} color="text-orange-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 glass border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="font-headline text-2xl">Emission Breakdown</CardTitle>
              <CardDescription>Monthly distribution across categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-8 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: 'rgba(11, 17, 16, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20 bg-primary/5 rounded-[2rem] overflow-hidden flex flex-col">
            <CardHeader className="p-8">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">AI Advisor</span>
              </div>
              <CardTitle className="font-headline text-2xl">Personalized Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6 flex-1">
              {loadingAI ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 h-full">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-muted-foreground animate-pulse text-sm">Analyzing footprint patterns...</p>
                </div>
              ) : aiInsights ? (
                <div className="space-y-6 animate-in fade-in duration-700">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Largest Source</h4>
                        <p className="text-xl font-headline font-bold text-primary">{aiInsights.largestEmissionSource}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Top Opportunities</h4>
                    {aiInsights.topImprovementOpportunities.map((opt, i) => (
                      <div key={i} className="flex gap-3 text-sm leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                      <Target className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Estimated Impact</span>
                    </div>
                    <p className="text-sm font-medium">{aiInsights.estimatedImpactPercentages}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No insights generated yet.</p>
                  <Button onClick={fetchAIInsights} variant="outline" className="rounded-xl">Analyze Now</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Plan Section */}
        {aiInsights?.actionPlan && (
          <div className="space-y-6 mt-12 animate-in slide-in-from-bottom duration-700">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-headline font-bold">30-Day Roadmap</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {aiInsights.actionPlan.slice(0, 10).map((day) => (
                <Card key={day.day} className="glass border-white/5 rounded-2xl hover:border-primary/30 transition-all group overflow-hidden">
                  <div className="bg-primary/10 p-3 flex justify-between items-center border-b border-white/5">
                    <span className="font-headline font-bold text-primary">Day {day.day}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      day.impact === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      day.impact === 'medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-accent/20 text-accent'
                    }`}>
                      {day.impact}
                    </span>
                  </div>
                  <CardContent className="p-4 text-sm leading-relaxed min-h-[80px]">
                    {day.task}
                  </CardContent>
                </Card>
              ))}
              <div className="glass border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-muted-foreground text-sm italic group hover:border-primary/50 transition-colors">
                <Sparkles className="w-5 h-5 mb-2 text-primary opacity-50" />
                <span>View full 30-day plan in Action Center</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: { label: string, value: string, sub: string, icon: any, color: string }) {
  return (
    <Card className="glass border-white/5 rounded-3xl p-6 shadow-lg hover:translate-y-[-4px] transition-transform">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-headline font-bold">{value}</div>
        <div className="text-xs text-muted-foreground font-medium">{sub}</div>
      </div>
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
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-[2rem]" />
          <Skeleton className="h-[400px] rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}
