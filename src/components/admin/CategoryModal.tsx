'use client';

import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categoryService } from '@/services/categories';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
  onCategorySaved: () => void;
}

export function CategoryModal({ isOpen, onClose, category, onCategorySaved }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || ''
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (category) {
        await categoryService.update(category.id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(formData);
        toast.success('Category created successfully');
      }
      onCategorySaved();
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error('Failed to save category');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-6">
          {category ? 'Edit Category' : 'Create Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
            />
          </div>
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
              {category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 