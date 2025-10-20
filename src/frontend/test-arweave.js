// Quick test script for Arweave integration
const Arweave = require('arweave');
const fs = require('fs');
const path = require('path');

async function testArweave() {
  try {
    console.log('🔍 Testing Arweave Integration...\n');

    // 1. Initialize Arweave
    console.log('1️⃣ Initializing Arweave client...');
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
    console.log('✅ Arweave client initialized\n');

    // 2. Load wallet
    console.log('2️⃣ Loading wallet keyfile...');
    const keyfilePath = path.join(__dirname, '..', '..', 'arweave-wallet.json');
    const keyfile = JSON.parse(fs.readFileSync(keyfilePath, 'utf-8'));
    console.log('✅ Wallet loaded successfully\n');

    // 3. Get wallet address
    console.log('3️⃣ Getting wallet address...');
    const address = await arweave.wallets.jwkToAddress(keyfile);
    console.log(`✅ Wallet Address: ${address}\n`);

    // 4. Get balance
    console.log('4️⃣ Checking wallet balance...');
    const balance = await arweave.wallets.getBalance(address);
    const ar = arweave.ar.winstonToAr(balance);
    console.log(`✅ Balance: ${ar} AR\n`);

    // 5. Test transaction creation (dry run - won't submit)
    console.log('5️⃣ Testing transaction creation (dry run)...');
    const testData = 'Test upload from NFT Coupon Platform';
    const transaction = await arweave.createTransaction(
      { data: testData },
      keyfile
    );
    transaction.addTag('Content-Type', 'text/plain');
    transaction.addTag('App-Name', 'NFT-Coupon-Test');

    await arweave.transactions.sign(transaction, keyfile);
    console.log(`✅ Transaction created and signed: ${transaction.id}\n`);
    console.log('   (Not submitted - this is just a test)\n');

    console.log('🎉 All Arweave tests PASSED!\n');
    console.log('Summary:');
    console.log(`  - Wallet: ${address}`);
    console.log(`  - Balance: ${ar} AR`);
    console.log(`  - SDK: Working ✓`);
    console.log(`  - Signing: Working ✓\n`);

  } catch (error) {
    console.error('❌ Arweave test FAILED:', error.message);
    process.exit(1);
  }
}

testArweave();
