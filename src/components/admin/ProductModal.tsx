'use client';

import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '@/services/products';
import { categoryService } from '@/services/categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onProductSaved: () => void;
}

export function ProductModal({ isOpen, onClose, product, onProductSaved }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    images: [] as string[],
    has_sizes: false,
    is_featured: false,
    has_customization: false,
    variations: [] as { name: string; stock: number }[]
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (product) {
      // Make sure we explicitly cast has_sizes to boolean to avoid any issues
      const hasSizes = product.has_sizes === true;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category_id: product.category_id || '',
        images: product.images || [],
        has_sizes: hasSizes,
        is_featured: product.is_featured || false,
        has_customization: product.has_customization || false,
        variations: product.variations || []
      });
      
      console.log('Editing product with has_sizes:', hasSizes);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        images: [],
        has_sizes: false,
        is_featured: false,
        has_customization: false,
        variations: []
      });
    }
  }, [product]);

  useEffect(() => {
    loadCategories();
  }, []);

  // Add an effect to handle the has_sizes checkbox toggling
  useEffect(() => {
    if (formData.has_sizes && formData.variations.length === 0) {
      // If sizes are enabled but no variations exist yet, create an initial one
      setFormData(prev => ({
        ...prev,
        variations: [{ name: '', stock: parseInt(prev.stock) || 0 }]
      }));
    }
  }, [formData.has_sizes]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    }
  };

  // Generate a slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add slug to the form data
      const productDataWithSlug = {
        ...formData,
        slug: product?.slug || generateSlug(formData.name)
      };

      if (product) {
        await productService.update(product.id, productDataWithSlug);
        toast.success('Product updated successfully');
      } else {
        await productService.create(productDataWithSlug);
        toast.success('Product created successfully');
      }
      onProductSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
  };

  const addVariation = () => {
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, { name: '', stock: 0 }]
    }));
  };

  const removeVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const updateVariation = (index: number, field: 'name' | 'stock', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Create Product'}
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Category
            </label>
            <Select 
              value={formData.category_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                required={!formData.has_sizes}
                disabled={formData.has_sizes}
              />
              {formData.has_sizes && (
                <p className="text-xs text-white/60 mt-1">Stock is managed per variation when sizes are enabled</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
              rows={4}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Image URLs (one per line)
            </label>
            <textarea
              value={formData.images.join('\n')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                images: e.target.value.split('\n').filter(url => url.trim()) 
              }))}
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
              rows={3}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has_sizes"
                checked={formData.has_sizes}
                onChange={(e) => {
                  const hasVariations = e.target.checked;
                  setFormData(prev => {
                    const updatedData = { 
                      ...prev, 
                      has_sizes: hasVariations
                    };
                    
                    // When toggling off variations, make sure to restore stock value
                    if (!hasVariations && prev.variations.length > 0) {
                      // Calculate total stock from variations or use first variation's stock
                      const totalStock = prev.variations.reduce((sum, v) => sum + (v.stock || 0), 0);
                      updatedData.stock = totalStock.toString();
                    }
                    
                    return updatedData;
                  });
                }}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#A67C52] 
                  focus:ring-[#A67C52] focus:ring-offset-0"
              />
              <label htmlFor="has_sizes" className="text-sm text-white">
                Has Size Variations
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has_customization"
                checked={formData.has_customization}
                onChange={(e) => setFormData(prev => ({ ...prev, has_customization: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#A67C52] 
                  focus:ring-[#A67C52] focus:ring-offset-0"
              />
              <label htmlFor="has_customization" className="text-sm text-white">
                Allow Customization
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#A67C52] 
                  focus:ring-[#A67C52] focus:ring-offset-0"
              />
              <label htmlFor="is_featured" className="text-sm text-white">
                Featured Product
              </label>
            </div>
          </div>

          {/* Size Variations */}
          {formData.has_sizes && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Size Variations</h3>
                <button
                  type="button"
                  onClick={addVariation}
                  className="flex items-center gap-2 text-[#A67C52] hover:text-[#A67C52]/80"
                >
                  <Plus className="w-4 h-4" />
                  Add Variation
                </button>
              </div>
              <div className="space-y-3">
                {formData.variations.map((variation, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={variation.name}
                      onChange={(e) => updateVariation(index, 'name', e.target.value)}
                      placeholder="Size name (e.g., S, M, 23, 24)"
                      className="flex-1 px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="number"
                      value={variation.stock}
                      onChange={(e) => updateVariation(index, 'stock', parseInt(e.target.value))}
                      placeholder="Stock"
                      className="w-24 px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="p-2 text-white/60 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#A67C52] text-white rounded-lg hover:bg-[#A67C52]/90"
            >
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 