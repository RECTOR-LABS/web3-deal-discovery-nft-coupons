const API_URL = 'http://localhost:3000/api/payments/record';

const payload = {
  transactionSignature: '3uXd35SAyZ4BKH2x5yQcnosJTVY8dvm2WiB7WETP3JaPWzVMdm8cJGCxCwgEm38ZuQSWAf7N9wGcwmpUapgCQqe4',
  dealId: 'c2c41c39-1604-4e5e-9570-9b14164aaa23',
  userWallet: '2jLo7yCWuEQLXSvC5Q4yrzwSWQi6MkTDe7LWBuh1MaLk',
  amount: 0.001,
  paymentType: 'direct_purchase',
};

async function testPaymentAPI() {
  try {
    console.log('🧪 Testing Payment API...\n');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log('\nResponse:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Payment recorded successfully!');
    } else {
      console.log('\n❌ Failed to record payment');
      console.log('Error:', data.error || data.message);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testPaymentAPI();
