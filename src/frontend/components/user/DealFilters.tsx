'use client';

import { Search } from 'lucide-react';

type SortOption = 'newest' | 'expiring-soon' | 'highest-discount';
type CategoryOption = 'All' | 'Food & Beverage' | 'Retail' | 'Services' | 'Travel' | 'Entertainment' | 'Other';

interface DealFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryOption;
  onCategoryChange: (category: CategoryOption) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const categories: CategoryOption[] = [
  'All',
  'Food & Beverage',
  'Retail',
  'Services',
  'Travel',
  'Entertainment',
  'Other',
];

export default function DealFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: DealFiltersProps) {
  return (
    <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#f3efcd] shadow-lg">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#174622] w-5 h-5" />
        <input
          type="text"
          placeholder="Search deals by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white text-[#0d2a13] rounded-xl border-2 border-[#f3efcd] focus:outline-none focus:ring-2 focus:ring-[#00ff4d] focus:border-[#00ff4d] placeholder-[#174622]/60 font-medium transition-all"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-[#0d2a13] text-sm font-bold mb-3">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  selectedCategory === category
                    ? 'bg-[#00ff4d] text-[#0d2a13] shadow-[#00ff4d]/30'
                    : 'bg-white text-[#0d2a13] border-2 border-[#f3efcd] hover:border-[#00ff4d]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="md:w-64">
          <label className="block text-[#0d2a13] text-sm font-bold mb-3">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-4 py-3 bg-white text-[#0d2a13] rounded-xl border-2 border-[#f3efcd] focus:outline-none focus:ring-2 focus:ring-[#00ff4d] focus:border-[#00ff4d] font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="expiring-soon">Expiring Soon</option>
            <option value="highest-discount">Highest Discount</option>
          </select>
        </div>
      </div>
    </div>
  );
}
