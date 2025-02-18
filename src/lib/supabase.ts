import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  products: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    images: string[];
    category_id: string | null;
    created_at: string;
    updated_at: string;
    category?: {
      id: string;
      name: string;
      description: string | null;
      image: string | null;
      created_at: string;
      updated_at: string;
    };
    has_sizes: boolean;
  };
  categories: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
  };
  orders: {
    id: string;
    customer_name: string;
    customer_email: string;
    status: string;
    total_amount: number;
    created_at: string;
    updated_at: string;
    shipping_method: string;
    full_name: string;
    email: string;
    shipping_address: string;
    city: string;
    postal_code: string;
    country: string;
    wallet_address: string;
    tracking_number: string | null;
  };
  order_items: {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    created_at: string;
    selected_size: string | null;
  };
}; 