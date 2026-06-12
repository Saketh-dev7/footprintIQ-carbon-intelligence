"use client"

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FootprintData } from '@/types';
import { aiSustainabilityAdvisor, AISustainabilityAdvisorOutput } from '@/ai/flows/ai-sustainability-advisor-flow';
import { Leaf, Info, Flame, Lightbulb, Target, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<FootprintData | null>(null);
  const [aiInsights, setAiInsights] = useState<AISustainabilityAdvisorOutput | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('footprint_iq_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      fetchAIInsights(parsed);
    }
  }, []);

  const fetchAIInsights = async (footprint: FootprintData) => {
    setLoadingAI(true);
    try {
      const result = await aiSustainabilityAdvisor({
        total: footprint.total,
        transport: footprint.transport,
        food: footprint.food,
        energy: footprint.energy,
        shopping: footprint.shopping,
        waste: footprint.waste,
      });
      setAiInsights(result);
    } catch (error) {
      console.error('Failed to fetch AI insights', error);
    } finally {
      setLoadingAI(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <Navigation />
        <div className="space-y-6">
          <Leaf className="w-16 h-16 text-primary mx-auto animate-bounce" />
          <h1 className="text-3xl font-headline font-bold">No Data Found</h1>
          <p className="text-muted-foreground max-w-sm">Start your assessment to see your personalized carbon dashboard.</p>
          <Button asChild size="lg" className="rounded-full">
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

  const ecoScore = Math.max(0, 100 - Math.round(data.total / 10));

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Intelligence Hub</h1>
            <p className="text-muted-foreground text-lg">Real-time analysis of your environmental impact.</p>
          </div>
          <div className="glass p-6 rounded-3xl flex items-center gap-6 border-white/5">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">EcoScore</span>
              <div className="text-4xl font-headline font-bold text-accent">{ecoScore} / 100</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            label="Total Footprint" 
            value={`${data.total} kg`} 
            sub="CO2e / Month" 
            icon={Globe}
            color="text-primary"
          />
          <MetricCard 
            label="Daily Average" 
            value={`${Math.round(data.total / 30)} kg`} 
            sub="CO2e / Day" 
            icon={TrendingUp}
            color="text-blue-400"
          />
          <MetricCard 
            label="Current Status" 
            value={data.total > 400 ? 'High' : 'Moderate'} 
            sub="Impact Level" 
            icon={AlertCircle}
            color={data.total > 400 ? 'text-destructive' : 'text-accent'}
          />
          <MetricCard 
            label="Annual Estimate" 
            value={`${(data.total * 12 / 1000).toFixed(1)} t`} 
            sub="Metric Tons CO2e" 
            icon={Flame}
            color="text-orange-400"
          />
        </div>

        {/* Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 glass border-white/5 rounded-[2rem]">
            <CardHeader>
              <CardTitle className="font-headline">Emission Breakdown</CardTitle>
              <CardDescription>Monthly distribution across categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(11, 17, 16, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Advisor Panel */}
          <Card className="glass border-primary/20 bg-primary/5 rounded-[2rem] overflow-hidden relative">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">AI Sustainability Advisor</span>
              </div>
              <CardTitle className="font-headline">Personalized Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingAI ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-muted-foreground animate-pulse">Analyzing footprint patterns...</p>
                </div>
              ) : aiInsights ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Largest Source</h4>
                    <p className="text-xl font-headline font-bold text-primary">{aiInsights.largestEmissionSource}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Top Opportunities</h4>
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
                      <span className="text-xs font-bold uppercase tracking-wider">Weekly Challenge</span>
                    </div>
                    <p className="text-sm font-medium">{aiInsights.weeklySustainabilityChallenge}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Estimated Impact</span>
                    </div>
                    <p className="text-sm font-medium">{aiInsights.estimatedImpactPercentages}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No insights generated yet.</p>
                  <Button onClick={() => fetchAIInsights(data)}>Retry Analysis</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: { label: string, value: string, sub: string, icon: any, color: string }) {
  return (
    <Card className="glass border-white/5 rounded-3xl p-6">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-headline font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{sub}</div>
      </div>
    </Card>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}