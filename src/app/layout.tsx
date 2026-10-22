import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeContext';

export const metadata: Metadata = {
  title: 'CogniPulse — Apple Health Neuro-Vitals & Gemini Clinical Copilot',
  description:
    'Platform asesmen kelelahan kognitif kerja (Fitness-for-Duty) dan deteksi Silent Fatigue berbasis standar medis NASA Dinges PVT dan Gemini Clinical Reasoning.',
  authors: [{ name: 'CogniPulse Team - ICONFEST 2026' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light" suppressHydrationWarning>
      <body className="min-h-[100dvh] font-sans antialiased selection:bg-apple-blue/20 selection:text-apple-blue">
        <ThemeProvider>
          <div className="flex flex-col min-h-[100dvh]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
