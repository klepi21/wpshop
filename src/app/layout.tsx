'use client'

import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI/SignTransactionsModals';
import { mvxConfig } from '@/config/config';
import { Navbar } from '@/components/layout/Navbar';
import { WalletProvider } from '@/context/WalletContext';
import { WalletModal } from '@/components/wallet/WalletModal';
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { Comic_Neue } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { TokenProvider } from '@/context/TokenContext';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import { CartProvider } from '@/context/CartContext';

const comic = Comic_Neue({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

// Add Token type
interface Token {
  identifier: string;
  name: string;
  ticker: string;
  decimals: number;
  balance?: string;
  icon?: string;
}

// Add MxToken type
interface MxToken {
  identifier: string;
  name: string;
  ticker: string;
  decimals: number;
  price: number;
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
  };
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={comic.className} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Web3 dApp Template" />
        <title>WoodenPunks Limited</title>
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Web3 dApp Template" />
        <meta property="og:description" content="A modern Web3 dApp template with essential features" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Web3 dApp Template" />
        <meta name="twitter:description" content="A modern Web3 dApp template with essential features" />
        
        {/* Additional SEO */}
        <style>
          {`
            * {
              zoom: 99.5%;
            }
          `}
        </style>
      </head>
      <body className="bg-black">
        <ThemeProvider attribute="class" defaultTheme="light">
          <DappProvider
            environment="mainnet"
            dappConfig={{
              shouldUseWebViewProvider: true,
            }}
            customNetworkConfig={{
              name: 'customConfig',
              walletConnectV2ProjectId: mvxConfig.walletConnectV2ProjectId
            }}
          >
            <WalletProvider>
              <TokenProvider>
                <CartProvider>
                  <div className="relative min-h-screen">
                    {/* Optional pattern overlay */}
                    <div className="fixed inset-0 bg-black pointer-events-none" />
                    {/* Content */}
                    <div className="relative z-10 flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-1 pt-24">
                        {children}
                      </main>
                      <Footer />
                      <WalletModal 
                        isOpen={false}
                        onClose={() => {}}
                      />
                      <SignTransactionsModals />
                    </div>
                  </div>
                </CartProvider>
              </TokenProvider>
            </WalletProvider>
          </DappProvider>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}