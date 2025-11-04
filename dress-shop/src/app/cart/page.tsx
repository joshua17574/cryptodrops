'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
              className="bg-white dark:bg-secondary-800 rounded-lg p-4 shadow-md flex gap-4"
            >
              <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <Link
                  href={`/product/${item.product.id}`}
                  className="font-semibold hover:text-primary-600 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  Size: {item.selectedSize} | Color: {item.selectedColor}
                </p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-2">
                  {formatPrice(item.product.price)}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 rounded border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 rounded border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                    }
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 shadow-md sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-400">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-400">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-400">Tax</span>
                <span className="font-semibold">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {subtotal < 100 && (
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                Add {formatPrice(100 - subtotal)} more for free shipping!
              </p>
            )}

            <Link
              href="/checkout"
              className="block w-full px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white text-center rounded-lg font-semibold transition-colors mb-3"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="block w-full px-6 py-3 border-2 border-secondary-300 dark:border-secondary-600 text-center rounded-lg font-semibold hover:border-primary-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
