'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  label,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={className} ref={dropdownRef}>
      {label && (
        <label className="block text-[#0d2a13] text-sm font-bold mb-3">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white text-[#0d2a13] rounded-xl border-2 border-[#f3efcd] focus:outline-none focus:ring-2 focus:ring-[#00ff4d] focus:border-[#00ff4d] font-medium shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
        >
          <span>{selectedOption?.label || 'Select...'}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#f3efcd] rounded-xl shadow-2xl overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left font-medium transition-colors cursor-pointer ${
                  option.value === value
                    ? 'bg-[#00ff4d] text-[#0d2a13] font-bold'
                    : 'text-[#0d2a13] hover:bg-[#f2eecb]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
