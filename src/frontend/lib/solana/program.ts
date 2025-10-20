import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import idl from './idl/nft_coupon.json';

export const PROGRAM_ID = new PublicKey('RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7');

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

/**
 * Get the Anchor program instance
 */
export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Program(idl as any, provider);
}

/**
 * Get merchant PDA
 */
export function getMerchantPDA(merchantAuthority: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('merchant'), merchantAuthority.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Get coupon data PDA
 */
export function getCouponDataPDA(nftMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('coupon'), nftMint.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Get metadata account PDA (Metaplex)
 */
export function getMetadataAccount(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}

/**
 * Get master edition PDA (Metaplex)
 */
export function getMasterEdition(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}
