import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/context';
import { Footer } from '@/components/ui/Footer';
import { Navbar } from '@/components/ui/Navbar';
import './globals.css';
const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
export const metadata: Metadata = { title: 'Rescute', description: 'Cat adoption platform' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html className={geist.variable} lang="en-US"><body className="flex min-h-screen flex-col"><AuthProvider><Navbar /><main className="flex-1">{children}</main><Footer /></AuthProvider></body></html>; }
