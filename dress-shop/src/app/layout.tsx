import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveChat from '@/components/LiveChat';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Elegance - Premium Dress Shop',
  description: 'Discover elegant, timeless dresses for every occasion. Quality craftsmanship meets modern style.',
  keywords: 'dresses, fashion, elegant dresses, evening gowns, casual dresses, online shopping',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white transition-colors`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
                <LiveChat />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
