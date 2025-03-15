'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { WoodGrainPattern } from '@/components/about/WoodGrainPattern';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl relative">
      <WoodGrainPattern />
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About WoodenPunks</h1>
        <div className="w-24 h-1 bg-[#A67C52] mx-auto"></div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-square relative overflow-hidden rounded-xl">
            <Image
              src="/img/wdpunklogo.png"
              alt="WoodenPunks Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#A67C52]/10 rounded-full -z-10"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#A67C52]/10 rounded-full -z-10"></div>
        </motion.div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Our Story</h2>
            <p className="text-white/70 leading-relaxed">
              At WoodenPunks, we transform unique wooden creations into NFTs, expanding our product line from coasters to sunglasses, clocks, and more, while partnering with NFT projects for customized offerings.
            </p>
            <p className="text-white/70 leading-relaxed">
              Founded by an NFT enthusiast, WoodenPunks started as a hobby and evolved into a thriving online store, merging craftsmanship with digital art to create exceptional wooden products for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-[#A67C52] text-3xl font-bold">50+</div>
              <div className="text-white/70 text-sm">Product Variations</div>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-[#A67C52] text-3xl font-bold">10+</div>
              <div className="text-white/70 text-sm">NFT Partnerships</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-20"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-10">Our Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-[#A67C52]/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#A67C52]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 14L12 11M12 11L15 14M12 11V19M5 8L12 5L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Digital Meets Physical</h3>
            <p className="text-white/60">Bridging the gap between NFT art and tangible craftsmanship</p>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-[#A67C52]/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#A67C52]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Quality Craftsmanship</h3>
            <p className="text-white/60">Each product crafted with attention to detail and premium materials</p>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-[#A67C52]/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#A67C52]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Constant Innovation</h3>
            <p className="text-white/60">Continuously expanding our product line with new designs</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-20 text-center"
      >
        <div className="bg-gradient-to-r from-[#A67C52]/20 to-[#A67C52]/5 rounded-xl p-8 border border-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-4">Explore Our Collection</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Discover our unique wooden creations and find the perfect piece to add to your collection.
          </p>
          <a 
            href="/shop" 
            className="inline-block px-8 py-3 bg-[#A67C52] text-white rounded-lg hover:bg-[#A67C52]/90 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </motion.div>
    </div>
  );
} 