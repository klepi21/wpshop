'use client';

interface ProductFiltersProps {
  categories: any[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchTermChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Search</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C99733]"
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-left px-2 py-1 rounded-lg transition-colors ${
              !selectedCategory
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left px-2 py-1 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 