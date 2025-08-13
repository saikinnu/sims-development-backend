const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

// Test the forgot password flow
async function testForgotPasswordFlow() {
  console.log('🧪 Testing Forgot Password Flow');
  console.log('================================');
  
  try {
    // Step 1: Request password reset
    console.log('\n1️⃣ Requesting password reset...');
    const resetResponse = await axios.post(`${API_BASE_URL}/api/forgot-password/request-reset`, {
      email: TEST_EMAIL
    });
    
    console.log('✅ Reset request successful:', resetResponse.data.message);
    
    // Step 2: Test OTP verification (this will fail with invalid OTP, which is expected)
    console.log('\n2️⃣ Testing OTP verification with invalid OTP...');
    try {
      await axios.post(`${API_BASE_URL}/api/forgot-password/verify-otp`, {
        email: TEST_EMAIL,
        otp: '000000'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ OTP verification correctly rejected invalid OTP');
      } else {
        console.log('❌ Unexpected error during OTP verification:', error.response?.data);
      }
    }
    
    // Step 3: Test resend OTP
    console.log('\n3️⃣ Testing resend OTP...');
    const resendResponse = await axios.post(`${API_BASE_URL}/api/forgot-password/resend-otp`, {
      email: TEST_EMAIL
    });
    
    console.log('✅ Resend OTP successful:', resendResponse.data.message);
    
    console.log('\n🎉 Forgot password flow test completed successfully!');
    console.log('\n📝 Note: Check the console logs for OTP codes in development mode.');
    console.log('📝 Note: In production, check the email inbox for actual OTP codes.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test email functionality
async function testEmailFunctionality() {
  console.log('\n📧 Testing Email Functionality');
  console.log('==============================');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/forgot-password/test-email`, {
      email: TEST_EMAIL
    });
    
    console.log('✅ Test email sent successfully');
    console.log('📧 Email:', response.data.email);
    console.log('🔐 Test OTP:', response.data.testOtp);
    console.log('📄 Result:', response.data.result);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Forgot Password Tests');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Test Email:', TEST_EMAIL);
  console.log('================================\n');
  
  await testEmailFunctionality();
  await testForgotPasswordFlow();
  
  console.log('\n✨ All tests completed!');
}

// Run if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testForgotPasswordFlow, testEmailFunctionality };
