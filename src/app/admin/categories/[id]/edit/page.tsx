'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { categoryService } from '@/services/categories';
import { toast } from 'sonner';

export default function EditCategory() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const category = await categoryService.getById(id as string);
        if (category) {
          setFormData({
            name: category.name,
            description: category.description || '',
            image_url: category.image_url || ''
          });
        }
      } catch (error) {
        console.error('Failed to load category:', error);
        toast.error('Failed to load category');
      }
    };

    loadCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.update(id as string, formData);
      toast.success('Category updated successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('Failed to update category');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
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
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#A67C52] text-white py-2 rounded-lg hover:bg-[#A67C52]/90"
        >
          Update Category
        </button>
      </form>
    </div>
  );
} 