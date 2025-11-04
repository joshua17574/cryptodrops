'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-secondary-900 shadow-md transition-colors">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-4">
            <span className="text-secondary-600 dark:text-secondary-400">Free shipping on orders over $100</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link href="/help" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Help
            </Link>
            {isAuthenticated ? (
              <Link href="/profile" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Hi, {user?.name}
              </Link>
            ) : (
              <Link href="/login" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-bold text-primary-600 dark:text-primary-400">
            Elegance
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Shop All
            </Link>
            <Link href="/shop?category=new" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              New Arrivals
            </Link>
            <Link href="/shop?category=sale" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Sale
            </Link>
            <Link href="/style-quiz" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Style Quiz
            </Link>
            <Link href="/blog" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Blog
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Wishlist"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4 animate-slide-down">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for dresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-white"
              />
              <button
                onClick={() => {
                  if (searchQuery) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <nav className="flex flex-col gap-4">
              <Link href="/shop" className="py-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Shop All
              </Link>
              <Link href="/shop?category=new" className="py-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                New Arrivals
              </Link>
              <Link href="/shop?category=sale" className="py-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Sale
              </Link>
              <Link href="/style-quiz" className="py-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Style Quiz
              </Link>
              <Link href="/blog" className="py-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                Blog
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
