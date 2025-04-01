'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { TokenTransfer, Address, Transaction } from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';
import { useGetAccount, useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import { WalletButton } from '@/components/wallet/WalletButton';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useId } from "react";
import { orderService } from '@/services/orders';
import { Dialog } from '@headlessui/react';
import { CheckCircle2, Info } from 'lucide-react';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks/transactions/useTrackTransactionStatus';
import { TransactionModal } from '@/components/modals/TransactionModal';
import { CustomsInfoModal } from '@/components/shop/CustomsInfoModal';

interface ShippingDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface Token {
  identifier: string;
  name: string;
  ticker: string;
  price: number;
  decimals: number;
  assets?: {
    svgUrl?: string;
    pngUrl?: string;
  };
  imageUrl?: string;
}

const PAYMENT_TOKENS = [
  {
    identifier: 'EGLD',
    name: 'MultiversX eGold',
    ticker: 'EGLD',
    imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/6892.png'
  },
  {
    identifier: 'USDC-c76f1f',
    name: 'USD Coin',
    ticker: 'USDC',
    imageUrl: 'https://tools.multiversx.com/assets-cdn/tokens/USDC-c76f1f/icon.svg'
  }
];

// Product type shipping costs
const SHIPPING_COSTS = {
  SUNGLASSES: { USA: 13.50, INTERNATIONAL: 24.00 },
  KEYCHAINS: { USA: 10.00, INTERNATIONAL: 22.50 },
  HOODIES: { USA: 0.00, INTERNATIONAL: 0.00 }, // Free shipping
  COASTERS: { USA: 13.50, INTERNATIONAL: 24.00 },
  JEWELRY: { USA: 10.00, INTERNATIONAL: 22.50 }
};

// Special combination shipping costs
const COMBINED_SHIPPING_COSTS = {
  "SUNGLASSES+KEYCHAINS": { USA: 16.00, INTERNATIONAL: 45.00 },
  "SUNGLASSES+JEWELRY": { USA: 16.00, INTERNATIONAL: 45.00 },
  "JEWELRY+COASTERS": { USA: 16.00, INTERNATIONAL: 45.00 }
};

// Product categories to types mapping
const PRODUCT_TYPE_MAPPING = {
  'sunglasses': 'SUNGLASSES',
  'glasses': 'SUNGLASSES',
  'eyewear': 'SUNGLASSES',
  'keychain': 'KEYCHAINS',
  'keyring': 'KEYCHAINS',
  'key holder': 'KEYCHAINS',
  'hoodie': 'HOODIES',
  'sweatshirt': 'HOODIES',
  'apparel': 'HOODIES',
  'clothing': 'HOODIES',
  'coaster': 'COASTERS',
  'drink': 'COASTERS',
  'cup holder': 'COASTERS',
  'jewelry': 'JEWELRY',
  'necklace': 'JEWELRY',
  'bracelet': 'JEWELRY',
  'earring': 'JEWELRY'
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const { address } = useGetAccount();
  const { account } = useGetAccountInfo();
  const [shippingMethod, setShippingMethod] = useState<'simple' | 'fast'>('simple');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
  const [isCustomsModalOpen, setIsCustomsModalOpen] = useState(false);
  const [isUSA, setIsUSA] = useState(true);
  const [shippingCost, setShippingCost] = useState(0);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  const { isPending, isSuccessful, isFailed, status } = useTrackTransactionStatus({
    transactionId: currentTxHash,
    onSuccess: async () => {
      console.log('Transaction successful, orderId:', orderId);
      if (orderId) {
        try {
          console.log('Updating order status...');
          await orderService.updateStatus(orderId, 'completed');
          await orderService.updateProductStock(orderId);
          console.log('Order status updated');
          setTransactionStatus('success');
          
          console.log('Redirecting to receipt page...');
          window.location.href = `/receipt/${orderId}`;
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }
    },
    onFail: async () => {
      if (orderId) {
        try {
          await orderService.updateStatus(orderId, 'cancelled');
          setTransactionStatus('failed');
          toast.error('Transaction failed');
        } catch (error) {
          console.error('Error updating order status:', error);
        }
      }
    }
  });

  useEffect(() => {
    if (items.length === 0 && !currentTxHash) {
      router.push('/shop');
    }
  }, [items, router, currentTxHash]);

  // Fetch token data
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // First get EGLD price
        const egldResponse = await fetch('https://api.multiversx.com/economics');
        const egldData = await egldResponse.json();

        // Get token prices from API - only USDC now
        const response = await fetch('https://api.multiversx.com/tokens?identifiers=USDC-c76f1f');
        const tokenData = await response.json();

        // Create a map of token data
        const tokenDataMap = tokenData.reduce((acc: any, token: any) => {
          acc[token.identifier] = {
            price: token.price,
            decimals: token.decimals
          };
          return acc;
        }, {});

        // Map our predefined tokens with their prices
        const mergedTokens = PAYMENT_TOKENS.map(token => {
          if (token.identifier === 'EGLD') {
            return {
              ...token,
              price: egldData.price,
              decimals: 18
            };
          }
          return {
            ...token,
            price: tokenDataMap[token.identifier]?.price || 0,
            decimals: tokenDataMap[token.identifier]?.decimals || 6
          };
        });

        console.log('Token prices:', mergedTokens.map(t => ({ 
          ticker: t.ticker, 
          price: t.price 
        })));

        setTokens(mergedTokens);
        setSelectedToken(mergedTokens[0]); // Set EGLD as default
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        toast.error('Failed to load payment options');
      } finally {
        setIsLoadingTokens(false);
      }
    };

    fetchTokens();
  }, []);

  // Determine product types and calculate shipping
  useEffect(() => {
    // Extract product types from items in cart
    const types: string[] = [];
    
    items.forEach(item => {
      // Try to determine product type from name
      let foundType = '';
      
      // Check name for keywords
      const nameLower = item.name.toLowerCase();
      
      Object.entries(PRODUCT_TYPE_MAPPING).forEach(([keyword, typeName]) => {
        if (nameLower.includes(keyword)) {
          foundType = typeName;
          console.log(`Found type "${typeName}" for item "${item.name}" based on keyword "${keyword}"`);
        }
      });
      
      // If we couldn't determine the type, check for additional category-specific keywords
      if (!foundType) {
        // Check for jewelry-specific terms
        const jewelryTerms = ['ring', 'pendant', 'silver', 'gold', 'necklace', 'bracelet', 'earring', 'jewelry'];
        for (const term of jewelryTerms) {
          if (nameLower.includes(term)) {
            foundType = 'JEWELRY';
            console.log(`Found JEWELRY type for item "${item.name}" based on term "${term}"`);
            break;
          }
        }
      }
      
      // If we still couldn't determine the type, use SUNGLASSES as default (highest shipping cost)
      if (!foundType) {
        foundType = 'SUNGLASSES';
        console.log(`Couldn't determine type for "${item.name}", using default: SUNGLASSES`);
      }
      
      // If we found a type and it's not already in our list, add it
      if (foundType && !types.includes(foundType)) {
        types.push(foundType);
      }
    });
    
    console.log('Detected product types:', types);
    setProductTypes(types);
    
    // Update shipping cost whenever product types or country changes
    calculateShippingCost(types);
  }, [items, isUSA]);
  
  // Calculate shipping cost based on product types and country
  const calculateShippingCost = (types: string[]) => {
    if (types.length === 0) {
      setShippingCost(0);
      return;
    }
    
    // Check for special combinations first
    if (types.length >= 2) {
      // Sort types for consistent keys regardless of order
      const uniqueTypes = [...new Set(types)].sort();
      
      // Check for specific combinations
      if (uniqueTypes.includes('SUNGLASSES') && uniqueTypes.includes('KEYCHAINS')) {
        const combinationCost = COMBINED_SHIPPING_COSTS["SUNGLASSES+KEYCHAINS"];
        const cost = isUSA ? combinationCost.USA : combinationCost.INTERNATIONAL;
        console.log('Using combination shipping (SUNGLASSES+KEYCHAINS):', cost);
        setShippingCost(cost);
        return;
      }
      
      if (uniqueTypes.includes('SUNGLASSES') && uniqueTypes.includes('JEWELRY')) {
        const combinationCost = COMBINED_SHIPPING_COSTS["SUNGLASSES+JEWELRY"];
        const cost = isUSA ? combinationCost.USA : combinationCost.INTERNATIONAL;
        console.log('Using combination shipping (SUNGLASSES+JEWELRY):', cost);
        setShippingCost(cost);
        return;
      }
      
      if (uniqueTypes.includes('JEWELRY') && uniqueTypes.includes('COASTERS')) {
        const combinationCost = COMBINED_SHIPPING_COSTS["JEWELRY+COASTERS"];
        const cost = isUSA ? combinationCost.USA : combinationCost.INTERNATIONAL;
        console.log('Using combination shipping (JEWELRY+COASTERS):', cost);
        setShippingCost(cost);
        return;
      }
    }
    
    // If no special combination matches, use the standard approach (highest cost)
    const costs = types.map(type => {
      const costObj = SHIPPING_COSTS[type as keyof typeof SHIPPING_COSTS];
      if (!costObj) return 0;
      
      return isUSA ? costObj.USA : costObj.INTERNATIONAL;
    });
    
    // Use the highest shipping cost
    const highestCost = Math.max(...costs);
    console.log('Standard shipping costs by type:', costs, 'Highest cost:', highestCost);
    setShippingCost(highestCost);
  };

  // Calculate token amount based on USD total
  const getTokenAmount = (token: Token) => {
    if (!token.price || token.price <= 0) return '0';
    
    // Calculate the base amount in USD using total with shipping
    const amount = new BigNumber(getTotalWithShipping())
      .dividedBy(token.price)
      .decimalPlaces(2);

    
    return amount.toString();
  };

  const getTotalWithShipping = () => {
    return total + shippingCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    try {
      // Create the order first without items
      const orderData = {
        full_name: shippingDetails.name,
        email: shippingDetails.email,
        shipping_address: shippingDetails.address,
        city: shippingDetails.city,
        postal_code: shippingDetails.postalCode,
        country: shippingDetails.country,
        customer_name: shippingDetails.name,
        customer_email: shippingDetails.email,
        status: 'pending',
        total_amount: getTotalWithShipping(),
        shipping_method: shippingMethod,
        wallet_address: address,
        shipping_cost: shippingCost,
      };

      // Create the order
      const order = await orderService.create(orderData);
      
      // Then create order items
      const orderItemsData = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        selected_size: item.variation || null,
        customization: item.customization || null
      }));

      // Create order items
      await orderService.createOrderItems(orderItemsData);

      setOrderId(order.id);

      const tokenAmount = getTokenAmount(selectedToken);
      const chainId = await getChainID();

      // Convert to base denomination based on token decimals
      let baseAmount;
      if (selectedToken.identifier === 'USDC-c76f1f') {
        // USDC: 6 decimals
        baseAmount = Math.floor(Number(tokenAmount) * Math.pow(10, 6));
      } else {
        // EGLD: 18 decimals
        baseAmount = new BigNumber(tokenAmount)
          .multipliedBy('1000000000000000000')
          .toString();
      }

      // Convert to hex without 0x prefix
      const amountHex = baseAmount.toString(16).toUpperCase();

      console.log('Token details:', {
        token: selectedToken.ticker,
        humanReadableAmount: tokenAmount,
        baseAmount,
        amountHex
      });

      let transaction;
      if (selectedToken.identifier === 'EGLD') {
        transaction = {
          value: baseAmount.toString(),
          data: `order#${order.id}`, // Plain text order ID
          receiver: process.env.NEXT_PUBLIC_MERCHANT_ADDRESS,
          gasLimit: 60000000,
          chainID: chainId,
          version: 1
        };
      } else {
        // For ESDT transfers, we still need to encode the token identifier as hex
        const data = `ESDTTransfer@${Buffer.from(selectedToken.identifier).toString('hex')}@${amountHex}@order#${order.id}`;
        
        transaction = {
          value: '0',
          data: data,
          receiver: process.env.NEXT_PUBLIC_MERCHANT_ADDRESS,
          gasLimit: 60000000,
          chainID: chainId,
          version: 1
        };
      }

      console.log('Transaction details:', transaction);

      const { sessionId, error } = await sendTransactions({
        transactions: [transaction],
        transactionsDisplayInfo: {
          processingMessage: 'Processing payment',
          errorMessage: 'Payment failed',
          successMessage: 'Payment successful'
        },
        redirectAfterSign: false
      });

      if (error) {
        throw error;
      }

      setShowTransactionModal(true);
      setCurrentTxHash(sessionId);
      setTransactionStatus('pending');
      
    } catch (error) {
      console.error('Payment failed:', error);
      if (orderId) {
        await orderService.updateStatus(orderId, 'cancelled');
      }
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a useEffect to monitor transaction status changes
  useEffect(() => {
    console.log('Transaction status changed:', status);
    console.log('Current orderId:', orderId);
  }, [status, orderId]);

  // Return null while redirecting
  if (items.length === 0) {
    return null;
  }

  // Return loading state while checking wallet
  if (!address) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Connect Wallet</h1>
          <p className="text-white/60 mb-8">Please connect your wallet to proceed with checkout</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
          <button
            onClick={() => setIsCustomsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white bg-zinc-900/50 border border-white/10 rounded-lg transition-colors hover:border-white/20"
          >
            <Info size={16} />
            Customs & VAT Information
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing & Delivery Information Form */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Billing & Delivery Information</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }} 
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                    text-white placeholder-white/50 focus:outline-none focus:ring-2 
                    focus:ring-[#A67C52] focus:border-transparent
                    hover:bg-white/[0.15] transition-colors"
                  placeholder="Enter your full name"
                  value={shippingDetails.name}
                  onChange={(e) => setShippingDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                    text-white placeholder-white/50 focus:outline-none focus:ring-2 
                    focus:ring-[#A67C52] focus:border-transparent
                    hover:bg-white/[0.15] transition-colors"
                  placeholder="Enter your email"
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                    text-white placeholder-white/50 focus:outline-none focus:ring-2 
                    focus:ring-[#A67C52] focus:border-transparent
                    hover:bg-white/[0.15] transition-colors resize-none"
                  placeholder="Enter your shipping address"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-white mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                      text-white placeholder-white/50 focus:outline-none focus:ring-2 
                      focus:ring-[#A67C52] focus:border-transparent
                      hover:bg-white/[0.15] transition-colors"
                    placeholder="Enter your city"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-white mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                      text-white placeholder-white/50 focus:outline-none focus:ring-2 
                      focus:ring-[#A67C52] focus:border-transparent
                      hover:bg-white/[0.15] transition-colors"
                    placeholder="Enter postal code"
                    value={shippingDetails.postalCode}
                    onChange={(e) => setShippingDetails(prev => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-white mb-1">
                  Country
                </label>
                <div className="relative">
                  <Select 
                    value={isUSA ? "usa" : "international"}
                    onValueChange={(value: string) => {
                      setIsUSA(value === "usa");
                      setShippingDetails(prev => ({
                        ...prev,
                        country: value === "usa" ? "United States" : prev.country
                      }))
                    }}
                  >
                    <SelectTrigger className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                      text-white focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent
                      hover:bg-white/[0.15] transition-colors">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                  {!isUSA && (
                    <input
                      type="text"
                      id="country"
                      required
                      className="mt-2 w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                        text-white placeholder-white/50 focus:outline-none focus:ring-2 
                        focus:ring-[#A67C52] focus:border-transparent
                        hover:bg-white/[0.15] transition-colors"
                      placeholder="Enter your country"
                      value={shippingDetails.country}
                      onChange={(e) => setShippingDetails(prev => ({ ...prev, country: e.target.value }))}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Select Payment Token
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {tokens.map((token) => (
                    <button
                      key={token.identifier}
                      type="button"
                      onClick={() => setSelectedToken(token)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors
                        ${selectedToken?.identifier === token.identifier 
                          ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                          : 'border-white/10 hover:border-[#A67C52]/50 text-white'}`}
                    >
                      <Image
                        src={token.imageUrl || token.assets?.svgUrl || token.assets?.pngUrl || ''}
                        alt={token.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="font-medium">{token.ticker}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !selectedToken}
                className="w-full py-3 bg-[#A67C52] text-white font-medium rounded-xl 
                  hover:bg-[#A67C52]/90 transition-colors disabled:opacity-50 mt-4"
              >
                {isProcessing ? 'Processing...' : `Pay with ${selectedToken?.ticker || ''}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-white/10 last:border-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      {item.variation && (
                        <p className="text-white/60 text-sm">Size: {item.variation}</p>
                      )}
                      {item.customization && (
                        <p className="text-white/60 text-sm mt-1">
                          <span className="font-medium">Customization:</span> {item.customization}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                        <p className="text-[#A67C52] font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Shipping Method Selection */}
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-4">Shipping Information</h3>
                  <div className="rounded-lg border border-white/10 p-4 shadow-sm shadow-black/5">
                    <div className="flex justify-between mb-2">
                      <span className="text-white">Location:</span>
                      <span className="text-white font-medium">{isUSA ? 'United States' : 'International'}</span>
                    </div>
                    
                    {productTypes.length > 0 && (
                      <>
                        <div className="text-xs text-white/60 my-2">
                          Your order contains:
                          <ul className="mt-1 ml-4 list-disc">
                            {productTypes.map(type => (
                              <li key={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
                          <span className="text-white">Shipping Cost:</span>
                          <span className="text-[#A67C52] font-medium">
                            {shippingCost === 0 
                              ? 'FREE' 
                              : `$${shippingCost.toFixed(2)}`
                            }
                          </span>
                        </div>
                        
                        <p className="text-xs text-white/60 mt-2">
                          {shippingCost === 0 
                            ? 'Free shipping for your products.'
                            : `Standard delivery within 5-10 business days.`
                          }
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {selectedToken && (
                  <div className="mt-4 space-y-2">
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60">Subtotal:</span>
                        <span className="text-white/60">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60">Shipping:</span>
                        <span className="text-white/60">
                          {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-white">Order Total:</span>
                        <span className="text-xl font-bold text-white">
                          ${getTotalWithShipping().toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-white/60 mt-3">
                        Estimated price in {selectedToken.ticker}:
                      </div>
                      <div className="text-lg font-medium text-[#A67C52]">
                        {getTokenAmount(selectedToken)} {selectedToken.ticker}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TransactionModal 
        isOpen={showTransactionModal}
        status={transactionStatus}
      />
      <CustomsInfoModal
        isOpen={isCustomsModalOpen}
        onClose={() => setIsCustomsModalOpen(false)}
      />
    </div>
  );
} 