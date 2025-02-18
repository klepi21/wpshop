'use client';

import { ProductCard } from '@/components/shop/ProductCard';

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <div className="text-white">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="text-white">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 