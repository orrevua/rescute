import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/context';
import { Footer } from '@/components/ui/Footer';
import { Navbar } from '@/components/ui/Navbar';
import './globals.css';
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
export const metadata: Metadata = { title: 'Rescute', description: 'Cat adoption platform' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={inter.variable} lang="en-US">
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 bg-[#f5f0e1]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
