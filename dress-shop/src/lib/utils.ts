import { Currency, CurrencyRate } from '@/types';

export function formatPrice(price: number, currency: Currency = 'USD'): string {
  const rates: Record<Currency, CurrencyRate> = {
    USD: { code: 'USD', symbol: '$', rate: 1 },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
    CAD: { code: 'CAD', symbol: 'CA$', rate: 1.36 },
    AUD: { code: 'AUD', symbol: 'A$', rate: 1.53 },
  };

  const rate = rates[currency];
  const convertedPrice = price * rate.rate;
  
  return `${rate.symbol}${convertedPrice.toFixed(2)}`;
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
