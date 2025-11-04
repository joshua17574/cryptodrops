export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: Color[];
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
  tags?: string[];
  material?: string;
  careInstructions?: string;
}

export interface Color {
  name: string;
  hex: string;
  images?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  loyaltyPoints?: number;
  memberSince?: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: Date;
  estimatedDelivery?: Date;
}

export interface StyleQuizAnswer {
  question: string;
  answer: string;
}

export interface FilterOptions {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  rating?: number;
  inStock?: boolean;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: Date;
  category: string;
  tags: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  date: Date;
  time: string;
  type: 'styling' | 'fitting' | 'consultation';
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rate: number;
}
