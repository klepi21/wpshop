import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Order = Database['orders'];

export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getRecent(limit = 5) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getStats() {
    try {
      // Get all completed orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, wallet_address')
        .eq('status', 'completed');
      
      if (ordersError) throw ordersError;

      // Calculate total revenue from completed orders
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Count unique wallet addresses (customers)
      const uniqueCustomers = new Set(orders?.map(order => order.wallet_address));
      const totalCustomers = uniqueCustomers.size;

      return {
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalCustomers
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0
      };
    }
  },

  async create(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        full_name: orderData.full_name,
        email: orderData.email,
        shipping_address: orderData.shipping_address,
        city: orderData.city,
        postal_code: orderData.postal_code,
        country: orderData.country,
        customer_name: orderData.full_name,
        customer_email: orderData.email,
        status: orderData.status,
        total_amount: orderData.total_amount,
        shipping_method: orderData.shipping_method,
        wallet_address: orderData.wallet_address
      })
      .select()
      .single();

    if (error) throw error;

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: data.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      selected_size: item.selected_size
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return data;
  },

  async updateStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getOrdersByWallet(walletAddress: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateProductStock(orderId: string) {
    try {
      // Get order items with product info
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          order_items (
            quantity,
            product:products (
              id,
              stock
            )
          )
        `)
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;

      // Update stock for each product
      const updatePromises = order.order_items.map(async (item: any) => {
        const newStock = item.product.stock - item.quantity;
        const { error } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product.id);
        
        if (error) throw error;
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  },

  async updateTrackingNumber(orderId: string, trackingNumber: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}; 