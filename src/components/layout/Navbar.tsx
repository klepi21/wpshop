'use client'

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletButton } from '@/components/wallet/WalletButton';
import { Coins, Menu, X, Vote, ShoppingBag, Store } from 'lucide-react';
import { HyperText } from '../ui/hyper-text';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { WalletModal } from '../wallet/WalletModal';
import { HowToPlayModal } from '@/components/ui/how-to-play-modal';
import { cn } from '@/lib/utils';
import { NavBar as TubelightNavbar } from '@/components/ui/tubelight-navbar';
import Image from 'next/image';
import { TubelightNav } from '@/components/ui/tubelight-navbar';
import { CartDrawer } from '../shop/CartDrawer';
import { useCart } from '@/context/CartContext';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const { isLoggedIn } = useWallet();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
  ];

  const navItems: NavItem[] = [
    { name: 'Home', url: '/', icon: Coins },
    { name: 'Shop', url: '/shop', icon: Store },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <Image 
            src="/img/wdpunklogo.png" 
            alt="WoodenPunks Logo" 
            width={80} 
            height={80}
            className="h-[80px] w-[80px]"
          />
          <span className="text-xl font-bold text-[#A67C52]">
            WoodenPunks
          </span>
        </Link>

        {/* Center the menu */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <TubelightNav />
        </div>

        <div className="hidden md:flex md:items-center gap-4">
          
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white hover:text-[#A67C52]"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#A67C52] text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/5"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[60px] left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 p-4 space-y-4 shadow-xl md:hidden"
          >
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    pathname === item.url
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </div>
            ))}
            
            <div className="relative">
              <Link
                href="/orders"
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  pathname === '/orders'
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">My Orders</span>
              </Link>
            </div>

            <div className="px-4 pt-2 flex flex-col gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors w-full"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute top-2 right-4 bg-[#A67C52] text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
              <WalletButton className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to Play Modal */}
      <HowToPlayModal 
        isOpen={isHowToPlayOpen} 
        onClose={() => setIsHowToPlayOpen(false)} 
      />

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={false} 
        onClose={() => {}} 
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}