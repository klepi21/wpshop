'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { productService } from '@/services/products';
import { categoryService } from '@/services/categories';
import { toast } from 'react-hot-toast';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load shop data:', error);
      toast.error('Failed to load shop data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    !selectedCategory || product.category_id === selectedCategory
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white">Shop</h1>
      </div>

      {/* Category Filters - Responsive */}
      <div className="relative mb-12">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none md:hidden z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none md:hidden z-10" />
        
        <div className="flex justify-start md:justify-center gap-3 overflow-x-auto scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0 py-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-none px-6 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-[#A67C52] text-white'
                : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-none px-6 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#A67C52] text-white'
                  : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-white text-center">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-white text-center">No products found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/shop/product/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-white">{product.name}</h3>
                  <p className="text-sm text-white/60">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 