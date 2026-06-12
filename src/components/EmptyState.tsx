import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionText, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
        <Icon className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-headline font-bold mb-3">{title}</h2>
      <p className="text-muted-foreground max-w-sm mb-8 text-lg">{description}</p>
      {actionText && actionHref && (
        <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20">
          <Link href={actionHref}>{actionText}</Link>
        </Button>
      )}
    </div>
  );
}
