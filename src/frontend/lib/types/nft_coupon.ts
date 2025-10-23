/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/nft_coupon.json`.
 */
export type NftCoupon = {
  "address": "RECcAGSNVfAdGeTsR92jMUM2DBuedSqpAn9W8pNrLi7",
  "metadata": {
    "name": "nftCoupon",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimCoupon",
      "docs": [
        "Claim a free coupon (price = 0)",
        "Transfers NFT from Escrow PDA to user",
        "Magic Eden style: Program-controlled transfer, no backend signature"
      ],
      "discriminator": [
        210,
        153,
        241,
        46,
        195,
        18,
        161,
        99
      ],
      "accounts": [
        {
          "name": "couponData",
          "docs": [
            "Coupon data account (PDA derived from NFT mint address)",
            "Validates:",
            "- Coupon is active",
            "- Coupon is free (price = 0)",
            "- Not expired"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  112,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "merchant",
          "docs": [
            "Merchant account (PDA derived from merchant authority)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant.authority",
                "account": "merchant"
              }
            ]
          },
          "relations": [
            "couponData"
          ]
        },
        {
          "name": "nftEscrow",
          "docs": [
            "NFT Escrow PDA - holds NFTs minted by create_coupon",
            "Seeds: [\"nft_escrow\", merchant_pda, nft_mint]",
            "Authority: The PDA itself (self-custodial)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116,
                  95,
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "merchant"
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "docs": [
            "NFT mint account"
          ]
        },
        {
          "name": "userTokenAccount",
          "docs": [
            "User's associated token account (created if not exists)",
            "This is where the NFT will be transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "user",
          "docs": [
            "User claiming the coupon (pays for token account creation if needed)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createCoupon",
      "docs": [
        "Create a new NFT coupon",
        "Mints an NFT with Metaplex metadata and creates coupon data",
        "NFT is minted to Escrow PDA (program-controlled)"
      ],
      "discriminator": [
        29,
        170,
        159,
        88,
        211,
        20,
        13,
        56
      ],
      "accounts": [
        {
          "name": "merchant",
          "docs": [
            "Merchant account (PDA derived from merchant authority)",
            "Seeds: [\"merchant\", merchant_authority_pubkey]",
            "Validates that the merchant authority owns this merchant account"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchantAuthority"
              }
            ]
          }
        },
        {
          "name": "couponData",
          "docs": [
            "Coupon data account (PDA derived from NFT mint address)",
            "Seeds: [\"coupon\", nft_mint_pubkey]",
            "Stores discount %, expiry date, category, redemption tracking, price"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  112,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftEscrow",
          "docs": [
            "NFT Escrow PDA - holds NFTs after minting (program-controlled)",
            "Seeds: [\"nft_escrow\", merchant_pda, nft_mint]",
            "Authority: The PDA itself (self-custodial)",
            "This is where the NFT will be minted and stored until claimed/purchased"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116,
                  95,
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "merchant"
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "docs": [
            "NFT mint account"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "metadataAccount",
          "writable": true
        },
        {
          "name": "masterEdition",
          "writable": true
        },
        {
          "name": "merchantAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "relations": [
            "merchant"
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "sysvarInstructions",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "discountPercentage",
          "type": "u8"
        },
        {
          "name": "expiryDate",
          "type": "i64"
        },
        {
          "name": "category",
          "type": {
            "defined": {
              "name": "couponCategory"
            }
          }
        },
        {
          "name": "maxRedemptions",
          "type": "u8"
        },
        {
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeMerchant",
      "docs": [
        "Initialize a merchant account",
        "Merchants must register before creating coupons"
      ],
      "discriminator": [
        7,
        90,
        74,
        38,
        99,
        111,
        142,
        77
      ],
      "accounts": [
        {
          "name": "merchant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "businessName",
          "type": "string"
        }
      ]
    },
    {
      "name": "purchaseCoupon",
      "docs": [
        "Purchase a paid coupon (price > 0)",
        "Atomic transaction: SOL payment + NFT transfer",
        "- User pays SOL (97.5% merchant, 2.5% platform)",
        "- NFT transferred from Escrow PDA to buyer",
        "- All or nothing (transaction fails if any step fails)"
      ],
      "discriminator": [
        15,
        115,
        30,
        71,
        75,
        191,
        165,
        57
      ],
      "accounts": [
        {
          "name": "couponData",
          "docs": [
            "Coupon data account (PDA derived from NFT mint address)",
            "Validates:",
            "- Coupon is active",
            "- Coupon requires payment (price > 0)",
            "- Not expired"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  112,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "merchant",
          "docs": [
            "Merchant account (PDA derived from merchant authority)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant.authority",
                "account": "merchant"
              }
            ]
          },
          "relations": [
            "couponData"
          ]
        },
        {
          "name": "merchantAuthority",
          "docs": [
            "Merchant authority wallet - receives 97.5% of payment"
          ],
          "writable": true
        },
        {
          "name": "platformWallet",
          "docs": [
            "Platform fee wallet - receives 2.5% of payment"
          ],
          "writable": true
        },
        {
          "name": "nftEscrow",
          "docs": [
            "NFT Escrow PDA - holds NFTs minted by create_coupon",
            "Seeds: [\"nft_escrow\", merchant_pda, nft_mint]",
            "Authority: The PDA itself (self-custodial)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116,
                  95,
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "merchant"
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "docs": [
            "NFT mint account"
          ]
        },
        {
          "name": "buyerTokenAccount",
          "docs": [
            "Buyer's associated token account (created if not exists)",
            "This is where the NFT will be transferred"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "buyer",
          "docs": [
            "Buyer purchasing the coupon",
            "Pays for: SOL payment + token account creation (if needed) + transaction fees"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "redeemCoupon",
      "docs": [
        "Redeem a coupon",
        "Burns the NFT or decrements redemption counter"
      ],
      "discriminator": [
        66,
        181,
        163,
        197,
        244,
        189,
        153,
        0
      ],
      "accounts": [
        {
          "name": "couponData",
          "docs": [
            "Coupon data account (PDA derived from NFT mint)",
            "Seeds: [\"coupon\", nft_mint_pubkey]",
            "Tracks redemptions remaining and active status"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  112,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "merchant",
          "docs": [
            "Merchant account (PDA derived from merchant authority)",
            "Seeds: [\"merchant\", merchant_authority_pubkey]",
            "Used for event logging and analytics"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant.authority",
                "account": "merchant"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "docs": [
            "NFT mint account (must match coupon_data.mint)"
          ],
          "writable": true
        },
        {
          "name": "nftTokenAccount",
          "docs": [
            "User's token account holding the NFT",
            "Validates ownership via mint and owner constraints"
          ],
          "writable": true
        },
        {
          "name": "user",
          "docs": [
            "User redeeming the coupon (must own the NFT)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "updateCouponStatus",
      "docs": [
        "Update coupon active status",
        "Allows merchant to deactivate/reactivate a coupon"
      ],
      "discriminator": [
        122,
        226,
        151,
        161,
        164,
        22,
        246,
        242
      ],
      "accounts": [
        {
          "name": "merchant",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchantAuthority"
              }
            ]
          }
        },
        {
          "name": "couponData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  112,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "coupon_data.mint",
                "account": "couponData"
              }
            ]
          }
        },
        {
          "name": "authority",
          "relations": [
            "merchant"
          ]
        },
        {
          "name": "merchantAuthority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "couponData",
      "discriminator": [
        234,
        18,
        183,
        25,
        77,
        39,
        32,
        19
      ]
    },
    {
      "name": "merchant",
      "discriminator": [
        71,
        235,
        30,
        40,
        231,
        21,
        32,
        64
      ]
    }
  ],
  "events": [
    {
      "name": "redemptionEvent",
      "discriminator": [
        72,
        165,
        70,
        6,
        179,
        67,
        82,
        183
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "couponExpired",
      "msg": "The coupon has expired and can no longer be redeemed"
    },
    {
      "code": 6001,
      "name": "couponFullyRedeemed",
      "msg": "The coupon has already been fully redeemed"
    },
    {
      "code": 6002,
      "name": "couponNotActive",
      "msg": "The coupon is not active"
    },
    {
      "code": 6003,
      "name": "invalidDiscountPercentage",
      "msg": "Invalid discount percentage (must be 1-100)"
    },
    {
      "code": 6004,
      "name": "invalidExpiryDate",
      "msg": "Expiry date must be in the future"
    },
    {
      "code": 6005,
      "name": "unauthorizedMerchant",
      "msg": "Unauthorized: only the merchant can perform this action"
    },
    {
      "code": 6006,
      "name": "unauthorizedOwner",
      "msg": "Unauthorized: only the coupon owner can perform this action"
    },
    {
      "code": 6007,
      "name": "businessNameTooLong",
      "msg": "Business name is too long (max 100 characters)"
    },
    {
      "code": 6008,
      "name": "invalidRedemptionAmount",
      "msg": "Invalid redemption amount"
    },
    {
      "code": 6009,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow occurred"
    },
    {
      "code": 6010,
      "name": "notFreeCoupon",
      "msg": "This coupon is not free - payment required"
    },
    {
      "code": 6011,
      "name": "notPaidCoupon",
      "msg": "This coupon is not paid - cannot purchase"
    },
    {
      "code": 6012,
      "name": "insufficientPayment",
      "msg": "Insufficient payment amount"
    },
    {
      "code": 6013,
      "name": "couponInactive",
      "msg": "Coupon is inactive"
    },
    {
      "code": 6014,
      "name": "noRedemptionsRemaining",
      "msg": "No redemptions remaining for this coupon"
    }
  ],
  "types": [
    {
      "name": "couponCategory",
      "docs": [
        "Coupon categories for filtering and organization"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "foodAndBeverage"
          },
          {
            "name": "retail"
          },
          {
            "name": "services"
          },
          {
            "name": "travel"
          },
          {
            "name": "entertainment"
          },
          {
            "name": "other"
          }
        ]
      }
    },
    {
      "name": "couponData",
      "docs": [
        "Coupon metadata structure",
        "This data is stored on-chain and linked to the NFT"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "Mint address of the NFT coupon"
            ],
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "docs": [
              "Merchant who created this coupon"
            ],
            "type": "pubkey"
          },
          {
            "name": "discountPercentage",
            "docs": [
              "Discount percentage (0-100)"
            ],
            "type": "u8"
          },
          {
            "name": "expiryDate",
            "docs": [
              "Expiry date (Unix timestamp)"
            ],
            "type": "i64"
          },
          {
            "name": "category",
            "docs": [
              "Category of the deal"
            ],
            "type": {
              "defined": {
                "name": "couponCategory"
              }
            }
          },
          {
            "name": "redemptionsRemaining",
            "docs": [
              "Redemptions remaining (0 = fully redeemed)"
            ],
            "type": "u8"
          },
          {
            "name": "maxRedemptions",
            "docs": [
              "Original number of redemptions allowed"
            ],
            "type": "u8"
          },
          {
            "name": "isActive",
            "docs": [
              "Whether the coupon is still active"
            ],
            "type": "bool"
          },
          {
            "name": "price",
            "docs": [
              "Price in lamports (0 = free coupon, >0 = paid coupon)",
              "1 SOL = 1,000,000,000 lamports"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "merchant",
      "docs": [
        "Merchant account - PDA to track merchant info and coupon creation"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "Merchant's wallet address (authority)"
            ],
            "type": "pubkey"
          },
          {
            "name": "businessName",
            "docs": [
              "Business name"
            ],
            "type": "string"
          },
          {
            "name": "totalCouponsCreated",
            "docs": [
              "Total coupons created by this merchant"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "redemptionEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "redemptionsRemaining",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
