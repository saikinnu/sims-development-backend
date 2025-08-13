require('dotenv').config();
const { sendEmail, verifyEmailConfig } = require('./utils/email');

async function testEmailFunctionality() {
  console.log('🧪 Testing Email Functionality...\n');

  // Test 1: Verify email configuration
  console.log('1. Testing email configuration...');
  const configValid = await verifyEmailConfig();
  console.log('Configuration valid:', configValid, '\n');

  // Test 2: Send test email
  console.log('2. Sending test email...');
  try {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from School Management System',
      text: 'This is a test email with OTP: 123456',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Test Email</h2>
          <p>This is a test email to verify email functionality.</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #1F2937; margin: 0; font-size: 24px; letter-spacing: 4px;">123456</h3>
          </div>
          <p>If you can see this email, the email system is working correctly.</p>
        </div>
      `
    });
    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }

  console.log('\n🎉 Email testing completed!');
}

// Run the test
testEmailFunctionality();
