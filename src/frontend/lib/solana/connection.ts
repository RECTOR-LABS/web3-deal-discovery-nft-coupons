import { Connection, Commitment } from '@solana/web3.js';

/**
 * Solana RPC connection configuration
 */
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
const COMMITMENT: Commitment = 'confirmed';

/**
 * Get a Solana connection instance
 * Uses environment-configured RPC endpoint
 *
 * @returns Connection instance
 */
export function getConnection(): Connection {
  return new Connection(RPC_ENDPOINT, COMMITMENT);
}

/**
 * Get the current RPC endpoint URL
 * Useful for debugging or displaying to users
 *
 * @returns RPC endpoint URL
 */
export function getRpcEndpoint(): string {
  return RPC_ENDPOINT;
}

/**
 * Get the current network name (devnet, mainnet-beta, testnet)
 *
 * @returns Network name
 */
export function getNetwork(): string {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
}
