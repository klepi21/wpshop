'use client';

import { BookOpen, Package, LayoutDashboard, ShoppingCart, FolderTree, Settings } from 'lucide-react';

export default function AdminDocumentationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-8 h-8 text-[#A67C52]" />
        <h1 className="text-3xl font-bold text-white">Admin Documentation</h1>
      </div>

      <div className="space-y-8">
        {/* Getting Started */}
        <section className="bg-zinc-950 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#A67C52]" />
            Getting Started
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60">
              Welcome to the WoodenPunks Admin Panel. This documentation will guide you through all the features and functionalities available to manage your e-commerce platform.
            </p>
            <h3 className="text-white mt-4">First Steps</h3>
            <ol className="list-decimal pl-4 text-white/60 space-y-2">
              <li>Log in using your admin credentials</li>
              <li>Familiarize yourself with the dashboard metrics</li>
              <li>Set up your product categories</li>
              <li>Add your first products</li>
            </ol>
          </div>
        </section>

        {/* Dashboard */}
        <section className="bg-zinc-950 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#A67C52]" />
            Dashboard Overview
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60">
              The dashboard provides key metrics and insights about your store:
            </p>
            <ul className="list-disc pl-4 text-white/60 space-y-2">
              <li>Total Orders: Number of orders received</li>
              <li>Total Revenue: Total earnings from completed orders</li>
              <li>Total Customers: Unique customers based on wallet addresses</li>
              <li>Average Order Value: Average spending per order</li>
              <li>Recent Orders: Quick view of the latest orders</li>
            </ul>
          </div>
        </section>

        {/* Managing Products */}
        <section className="bg-zinc-950 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#A67C52]" />
            Managing Products
          </h2>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-white">Adding a New Product</h3>
            <ol className="list-decimal pl-4 text-white/60 space-y-2">
              <li>Navigate to Products in the sidebar</li>
              <li>Click "Add New Product"</li>
              <li>Fill in the required fields:
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Name: Product title</li>
                  <li>Description: Detailed product description</li>
                  <li>Price: In USD</li>
                  <li>Stock: Available quantity</li>
                  <li>Images: Upload product images (recommended size: 800x800px)</li>
                  <li>Category: Select or create a category</li>
                </ul>
              </li>
              <li>Click "Save" to publish the product</li>
            </ol>
          </div>
        </section>

        {/* Managing Categories */}
        <section className="bg-zinc-950 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#A67C52]" />
            Managing Categories
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60">
              Categories help organize your products for better navigation:
            </p>
            <ol className="list-decimal pl-4 text-white/60 space-y-2">
              <li>Go to Categories in the sidebar</li>
              <li>Click "Add New Category"</li>
              <li>Provide:
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Category Name</li>
                  <li>Description (optional)</li>
                  <li>Category Image (optional)</li>
                </ul>
              </li>
              <li>Save to create the category</li>
            </ol>
          </div>
        </section>

        {/* Managing Orders */}
        <section className="bg-zinc-950 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#A67C52]" />
            Managing Orders
          </h2>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-white">Order Management</h3>
            <p className="text-white/60">
              The Orders page allows you to:
            </p>
            <ul className="list-disc pl-4 text-white/60 space-y-2">
              <li>View all orders and their details</li>
              <li>Update order status:
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Pending: Initial state</li>
                  <li>Processing: Order confirmed and being prepared</li>
                  <li>Completed: Order fulfilled and shipped</li>
                  <li>Cancelled: Order cancelled</li>
                </ul>
              </li>
              <li>Add tracking numbers for shipped orders</li>
              <li>View customer information and wallet addresses</li>
              <li>Search and filter orders</li>
            </ul>

            <h3 className="text-white mt-4">Adding Tracking Numbers</h3>
            <ol className="list-decimal pl-4 text-white/60 space-y-2">
              <li>Find the order in the orders list</li>
              <li>Click "Edit" next to Tracking Number</li>
              <li>Enter the tracking number</li>
              <li>Save changes</li>
            </ol>
          </div>
        </section>

        {/* Best Practices */}
        <section className="bg-zinc-950 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#A67C52]" />
            Best Practices
          </h2>
          <div className="prose prose-invert max-w-none">
            <ul className="list-disc pl-4 text-white/60 space-y-2">
              <li>Regularly check and update product stock levels</li>
              <li>Process orders promptly and update their status</li>
              <li>Add tracking numbers as soon as orders are shipped</li>
              <li>Keep product information and images up to date</li>
              <li>Monitor the dashboard for business insights</li>
              <li>Respond to customer inquiries quickly</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 