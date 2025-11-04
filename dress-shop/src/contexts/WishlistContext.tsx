'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, WishlistItem } from '@/types';

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const parsed = JSON.parse(savedWishlist);
      setItems(parsed.map((item: WishlistItem) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      })));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToWishlist = (product: Product) => {
    setItems((prevItems) => {
      const exists = prevItems.find((item) => item.product.id === product.id);
      if (exists) return prevItems;
      return [...prevItems, { product, addedAt: new Date() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
