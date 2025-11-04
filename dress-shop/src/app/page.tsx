import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, getNewArrivals } from '@/lib/products';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary-100 to-primary-200 dark:from-secondary-800 dark:to-secondary-700">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-secondary-900 dark:text-white">
              Elegance Redefined
            </h1>
            <p className="text-xl mb-8 text-secondary-700 dark:text-secondary-300">
              Discover our curated collection of timeless dresses that celebrate your unique style and grace.
            </p>
            <div className="flex gap-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/style-quiz"
                className="px-8 py-4 bg-white dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white border-2 border-secondary-300 dark:border-secondary-600 rounded-lg font-semibold transition-colors"
              >
                Take Style Quiz
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
            alt="Elegant dress"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Handpicked fabrics and expert craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Safe and encrypted transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">On orders over $100</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Collection</h2>
            <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Handpicked favorites that embody timeless elegance and contemporary style
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">New Arrivals</h2>
            <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Fresh styles just in. Be the first to discover our latest designs
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/shop?category=new"
              className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Shop by Occasion</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Evening Wear', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', category: 'Evening' },
              { name: 'Casual Dresses', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', category: 'Casual' },
              { name: 'Cocktail Dresses', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800', category: 'Cocktail' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/shop?category=${category.category}`}
                className="group relative h-96 rounded-lg overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <h3 className="text-white text-3xl font-serif font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Find Your Perfect Dress</h2>
          <p className="text-xl mb-8 opacity-90">
            Take our style quiz and get personalized recommendations
          </p>
          <Link
            href="/style-quiz"
            className="inline-block px-8 py-4 bg-white text-primary-600 hover:bg-secondary-100 rounded-lg font-semibold transition-colors"
          >
            Start Style Quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
