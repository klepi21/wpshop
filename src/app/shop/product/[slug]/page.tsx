'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { productService } from '@/services/products';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { ShareProduct } from '@/components/shop/ShareProduct';
import { ProductCard } from '@/components/shop/ProductCard';
import { Textarea } from "@/components/ui/textarea";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [customizationText, setCustomizationText] = useState<string>('');

  useEffect(() => {
    // Test connection first
    const testConnection = async () => {
      const isConnected = await productService.testConnection();
      console.log('Supabase connection test:', isConnected);
    };
    
    testConnection();
    
    const loadProduct = async () => {
      try {
        console.log('Fetching product with slug:', slug); // Debug log
        const data = await productService.getBySlug(slug as string);
        console.log('Fetched product data:', data); // Debug log
        
        if (data) {
          setProduct(data);
          if (data.images?.[0]) {
            setSelectedImage(data.images[0]);
          }
          if (data.category_id) {
            fetchRelatedProducts(data.category_id, data.id);
          }
          // Set initial available stock based on whether the product has sizes
          if (data.has_sizes) {
            // Don't set initial stock for products with variations
            // until a variation is selected
            setAvailableStock(0);
          } else {
            setAvailableStock(data.stock);
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

  // Update available stock when variation changes
  useEffect(() => {
    if (product?.has_sizes && selectedVariation) {
      const variation = product.variations.find((v: any) => v.name === selectedVariation);
      setAvailableStock(variation?.stock || 0);
    } else {
      setAvailableStock(product?.stock || 0);
    }
  }, [selectedVariation, product]);

  const fetchRelatedProducts = async (categoryId: string, currentProductId: string) => {
    try {
      const products = await productService.getByCategory(categoryId);
      // Filter out current product and limit to 4 related products
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
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.has_sizes && !selectedVariation) {
      toast.error('Please select a size');
      return;
    }
    
    if (quantity > availableStock) {
      toast.error('Not enough stock available');
      return;
    }
    
    addToCart(product, quantity, selectedVariation, customizationText);
  };

  const incrementQuantity = () => {
    if (quantity < Math.min(5, availableStock)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images - More Minimal */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 max-w-md mx-auto">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-md mx-auto">
            {product.images?.map((image: string) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`relative w-16 aspect-square flex-shrink-0 rounded-md overflow-hidden bg-zinc-900 
                  ${selectedImage === image ? 'ring-2 ring-[#A67C52]' : ''}`}
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
        </div>

        {/* Product Info */}
        <div className="space-y-6 max-w-md">
          <div>
            <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          </div>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.63604 18.364C2.12132 14.8493 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8493 2.12132 18.364 5.63604C21.8787 9.15076 21.8787 14.8493 18.364 18.364C14.8493 21.8787 9.15076 21.8787 5.63604 18.364Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 7H15M9 11H15M9 15H13M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Customize</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Worldwide Shipping</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium text-white">Description</h3>
            <p className="text-sm text-white/60">{product.description}</p>
          </div>

          <div className="space-y-4">
            {/* Availability and Quantity in same row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Availability:</span>
                <span className={`text-sm ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-white">Quantity:</label>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || availableStock === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-l-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-8 flex items-center justify-center bg-zinc-900 text-white border-x border-zinc-800">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= Math.min(5, availableStock) || availableStock === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-r-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Size Variations */}
            {product.has_sizes && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Size:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variations?.map((variation: any) => (
                      <button
                        key={variation.name}
                        onClick={() => {
                          setSelectedVariation(variation.name);
                          setAvailableStock(variation.stock);
                        }}
                        className={`px-6 py-3 rounded-lg border ${
                          selectedVariation === variation.name
                            ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]'
                            : variation.stock > 0
                            ? 'border-white/10 text-white/60 hover:border-white/20'
                            : 'border-white/5 text-white/30 cursor-not-allowed'
                        }`}
                        disabled={variation.stock === 0}
                      >
                        <span className="text-sm font-medium">{variation.name}</span>
                        {variation.stock === 0 && (
                          <span className="block text-xs mt-1 text-white/30">(Out of Stock)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Display */}
                {selectedVariation && (
                  <div className="text-sm text-white/60">
                    {availableStock > 0 ? (
                      <span>{availableStock} in stock</span>
                    ) : (
                      <span className="text-red-500">Out of stock</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Price section */}
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">${(product.price * quantity).toFixed(2)}</p>
              {quantity > 1 && (
                <span className="text-sm text-white/60">
                  (${product.price.toFixed(2)} each)
                </span>
              )}
            </div>

            {/* Customization Input */}
            {product.has_customization && (
              <div className="space-y-2">
                <label htmlFor="customization" className="block text-sm font-medium text-white">
                  Customization Details
                </label>
                <textarea
                  id="customization"
                  placeholder="Enter your customization details..."
                  value={customizationText}
                  onChange={(e) => setCustomizationText(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                    text-white placeholder-white/50 focus:outline-none focus:ring-2 
                    focus:ring-[#A67C52] focus:border-transparent min-h-[100px]
                    hover:bg-white/[0.15] transition-colors"
                />
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={availableStock === 0}
              className={`w-full bg-gradient-to-r from-[#A67C52] to-[#D4B08C] text-black px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity mt-4
                ${availableStock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
  );
} 