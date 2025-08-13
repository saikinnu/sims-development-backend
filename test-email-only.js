const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'your_gmail@gmail.com';

async function testEmailOnly() {
  console.log('📧 Testing Email Functionality Only');
  console.log('====================================');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Test Email:', TEST_EMAIL);
  console.log('');
  
  try {
    console.log('1️⃣ Sending test email...');
    const response = await axios.post(`${API_BASE_URL}/api/forgot-password/test-email`, {
      email: TEST_EMAIL
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Email:', response.data.email);
    console.log('🔐 Test OTP:', response.data.testOtp);
    console.log('📄 Result:', response.data.result);
    
    console.log('\n📝 Check your Gmail inbox (and spam folder) for the test email.');
    console.log('📝 The OTP should be:', response.data.testOtp);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure NODE_ENV=production in your .env file');
    console.log('2. Verify your Gmail app password is correct');
    console.log('3. Check that 2FA is enabled on your Gmail account');
    console.log('4. Ensure your Gmail address is correct');
  }
}

// Run the test
testEmailOnly().catch(console.error);
