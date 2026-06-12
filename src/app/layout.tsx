import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

export const metadata: Metadata = {
  title: 'FootprintIQ | Measure Smarter. Live Greener.',
  description: 'AI-powered Carbon Intelligence Platform to track and reduce your environmental impact.',
  keywords: ['carbon footprint', 'sustainability', 'green living', 'AI', 'eco-friendly'],
  authors: [{ name: 'FootprintIQ Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#0b1110',
  openGraph: {
    title: 'FootprintIQ | Carbon Intelligence',
    description: 'Track and reduce your environmental impact with AI-powered insights.',
    type: 'website',
    url: 'https://footprint-iq.app',
    siteName: 'FootprintIQ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-white">
          Skip to content
        </a>
        <div id="main-content">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
