import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Product = Database['products'];

export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variations:product_variations(*)
      `);
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variations:product_variations (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(productData: any) {
    const { variations, ...product } = productData;
    
    // Create the product
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (productError) throw productError;

    // Create variations if they exist
    if (variations && variations.length > 0) {
      const variationData = variations.map((v: any) => ({
        product_id: newProduct.id,
        name: v.name,
        stock: v.stock
      }));

      const { error: variationsError } = await supabase
        .from('product_variations')
        .insert(variationData);

      if (variationsError) throw variationsError;
    }

    return newProduct;
  },

  async update(id: string, productData: any) {
    const { variations, ...product } = productData;
    
    // Update the product
    const { data: updatedProduct, error: productError } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (productError) throw productError;

    // Delete existing variations
    const { error: deleteError } = await supabase
      .from('product_variations')
      .delete()
      .eq('product_id', id);

    if (deleteError) throw deleteError;

    // Create new variations if they exist
    if (variations && variations.length > 0) {
      const variationData = variations.map((v: any) => ({
        product_id: id,
        name: v.name,
        stock: v.stock
      }));

      const { error: variationsError } = await supabase
        .from('product_variations')
        .insert(variationData);

      if (variationsError) throw variationsError;
    }

    return updatedProduct;
  },

  async delete(id: string) {
    try {
      // First delete all variations to handle foreign key constraints
      const { error: varDeleteError } = await supabase
        .from('product_variations')
        .delete()
        .eq('product_id', id);
      
      if (varDeleteError) throw varDeleteError;
      
      // Then delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async getBySlug(slug: string) {
    console.log('getBySlug called with:', slug);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variations:product_variations(*)
        `)
        .eq('slug', slug)
        .single();
      
      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getBySlug:', error);
      throw error;
    }
  },

  generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  },

  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('slug')
        .limit(1);
      
      console.log('Test query result:', { data, error });
      return !error;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId);
    
    if (error) throw error;
    return data;
  },

  async updateStock(id: string, quantity: number) {
    const { data, error } = await supabase
      .rpc('update_product_stock', {
        p_id: id,
        p_quantity: quantity
      });

    if (error) throw error;
    return data;
  },

  async updateVariationStock(productId: string, variationName: string, quantity: number) {
    const { data, error } = await supabase
      .rpc('update_variation_stock', {
        p_product_id: productId,
        p_variation_name: variationName,
        p_quantity: quantity
      });

    if (error) throw error;
    return data;
  },

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        variations:product_variations(*)
      `)
      .eq('is_featured', true)
      .limit(8); // Limit to 8 products (4x2 grid)
    
    if (error) throw error;
    return data;
  }
}; 