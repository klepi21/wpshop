'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Copy } from 'lucide-react';
import { ProductModal } from '@/components/admin/ProductModal';
import { productService } from '@/services/products';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          const errorMsg = error.message as string;
          if (errorMsg.includes('foreign key constraint') || errorMsg.includes('violates foreign key constraint')) {
            toast.error('This product cannot be deleted because it is part of existing orders');
          } else {
            toast.error('Failed to delete product');
          }
        } else {
          toast.error('Failed to delete product');
        }
      }
    }
  };

  const handleDuplicate = async (product: any) => {
    try {
      // Extract only the direct product fields, excluding joined data
      const { category, variations: existingVariations, ...productFields } = product;
      
      const newProduct = {
        ...productFields,
        id: undefined,
        name: `${product.name} (Copy)`,
        slug: productService.generateSlug(`${product.name} (Copy)`),
        created_at: undefined,
        updated_at: undefined,
        variations: existingVariations?.map((v: any) => ({
          name: v.name,
          stock: v.stock
        })) || []
      };
      
      await productService.create(newProduct);
      toast.success('Product duplicated successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to duplicate product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#A67C52]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#A67C52] text-white rounded-lg hover:bg-[#A67C52]/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-white/10 rounded-lg text-white placeholder-white/40"
          />
        </div>
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{product.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-white">${product.price}</p>
                </td>
                <td className="px-6 py-4">
                  <p className={`text-white ${product.stock < 10 ? 'text-red-500' : ''}`}>
                    {product.stock}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-white/60">{product.category?.name || 'Uncategorized'}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicate(product)}
                      className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5"
                      title="Duplicate product"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-white/60 hover:text-red-500 rounded-lg hover:bg-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onProductSaved={fetchProducts}
      />
    </div>
  );
} 