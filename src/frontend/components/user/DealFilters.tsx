'use client';

import { Search } from 'lucide-react';
import CustomSelect from '@/components/shared/CustomSelect';

type SortOption = 'newest' | 'expiring-soon' | 'highest-discount' | 'nearest';
type CategoryOption = 'All' | 'Food & Beverage' | 'Retail' | 'Services' | 'Travel' | 'Entertainment' | 'Other';

interface DealFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryOption;
  onCategoryChange: (category: CategoryOption) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hasLocation?: boolean; // Epic 10 - Show "Nearest" option only if user has location
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
  hasLocation = false,
}: DealFiltersProps) {
  // Build sort options dynamically based on location availability
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'expiring-soon', label: 'Expiring Soon' },
    { value: 'highest-discount', label: 'Highest Discount' },
    ...(hasLocation ? [{ value: 'nearest', label: 'Nearest to Me 📍' }] : []),
  ];

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
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md cursor-pointer transition-all ${
                  selectedCategory === category
                    ? 'bg-[#00ff4d] text-[#0d2a13] shadow-[#00ff4d]/30'
                    : 'bg-white text-[#0d2a13] border-2 border-[#f3efcd] hover:border-[#00ff4d] hover:shadow-lg'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <CustomSelect
          label="Sort By"
          value={sortBy}
          onChange={(value) => onSortChange(value as SortOption)}
          options={sortOptions}
          className="md:w-64"
        />
      </div>
    </div>
  );
}
