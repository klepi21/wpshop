'use client'

import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/img/wdpunklogo.png"
                alt="WoodenPunks Logo"
                width={50}
                height={50}
              />
              <h3 className="text-white font-bold text-lg">WoodenPunks</h3>
            </div>
            <p className="text-white/60 text-sm">
              Bridging Digital and Physical with Custom Creations
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/60 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/60 hover:text-white text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@woodenpunks.com" className="text-white/60 hover:text-white text-sm flex items-center gap-2">
                  <Mail size={16} />
                  contact@woodenpunks.com
                </a>
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Company Details</h3>
            <ul className="space-y-2">
              <li className="text-white/60 text-sm">WoodenPunks Limited</li>
              <li className="text-white/60 text-sm">Website: Woodenpunks.com</li>
              <li className="text-white/60 text-sm">US, Colorado Based</li>
            </ul>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/woodenpunks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.etsy.com/shop/woodenpunks/?etsrc=sdt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white flex items-center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.11 15.39c-.46.27-1.36.45-2.46.45-3.65 0-4.09-2.72-4.09-4.99V7.54H3.85v-2.3c2.73-.89 3.41-3.11 3.54-4.37h2.51v3.91h3.04v2.76H9.9v3.13c0 1.34.51 2.03 1.61 2.03.44 0 .93-.11 1.21-.23l.39 2.92z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © {currentYear} WoodenPunks Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 