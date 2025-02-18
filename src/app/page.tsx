'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { productService } from '@/services/products';
import { toast } from 'react-hot-toast';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { Faq3 } from '@/components/blocks/faq3';
import { CraftsmanshipTimeline } from "@/components/blocks/CraftsmanshipTimeline";
import { WoodworkTestimonials } from "@/components/blocks/WoodworkTestimonials";
import { BrandsGridDemo } from '@/components/ui/brands-demo';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productService.getAll();
      setFeaturedProducts(products.slice(0, 3)); // Show first 3 products
    } catch (error) {
      console.error('Failed to load featured products:', error);
      toast.error('Failed to load featured products');
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept cryptocurrency payments through the MultiversX ecosystem. You can pay with EGLD, USDC, or RARE tokens."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order status by visiting the 'My Orders' page in your account. Once your order is shipped, the tracking number will be available there."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn items in their original packaging. Please contact our support team to initiate a return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. We also offer express shipping which takes 2-3 business days. Shipping times may vary based on your location."
    },
    {
      question: "Are the products authentic?",
      answer: "Yes, all our products are 100% authentic and come with a certificate of authenticity. We source our products directly from verified manufacturers."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide. International shipping times and costs may vary depending on your location."
    }
  ];

  return (
    <div className="min-h-screen">
      <BackgroundPaths 
        title="WoodenPunks Limited"
        subtitle="Bridging Digital and Physical with Custom Creations"
      />
      
      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Products</h2>
          {isLoading ? (
            <div className="text-white text-center">Loading featured products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/shop/product/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-white/60">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Craftsmanship Process */}
      <CraftsmanshipTimeline />

      {/* FAQ Section */}
      <Faq3 
        heading="Common Questions"
        description="Everything you need to know about our wooden creations, shipping, and services. Have more questions? We're here to help."
        supportHeading="Still have questions?"
        supportDescription="Our team is passionate about what we do and we're always happy to help you with any questions about our products or services."
        supportButtonText="Get in Touch"
        supportButtonUrl="mailto:contact@woodenpunks.com"
      />

      {/* Partners Section */}
      <BrandsGridDemo />

      {/* Testimonials */}
      <WoodworkTestimonials />
    </div>
  );
}