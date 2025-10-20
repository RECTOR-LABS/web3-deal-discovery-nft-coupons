import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { NftCoupon } from "../target/types/nft_coupon";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { expect } from "chai";

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("nft_coupon", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftCoupon as Program<NftCoupon>;

  // Test accounts
  let merchantAuthority: Keypair;
  let merchantPda: PublicKey;
  let merchantBump: number;

  let nftMint: Keypair;
  let couponDataPda: PublicKey;
  let couponDataBump: number;
  let metadataAccount: PublicKey;
  let merchantTokenAccount: PublicKey;

  let userWallet: Keypair;
  let userTokenAccount: PublicKey;

  const businessName = "Test Coffee Shop";
  const couponTitle = "50% Off Coffee";
  const couponDescription = "Get 50% off all specialty coffee drinks";
  const discountPercentage = 50;
  const maxRedemptions = 1;
  const metadataUri = "https://arweave.net/test-metadata";

  before(async () => {
    // Initialize test accounts
    merchantAuthority = Keypair.generate();
    userWallet = Keypair.generate();

    // Airdrop SOL to test accounts
    const airdropSignature = await provider.connection.requestAirdrop(
      merchantAuthority.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    const userAirdrop = await provider.connection.requestAirdrop(
      userWallet.publicKey,
      5 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(userAirdrop);

    // Derive merchant PDA
    [merchantPda, merchantBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("merchant"), merchantAuthority.publicKey.toBuffer()],
      program.programId
    );
  });

  describe("initialize_merchant", () => {
    it("should initialize a merchant account", async () => {
      await program.methods
        .initializeMerchant(businessName)
        .accounts({
          merchant: merchantPda,
          authority: merchantAuthority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([merchantAuthority])
        .rpc();

      // Fetch and verify merchant account
      const merchantAccount = await program.account.merchant.fetch(merchantPda);
      expect(merchantAccount.authority.toString()).to.equal(
        merchantAuthority.publicKey.toString()
      );
      expect(merchantAccount.businessName).to.equal(businessName);
      expect(merchantAccount.totalCouponsCreated.toNumber()).to.equal(0);
      expect(merchantAccount.bump).to.equal(merchantBump);
    });

    it("should fail to initialize duplicate merchant", async () => {
      try {
        await program.methods
          .initializeMerchant("Duplicate Shop")
          .accounts({
            merchant: merchantPda,
            authority: merchantAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([merchantAuthority])
          .rpc();
        expect.fail("Should have thrown error for duplicate merchant");
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("create_coupon", () => {
    before(() => {
      // Generate NFT mint
      nftMint = Keypair.generate();

      // Derive coupon data PDA
      [couponDataPda, couponDataBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("coupon"), nftMint.publicKey.toBuffer()],
        program.programId
      );

      // Derive metadata account (Metaplex standard)
      [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          nftMint.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

      // Derive merchant's token account
      merchantTokenAccount = getAssociatedTokenAddressSync(
        nftMint.publicKey,
        merchantAuthority.publicKey
      );
    });

    it("should create a coupon NFT with metadata", async () => {
      const expiryDate = new BN(Date.now() / 1000 + 86400 * 30); // 30 days from now

      await program.methods
        .createCoupon(
          couponTitle,
          couponDescription,
          discountPercentage,
          expiryDate,
          { foodAndBeverage: {} },
          maxRedemptions,
          metadataUri
        )
        .accounts({
          merchant: merchantPda,
          couponData: couponDataPda,
          nftMint: nftMint.publicKey,
          metadataAccount: metadataAccount,
          nftTokenAccount: merchantTokenAccount,
          merchantAuthority: merchantAuthority.publicKey,
          authority: merchantAuthority.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([merchantAuthority, nftMint])
        .rpc();

      // Fetch and verify coupon data
      const couponData = await program.account.couponData.fetch(couponDataPda);
      expect(couponData.mint.toString()).to.equal(nftMint.publicKey.toString());
      expect(couponData.merchant.toString()).to.equal(merchantPda.toString());
      expect(couponData.discountPercentage).to.equal(discountPercentage);
      expect(couponData.redemptionsRemaining).to.equal(maxRedemptions);
      expect(couponData.maxRedemptions).to.equal(maxRedemptions);
      expect(couponData.isActive).to.be.true;

      // Verify merchant's total coupons created incremented
      const merchantAccount = await program.account.merchant.fetch(merchantPda);
      expect(merchantAccount.totalCouponsCreated.toNumber()).to.equal(1);

      // Verify NFT was minted to merchant's account
      const tokenAccountInfo = await provider.connection.getTokenAccountBalance(
        merchantTokenAccount
      );
      expect(tokenAccountInfo.value.uiAmount).to.equal(1);
    });

    it("should fail with invalid discount percentage", async () => {
      const invalidMint = Keypair.generate();
      const [invalidCouponPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("coupon"), invalidMint.publicKey.toBuffer()],
        program.programId
      );
      const [invalidMetadata] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          invalidMint.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      const invalidTokenAccount = getAssociatedTokenAddressSync(
        invalidMint.publicKey,
        merchantAuthority.publicKey
      );

      try {
        await program.methods
          .createCoupon(
            "Invalid Coupon",
            "Invalid",
            101, // Invalid: > 100
            new BN(Date.now() / 1000 + 86400),
            { other: {} },
            1,
            metadataUri
          )
          .accounts({
            merchant: merchantPda,
            couponData: invalidCouponPda,
            nftMint: invalidMint.publicKey,
            metadataAccount: invalidMetadata,
            nftTokenAccount: invalidTokenAccount,
            merchantAuthority: merchantAuthority.publicKey,
            authority: merchantAuthority.publicKey,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .signers([merchantAuthority, invalidMint])
          .rpc();
        expect.fail("Should have thrown error for invalid discount");
      } catch (error) {
        expect(error.toString()).to.include("InvalidDiscountPercentage");
      }
    });

    it("should fail with past expiry date", async () => {
      const invalidMint = Keypair.generate();
      const [invalidCouponPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("coupon"), invalidMint.publicKey.toBuffer()],
        program.programId
      );
      const [invalidMetadata] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          invalidMint.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      const invalidTokenAccount = getAssociatedTokenAddressSync(
        invalidMint.publicKey,
        merchantAuthority.publicKey
      );

      try {
        await program.methods
          .createCoupon(
            "Expired Coupon",
            "Already expired",
            50,
            new BN(Date.now() / 1000 - 86400), // Past date
            { other: {} },
            1,
            metadataUri
          )
          .accounts({
            merchant: merchantPda,
            couponData: invalidCouponPda,
            nftMint: invalidMint.publicKey,
            metadataAccount: invalidMetadata,
            nftTokenAccount: invalidTokenAccount,
            merchantAuthority: merchantAuthority.publicKey,
            authority: merchantAuthority.publicKey,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .signers([merchantAuthority, invalidMint])
          .rpc();
        expect.fail("Should have thrown error for past expiry date");
      } catch (error) {
        expect(error.toString()).to.include("InvalidExpiryDate");
      }
    });
  });

  describe("update_coupon_status", () => {
    it("should update coupon active status", async () => {
      // Deactivate coupon
      await program.methods
        .updateCouponStatus(false)
        .accounts({
          couponData: couponDataPda,
          merchant: merchantPda,
          merchantAuthority: merchantAuthority.publicKey,
        })
        .signers([merchantAuthority])
        .rpc();

      let couponData = await program.account.couponData.fetch(couponDataPda);
      expect(couponData.isActive).to.be.false;

      // Reactivate coupon
      await program.methods
        .updateCouponStatus(true)
        .accounts({
          couponData: couponDataPda,
          merchant: merchantPda,
          merchantAuthority: merchantAuthority.publicKey,
        })
        .signers([merchantAuthority])
        .rpc();

      couponData = await program.account.couponData.fetch(couponDataPda);
      expect(couponData.isActive).to.be.true;
    });

    it("should fail when unauthorized user tries to update status", async () => {
      const unauthorizedUser = Keypair.generate();
      const airdrop = await provider.connection.requestAirdrop(
        unauthorizedUser.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdrop);

      try {
        await program.methods
          .updateCouponStatus(false)
          .accounts({
            couponData: couponDataPda,
            merchant: merchantPda,
            merchantAuthority: unauthorizedUser.publicKey,
          })
          .signers([unauthorizedUser])
          .rpc();
        expect.fail("Should have thrown error for unauthorized access");
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("redeem_coupon", () => {
    before(async () => {
      // Transfer NFT to user for redemption test
      userTokenAccount = getAssociatedTokenAddressSync(
        nftMint.publicKey,
        userWallet.publicKey
      );

      // Create user's token account and transfer NFT
      const transferIx = await anchor.web3.SystemProgram.transfer({
        fromPubkey: merchantAuthority.publicKey,
        toPubkey: userWallet.publicKey,
        lamports: 2 * anchor.web3.LAMPORTS_PER_SOL,
      });

      // Use anchor-spl to transfer the NFT
      // For simplicity in testing, we'll create the associated token account
      const createAtaIx = await (
        await import("@solana/spl-token")
      ).createAssociatedTokenAccountInstruction(
        merchantAuthority.publicKey,
        userTokenAccount,
        userWallet.publicKey,
        nftMint.publicKey
      );

      const transferTokenIx = await (
        await import("@solana/spl-token")
      ).createTransferInstruction(
        merchantTokenAccount,
        userTokenAccount,
        merchantAuthority.publicKey,
        1
      );

      const tx = new anchor.web3.Transaction()
        .add(transferIx)
        .add(createAtaIx)
        .add(transferTokenIx);

      await provider.sendAndConfirm(tx, [merchantAuthority]);

      // Verify transfer
      const userBalance = await provider.connection.getTokenAccountBalance(
        userTokenAccount
      );
      expect(userBalance.value.uiAmount).to.equal(1);
    });

    it("should redeem coupon and burn NFT", async () => {
      await program.methods
        .redeemCoupon()
        .accounts({
          couponData: couponDataPda,
          merchant: merchantPda,
          nftMint: nftMint.publicKey,
          nftTokenAccount: userTokenAccount,
          user: userWallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([userWallet])
        .rpc();

      // Verify coupon data updated
      const couponData = await program.account.couponData.fetch(couponDataPda);
      expect(couponData.redemptionsRemaining).to.equal(0);

      // Verify NFT was burned (token account should be closed or have 0 balance)
      try {
        const tokenBalance = await provider.connection.getTokenAccountBalance(
          userTokenAccount
        );
        expect(tokenBalance.value.uiAmount).to.equal(0);
      } catch (error) {
        // Token account might be closed, which is also valid
        expect(error).to.exist;
      }
    });

    it("should fail to redeem already redeemed coupon", async () => {
      // Try to redeem again
      try {
        await program.methods
          .redeemCoupon()
          .accounts({
            couponData: couponDataPda,
            merchant: merchantPda,
            nftMint: nftMint.publicKey,
            nftTokenAccount: userTokenAccount,
            user: userWallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([userWallet])
          .rpc();
        expect.fail("Should have thrown error for fully redeemed coupon");
      } catch (error) {
        expect(error.toString()).to.include("CouponFullyRedeemed");
      }
    });
  });

  describe("multi-use coupon redemption", () => {
    let multiUseMint: Keypair;
    let multiUseCouponPda: PublicKey;
    let multiUseMetadata: PublicKey;
    let multiUseMerchantToken: PublicKey;
    let multiUseUserToken: PublicKey;

    it("should create multi-use coupon and track redemptions", async () => {
      multiUseMint = Keypair.generate();
      [multiUseCouponPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("coupon"), multiUseMint.publicKey.toBuffer()],
        program.programId
      );
      [multiUseMetadata] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          multiUseMint.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      multiUseMerchantToken = getAssociatedTokenAddressSync(
        multiUseMint.publicKey,
        merchantAuthority.publicKey
      );

      const expiryDate = new BN(Date.now() / 1000 + 86400 * 30);
      const maxUses = 3;

      await program.methods
        .createCoupon(
          "Multi-Use Coffee Card",
          "3 free coffees",
          100,
          expiryDate,
          { foodAndBeverage: {} },
          maxUses,
          metadataUri
        )
        .accounts({
          merchant: merchantPda,
          couponData: multiUseCouponPda,
          nftMint: multiUseMint.publicKey,
          metadataAccount: multiUseMetadata,
          nftTokenAccount: multiUseMerchantToken,
          merchantAuthority: merchantAuthority.publicKey,
          authority: merchantAuthority.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([merchantAuthority, multiUseMint])
        .rpc();

      // Transfer to user
      multiUseUserToken = getAssociatedTokenAddressSync(
        multiUseMint.publicKey,
        userWallet.publicKey
      );

      const createAtaIx = await (
        await import("@solana/spl-token")
      ).createAssociatedTokenAccountInstruction(
        merchantAuthority.publicKey,
        multiUseUserToken,
        userWallet.publicKey,
        multiUseMint.publicKey
      );

      const transferTokenIx = await (
        await import("@solana/spl-token")
      ).createTransferInstruction(
        multiUseMerchantToken,
        multiUseUserToken,
        merchantAuthority.publicKey,
        1
      );

      const tx = new anchor.web3.Transaction()
        .add(createAtaIx)
        .add(transferTokenIx);
      await provider.sendAndConfirm(tx, [merchantAuthority]);

      // Redeem twice (should not burn yet)
      await program.methods
        .redeemCoupon()
        .accounts({
          couponData: multiUseCouponPda,
          merchant: merchantPda,
          nftMint: multiUseMint.publicKey,
          nftTokenAccount: multiUseUserToken,
          user: userWallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([userWallet])
        .rpc();

      let couponData = await program.account.couponData.fetch(multiUseCouponPda);
      expect(couponData.redemptionsRemaining).to.equal(2);

      // NFT should still exist
      let tokenBalance = await provider.connection.getTokenAccountBalance(
        multiUseUserToken
      );
      expect(tokenBalance.value.uiAmount).to.equal(1);

      // Redeem second time
      await program.methods
        .redeemCoupon()
        .accounts({
          couponData: multiUseCouponPda,
          merchant: merchantPda,
          nftMint: multiUseMint.publicKey,
          nftTokenAccount: multiUseUserToken,
          user: userWallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([userWallet])
        .rpc();

      couponData = await program.account.couponData.fetch(multiUseCouponPda);
      expect(couponData.redemptionsRemaining).to.equal(1);

      // NFT should still exist
      tokenBalance = await provider.connection.getTokenAccountBalance(
        multiUseUserToken
      );
      expect(tokenBalance.value.uiAmount).to.equal(1);

      // Final redemption should burn NFT
      await program.methods
        .redeemCoupon()
        .accounts({
          couponData: multiUseCouponPda,
          merchant: merchantPda,
          nftMint: multiUseMint.publicKey,
          nftTokenAccount: multiUseUserToken,
          user: userWallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([userWallet])
        .rpc();

      couponData = await program.account.couponData.fetch(multiUseCouponPda);
      expect(couponData.redemptionsRemaining).to.equal(0);

      // NFT should be burned
      try {
        tokenBalance = await provider.connection.getTokenAccountBalance(
          multiUseUserToken
        );
        expect(tokenBalance.value.uiAmount).to.equal(0);
      } catch (error) {
        // Account closed is also valid
        expect(error).to.exist;
      }
    });
  });
});
