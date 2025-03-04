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
import { ProductCard } from '@/components/shop/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      }
    };

    loadFeaturedProducts();
  }, []);

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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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