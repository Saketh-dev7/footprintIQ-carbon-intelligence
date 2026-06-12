import Link from 'next/link';
import { Leaf, LayoutDashboard, Calculator, MessageSquare, LineChart, Trophy } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Assessment', href: '/assessment', icon: Calculator },
  { label: 'Forecast', href: '/forecast', icon: LineChart },
  { label: 'Assistant', href: '/assistant', icon: MessageSquare },
  { label: 'Progress', href: '/progress', icon: Trophy },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 glass rounded-full flex items-center gap-8 md:gap-12 shadow-2xl">
      <Link href="/" className="hidden md:flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
          <Leaf className="w-5 h-5" />
        </div>
        <span className="font-headline font-bold text-lg">FootprintIQ</span>
      </Link>
      <div className="flex items-center gap-6 md:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium uppercase tracking-wider hidden sm:block">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}