'use client';

import { MapPin, Navigation } from 'lucide-react';
import { DistanceFilterOption } from '@/lib/geolocation';

interface DistanceFilterProps {
  selectedDistance: number | null;
  onDistanceChange: (distance: number | null) => void;
  hasLocation: boolean;
  onRequestLocation: () => void;
}

const DISTANCE_OPTIONS: DistanceFilterOption[] = [
  { value: 1, label: '1 mile', unit: 'miles' },
  { value: 5, label: '5 miles', unit: 'miles' },
  { value: 10, label: '10 miles', unit: 'miles' },
  { value: 25, label: '25 miles', unit: 'miles' },
  { value: 50, label: '50 miles', unit: 'miles' },
];

export default function DistanceFilter({
  selectedDistance,
  onDistanceChange,
  hasLocation,
  onRequestLocation,
}: DistanceFilterProps) {
  if (!hasLocation) {
    return (
      <div className="bg-monke-cream/30 border-2 border-monke-border rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <MapPin size={20} className="text-monke-primary" />
          <h3 className="text-sm font-bold text-monke-primary">
            Location Access Required
          </h3>
        </div>
        <p className="text-xs text-monke-primary/70 mb-4">
          Enable location access to filter deals by distance from your current location.
        </p>
        <button
          onClick={onRequestLocation}
          className="w-full px-4 py-2 bg-monke-neon hover:bg-monke-neon/80 text-monke-primary font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <Navigation size={16} />
          <span>Enable Location</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-monke-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <MapPin size={20} className="text-monke-neon" />
        <h3 className="text-sm font-bold text-monke-primary">
          Distance Filter
        </h3>
      </div>

      <div className="space-y-2">
        {/* All Distances Option */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="distance"
            checked={selectedDistance === null}
            onChange={() => onDistanceChange(null)}
            className="w-4 h-4 text-monke-neon border-monke-border focus:ring-monke-neon focus:ring-2"
          />
          <span className="text-sm font-semibold text-monke-primary group-hover:text-monke-neon transition-colors">
            All Distances
          </span>
        </label>

        {/* Distance Options */}
        {DISTANCE_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="distance"
              checked={selectedDistance === option.value}
              onChange={() => onDistanceChange(option.value)}
              className="w-4 h-4 text-monke-neon border-monke-border focus:ring-monke-neon focus:ring-2"
            />
            <span className="text-sm font-medium text-monke-primary group-hover:text-monke-neon transition-colors">
              Within {option.label}
            </span>
          </label>
        ))}
      </div>

      {selectedDistance && (
        <div className="mt-4 p-3 bg-monke-neon/10 border border-monke-neon/30 rounded-lg">
          <p className="text-xs text-monke-primary/70 font-medium">
            Showing deals within <span className="font-bold text-monke-neon">{selectedDistance} miles</span> of your location
          </p>
        </div>
      )}
    </div>
  );
}
