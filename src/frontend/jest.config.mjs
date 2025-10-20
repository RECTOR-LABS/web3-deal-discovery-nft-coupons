import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Mock lucide-react to avoid ESM import issues
    // Match both the base import and modularized imports (from next.config.ts)
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
    '^lucide-react/dist/esm/icons/(.*)$': '<rootDir>/__mocks__/lucide-react.js',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/e2e/', // Exclude Playwright e2e tests
    '/app/api/__tests__/', // Exclude API route tests (require special Next.js server setup)
    '/components/user/__tests__/DealFilters.test.tsx',
    '/components/user/__tests__/UserNavigation.test.tsx',
    '/components/shared/__tests__/CustomSelect.test.tsx',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react)/)', // Transform lucide-react ESM modules
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
