import { Product, Review, BlogPost } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Elegant Evening Gown',
    description: 'A stunning floor-length evening gown perfect for formal occasions. Features a fitted bodice with delicate beading and a flowing A-line skirt.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Evening',
    subcategory: 'Gowns',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Blue', hex: '#191970' },
      { name: 'Ruby Red', hex: '#E0115F' },
      { name: 'Emerald Green', hex: '#50C878' },
    ],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    featured: true,
    onSale: true,
    tags: ['formal', 'elegant', 'beaded'],
    material: '100% Silk with beaded embellishments',
    careInstructions: 'Dry clean only',
  },
  {
    id: '2',
    name: 'Summer Floral Maxi Dress',
    description: 'Light and breezy maxi dress with a beautiful floral print. Perfect for summer days and beach vacations.',
    price: 89.99,
    category: 'Casual',
    subcategory: 'Maxi',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Coral Bloom', hex: '#FF7F50' },
      { name: 'Lavender Fields', hex: '#E6E6FA' },
      { name: 'Sunshine Yellow', hex: '#FFD700' },
    ],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
    ],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    newArrival: true,
    tags: ['casual', 'floral', 'summer'],
    material: '95% Cotton, 5% Elastane',
    careInstructions: 'Machine wash cold, tumble dry low',
  },
  {
    id: '3',
    name: 'Classic Little Black Dress',
    description: 'Timeless little black dress with a modern twist. Features a flattering fit-and-flare silhouette and elegant cap sleeves.',
    price: 149.99,
    category: 'Cocktail',
    subcategory: 'Mini',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Classic Black', hex: '#000000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    ],
    rating: 4.9,
    reviewCount: 256,
    inStock: true,
    featured: true,
    tags: ['classic', 'versatile', 'cocktail'],
    material: '92% Polyester, 8% Spandex',
    careInstructions: 'Hand wash or dry clean',
  },
  {
    id: '4',
    name: 'Bohemian Wrap Dress',
    description: 'Flowing wrap dress with bohemian-inspired patterns. Adjustable tie waist for a perfect fit.',
    price: 119.99,
    originalPrice: 159.99,
    category: 'Casual',
    subcategory: 'Midi',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Terracotta', hex: '#E2725B' },
      { name: 'Sage Green', hex: '#9CAF88' },
      { name: 'Dusty Rose', hex: '#DCAE96' },
    ],
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800',
    ],
    rating: 4.7,
    reviewCount: 143,
    inStock: true,
    onSale: true,
    tags: ['bohemian', 'wrap', 'casual'],
    material: '100% Rayon',
    careInstructions: 'Machine wash cold, hang dry',
  },
  {
    id: '5',
    name: 'Vintage Tea Dress',
    description: 'Charming vintage-inspired tea dress with delicate lace details and a cinched waist.',
    price: 134.99,
    category: 'Vintage',
    subcategory: 'Midi',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Powder Blue', hex: '#B0E0E6' },
      { name: 'Blush Pink', hex: '#FFB6C1' },
    ],
    images: [
      'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
    ],
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    newArrival: true,
    tags: ['vintage', 'lace', 'romantic'],
    material: '80% Cotton, 20% Lace',
    careInstructions: 'Hand wash cold, lay flat to dry',
  },
  {
    id: '6',
    name: 'Modern Shift Dress',
    description: 'Sleek and sophisticated shift dress perfect for the office or evening events. Clean lines and minimalist design.',
    price: 109.99,
    category: 'Professional',
    subcategory: 'Shift',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Burgundy', hex: '#800020' },
    ],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800',
    ],
    rating: 4.5,
    reviewCount: 167,
    inStock: true,
    tags: ['professional', 'minimalist', 'versatile'],
    material: '68% Polyester, 28% Rayon, 4% Spandex',
    careInstructions: 'Machine wash cold, hang dry',
  },
  {
    id: '7',
    name: 'Sparkle Party Dress',
    description: 'Dazzling sequined dress that catches the light beautifully. Perfect for parties and celebrations.',
    price: 189.99,
    originalPrice: 249.99,
    category: 'Party',
    subcategory: 'Mini',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800',
    ],
    rating: 4.7,
    reviewCount: 201,
    inStock: true,
    featured: true,
    onSale: true,
    tags: ['party', 'sequin', 'glamorous'],
    material: 'Polyester with sequin embellishments',
    careInstructions: 'Dry clean only',
  },
  {
    id: '8',
    name: 'Romantic Lace Dress',
    description: 'Delicate lace overlay dress with a romantic silhouette. Features scalloped edges and a fitted bodice.',
    price: 169.99,
    category: 'Romantic',
    subcategory: 'Midi',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Soft Pink', hex: '#FFB6C1' },
    ],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
    ],
    rating: 4.9,
    reviewCount: 178,
    inStock: true,
    newArrival: true,
    tags: ['romantic', 'lace', 'elegant'],
    material: '100% Lace overlay with polyester lining',
    careInstructions: 'Hand wash or dry clean',
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Absolutely Stunning!',
    comment: 'This dress exceeded all my expectations. The quality is exceptional and it fit perfectly. I received so many compliments at the gala!',
    images: [],
    helpful: 24,
    verified: true,
    createdAt: new Date('2024-10-15'),
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Emily R.',
    rating: 4,
    title: 'Beautiful but runs small',
    comment: 'Gorgeous dress, but I recommend sizing up. The beading is exquisite and the fabric is luxurious.',
    images: [],
    helpful: 18,
    verified: true,
    createdAt: new Date('2024-10-20'),
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Spring Fashion Trends 2024',
    excerpt: 'Discover the hottest dress trends for the upcoming spring season.',
    content: 'Full blog content here...',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    author: 'Fashion Editor',
    publishedAt: new Date('2024-03-01'),
    category: 'Trends',
    tags: ['spring', 'trends', 'fashion'],
  },
  {
    id: '2',
    title: 'How to Style Your Little Black Dress',
    excerpt: '10 different ways to wear your LBD for any occasion.',
    content: 'Full blog content here...',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    author: 'Style Team',
    publishedAt: new Date('2024-02-15'),
    category: 'Styling Tips',
    tags: ['styling', 'lbd', 'versatile'],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.newArrival);
}

export function getOnSaleProducts(): Product[] {
  return products.filter((p) => p.onSale);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
