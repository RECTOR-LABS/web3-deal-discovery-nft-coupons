import { GET, HEAD } from '../health/route';
import { createClient } from '@supabase/supabase-js';
import { Connection } from '@solana/web3.js';

// Mock Supabase
jest.mock('@supabase/supabase-js');
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

// Mock Solana Connection
jest.mock('@solana/web3.js');
const mockConnection = Connection as jest.MockedClass<typeof Connection>;

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set required env vars
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    process.env.NEXT_PUBLIC_SOLANA_NETWORK = 'devnet';
    process.env.NEXT_PUBLIC_NFT_PROGRAM_ID = 'test-program-id';
    process.env.NEXT_PUBLIC_PRIVY_APP_ID = 'test-privy-id';
  });

  describe('GET /api/health', () => {
    it('should return 200 when all services are healthy', async () => {
      // Mock Supabase query success
      mockCreateClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              error: null,
              data: [],
            }),
          }),
        }),
      } as any);

      // Mock Solana RPC success
      mockConnection.prototype.getBlockHeight = jest.fn().mockResolvedValue(100000);

      const mockRequest = new Request('http://localhost:3000/api/health');
      const response = await GET(mockRequest as any);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.checks).toHaveProperty('database');
      expect(data.checks).toHaveProperty('solana_rpc');
      expect(data.checks).toHaveProperty('environment');
      expect(data.checks.database.status).toBe('healthy');
      expect(data.checks.solana_rpc.status).toBe('healthy');
    });

    it('should return 503 when database is unhealthy', async () => {
      // Mock Supabase query failure
      mockCreateClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              error: new Error('Connection failed'),
              data: null,
            }),
          }),
        }),
      } as any);

      // Mock Solana RPC success
      mockConnection.prototype.getBlockHeight = jest.fn().mockResolvedValue(100000);

      const mockRequest = new Request('http://localhost:3000/api/health');
      const response = await GET(mockRequest as any);

      expect(response.status).toBe(503);

      const data = await response.json();
      expect(data.status).toBe('unhealthy');
      expect(data.checks.database.status).toBe('unhealthy');
    });

    it('should return 503 when Solana RPC is unhealthy', async () => {
      // Mock Supabase query success
      mockCreateClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              error: null,
              data: [],
            }),
          }),
        }),
      } as any);

      // Mock Solana RPC failure
      mockConnection.prototype.getBlockHeight = jest.fn().mockRejectedValue(new Error('RPC timeout'));

      const mockRequest = new Request('http://localhost:3000/api/health');
      const response = await GET(mockRequest as any);

      expect(response.status).toBe(503);

      const data = await response.json();
      expect(data.status).toBe('unhealthy');
      expect(data.checks.solana_rpc.status).toBe('unhealthy');
    });

    it('should track latency for each check', async () => {
      // Mock services
      mockCreateClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              error: null,
              data: [],
            }),
          }),
        }),
      } as any);

      mockConnection.prototype.getBlockHeight = jest.fn().mockResolvedValue(100000);

      const mockRequest = new Request('http://localhost:3000/api/health');
      const response = await GET(mockRequest as any);

      const data = await response.json();
      expect(data.checks.database).toHaveProperty('latency');
      expect(data.checks.solana_rpc).toHaveProperty('latency');
      expect(typeof data.checks.database.latency).toBe('number');
      expect(typeof data.checks.solana_rpc.latency).toBe('number');
    });
  });

  describe('HEAD /api/health', () => {
    it('should return 200 with no body', async () => {
      const mockRequest = new Request('http://localhost:3000/api/health', {
        method: 'HEAD',
      });

      const response = await HEAD(mockRequest as any);

      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
    });
  });
});
