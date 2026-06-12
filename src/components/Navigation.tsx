import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Calculator, MessageSquare, LineChart, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Assessment', href: '/assessment', icon: Calculator },
  { label: 'Forecast', href: '/forecast', icon: LineChart },
  { label: 'Assistant', href: '/assistant', icon: MessageSquare },
  { label: 'Progress', href: '/progress', icon: Trophy },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav 
      aria-label="Primary Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 glass rounded-full flex items-center gap-8 md:gap-12 shadow-2xl border-white/10"
    >
      <Link href="/" aria-label="FootprintIQ Home" className="hidden md:flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
          <Leaf className="w-5 h-5" />
        </div>
        <span className="font-headline font-bold text-lg">FootprintIQ</span>
      </Link>
      <div className="flex items-center gap-6 md:gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex flex-col items-center gap-1 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
