// Mock for lucide-react to avoid ESM import issues in Jest
// All lucide-react icons are mocked as simple SVG components

const React = require('react');

const createMockIcon = (name) => {
  function MockIcon(props) {
    return React.createElement('svg', {
      'data-testid': `icon-${name.toLowerCase()}`,
      ...props,
    });
  }
  MockIcon.displayName = name;
  return MockIcon;
};

const icons = {
  // Commonly used icons in the project
  Search: createMockIcon('Search'),
  ChevronDown: createMockIcon('ChevronDown'),
  Filter: createMockIcon('Filter'),
  MapPin: createMockIcon('MapPin'),
  Calendar: createMockIcon('Calendar'),
  Tag: createMockIcon('Tag'),
  TrendingUp: createMockIcon('TrendingUp'),
  X: createMockIcon('X'),
  Check: createMockIcon('Check'),
  AlertCircle: createMockIcon('AlertCircle'),
  Loader2: createMockIcon('Loader2'),
  Home: createMockIcon('Home'),
  Package: createMockIcon('Package'),
  Heart: createMockIcon('Heart'),
  User: createMockIcon('User'),
  Settings: createMockIcon('Settings'),
  LogOut: createMockIcon('LogOut'),
  Menu: createMockIcon('Menu'),
  Star: createMockIcon('Star'),
  Share2: createMockIcon('Share2'),
  Copy: createMockIcon('Copy'),
  ExternalLink: createMockIcon('ExternalLink'),
  ChevronRight: createMockIcon('ChevronRight'),
  ChevronLeft: createMockIcon('ChevronLeft'),
  Plus: createMockIcon('Plus'),
  Minus: createMockIcon('Minus'),
  Edit: createMockIcon('Edit'),
  Trash2: createMockIcon('Trash2'),
  Info: createMockIcon('Info'),
  Clock: createMockIcon('Clock'),
  DollarSign: createMockIcon('DollarSign'),
  Percent: createMockIcon('Percent'),
  Eye: createMockIcon('Eye'),
  EyeOff: createMockIcon('EyeOff'),
};

// Export named exports for `import { Icon } from 'lucide-react'`
module.exports = icons;

// Export default for modularized imports `import Icon from 'lucide-react/dist/esm/icons/Icon'`
// This will return a generic icon for any modularized import
module.exports.default = createMockIcon('Icon');
