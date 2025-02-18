import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Product = Database['products'];

export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const {
      name,
      description,
      price,
      stock,
      images,
      category_id
    } = product;

    const createData = {
      name,
      description,
      price: typeof price === 'string' ? parseFloat(price) : price,
      stock: typeof stock === 'string' ? parseInt(stock) : stock,
      images: Array.isArray(images) ? images : [],
      category_id,
      slug: this.generateSlug(name)
    };

    const { data, error } = await supabase
      .from('products')
      .insert(createData)
      .select('*, category:categories(*)')
      .single();
    
    if (error) {
      console.error('Create error:', error);
      throw error;
    }
    return data;
  },

  async update(id: string, product: Partial<Product>) {
    console.log('Update called with:', { id, product }); // Debug log

    const updateData = {
      ...(product.name && { name: product.name }),
      ...(product.description !== undefined && { description: product.description }),
      ...(product.price !== undefined && { 
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price 
      }),
      ...(product.stock !== undefined && { 
        stock: typeof product.stock === 'string' ? parseInt(product.stock) : product.stock 
      }),
      ...(product.images && { images: product.images }),
      ...(product.category_id && { category_id: product.category_id }),
      has_sizes: product.has_sizes, // Make sure this is included without condition
      ...(product.name && { slug: this.generateSlug(product.name) }),
      updated_at: new Date().toISOString()
    };

    console.log('Final update data:', updateData); // Debug log

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();
    
    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getBySlug(slug: string) {
    console.log('getBySlug called with:', slug); // Debug log
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single();
      
      console.log('Supabase response:', { data, error }); // Debug log

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
  }
}; 