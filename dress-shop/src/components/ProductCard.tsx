'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  const handleQuickAdd = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      className="group relative bg-white dark:bg-secondary-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setShowQuickAdd(true)}
      onMouseLeave={() => setShowQuickAdd(false)}
    >
      <Link href={`/product/${product.id}`}>
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100 dark:bg-secondary-700">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.newArrival && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">New</span>
            )}
            {product.onSale && discount > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">-{discount}%</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-secondary-800 rounded-full shadow-md hover:scale-110 transition-transform"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-secondary-600 dark:text-secondary-300'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-secondary-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="flex gap-2 mt-3">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color.name}
                className="w-6 h-6 rounded-full border-2 border-secondary-300 dark:border-secondary-600"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-secondary-600 dark:text-secondary-400 self-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add */}
      {showQuickAdd && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 animate-slide-up">
          <div className="flex gap-2 mb-2">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-secondary-300 dark:border-secondary-600 rounded dark:bg-secondary-700 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-secondary-300 dark:border-secondary-600 rounded dark:bg-secondary-700 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {product.colors.map((color) => (
                <option key={color.name} value={color.name}>{color.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleQuickAdd();
            }}
            className={`w-full py-2 rounded font-medium transition-colors ${
              isAdded
                ? 'bg-green-600 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isAdded ? '✓ Added to Cart' : 'Quick Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
}
