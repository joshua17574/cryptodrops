'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, products } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductById(params.id as string);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0].name || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-primary-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600">Shop</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.onSale && discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded">
                Save {discount}%
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary-600' : ''
                }`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex text-yellow-400 text-xl">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-secondary-600 dark:text-secondary-400">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-2xl text-secondary-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-secondary-700 dark:text-secondary-300 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold">Color: {selectedColor}</label>
            </div>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? 'border-primary-600 scale-110'
                      : 'border-secondary-300 dark:border-secondary-600'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold">Size: {selectedSize}</label>
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
              >
                Size Guide
              </button>
            </div>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    selectedSize === size
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="font-semibold block mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className="px-6 py-4 border-2 border-secondary-300 dark:border-secondary-600 rounded-lg hover:border-primary-600 transition-colors"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                className={`w-6 h-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-none'}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Features */}
          <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Easy 30-day returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="border-b border-secondary-200 dark:border-secondary-700 mb-6">
          <div className="flex gap-8">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {activeTab === 'description' && (
            <div>
              <h3>Product Details</h3>
              <p>{product.description}</p>
              {product.material && (
                <>
                  <h4>Material</h4>
                  <p>{product.material}</p>
                </>
              )}
              {product.careInstructions && (
                <>
                  <h4>Care Instructions</h4>
                  <p>{product.careInstructions}</p>
                </>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              <h3>Customer Reviews</h3>
              <p>Be the first to review this product!</p>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div>
              <h3>Shipping Information</h3>
              <p>Free standard shipping on orders over $100. Express shipping available at checkout.</p>
              <p>Orders typically ship within 1-2 business days.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-serif font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
