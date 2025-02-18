'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { productService } from '@/services/products';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { ShareProduct } from '@/components/shop/ShareProduct';
import { ProductCard } from '@/components/shop/ProductCard';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  const incrementQuantity = () => {
    if (quantity < Math.min(5, product?.stock || 0)) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.has_sizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize);
    toast.success('Added to cart');
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getBySlug(slug as string);
        if (data) {
          setProduct(data);
          if (data.images?.[0]) {
            setSelectedImage(data.images[0]);
          }
          if (data.category_id) {
            fetchRelatedProducts(data.category_id, data.id);
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const fetchRelatedProducts = async (categoryId: string, currentProductId: string) => {
    try {
      const products = await productService.getByCategory(categoryId);
      setRelatedProducts(
        products
          .filter(p => p.id !== currentProductId)
          .slice(0, 4)
      );
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-white text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-white text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
              <Image
                src={selectedImage || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-zinc-900 ${
                      selectedImage === image ? 'ring-2 ring-[#A67C52]' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-white/60">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-white">Quantity:</label>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-l-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-8 flex items-center justify-center bg-zinc-900 text-white">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= Math.min(5, product.stock)}
                    className="w-8 h-8 flex items-center justify-center rounded-r-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Size Selector */}
              {product.has_sizes && (
                <div className="space-y-2">
                  <label className="text-sm text-white">Size:</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedSize === size 
                            ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                            : 'border-white/10 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">
                  ${(product.price * quantity).toFixed(2)}
                </p>
                {quantity > 1 && (
                  <span className="text-sm text-white/60">
                    (${product.price.toFixed(2)} each)
                  </span>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full bg-gradient-to-r from-[#A67C52] to-[#D4B08C] text-black px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity
                  ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </motion.button>
            </div>

            {/* Share Product */}
            <div className="pt-6 border-t border-white/10">
              <ShareProduct product={product} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-white/10 pt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 