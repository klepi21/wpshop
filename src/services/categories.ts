import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Category = Database['categories'];

export const categoryService = {
  async getAll() {
    // Fetch categories with a count of related products
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products:products(id)
      `);
    
    if (error) throw error;
    
    // Transform data to include product count
    return data.map((category: any) => ({
      ...category,
      products: category.products || []
    }));
  },

  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Create error:', error);
      throw error;
    }
    return data;
  },

  async update(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}; 