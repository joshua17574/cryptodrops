'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Product } from '@/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let filtered = [...products];

    if (category === 'new') {
      filtered = filtered.filter(p => p.newArrival);
    } else if (category === 'sale') {
      filtered = filtered.filter(p => p.onSale);
    } else if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch) ||
        p.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p =>
        selectedSizes.some(size => p.sizes.includes(size))
      );
    }

    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [searchParams, selectedCategory, selectedSizes, priceRange, sortBy]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes)));

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Shop All Dresses</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'dress' : 'dresses'} found
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden px-4 py-2 bg-primary-600 text-white rounded-lg"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md">
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="mr-2"
                    />
                    <span className="capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {allSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded border transition-colors ${
                      selectedSizes.includes(size)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSizes([]);
                setPriceRange([0, 500]);
              }}
              className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort */}
          <div className="flex justify-end mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg dark:bg-secondary-800 dark:text-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-4">
                No dresses found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSizes([]);
                  setPriceRange([0, 500]);
                }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
