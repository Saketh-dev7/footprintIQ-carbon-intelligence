"use client"

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
}

export function MetricCard({ label, value, sub, icon: Icon, color }: MetricCardProps) {
  return (
    <Card 
      className="glass border-white/5 rounded-[2.5rem] p-6 shadow-lg hover:translate-y-[-4px] transition-transform" 
      aria-label={`${label}: ${value}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className={cn("p-2 rounded-xl bg-white/5", color)} aria-hidden="true">
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
