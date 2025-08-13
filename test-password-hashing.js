const bcrypt = require('bcryptjs');
const { validatePasswordStrength, hashPassword, comparePassword, generateSecurePassword } = require('./utils/passwordUtils');

// Test password validation
console.log('=== Testing Password Validation ===');
const testPasswords = [
  'weak',
  'weak123',
  'Weak123',
  'Weak123!',
  'StrongPassword123!'
];

testPasswords.forEach(password => {
  const validation = validatePasswordStrength(password);
  console.log(`Password: "${password}" - ${validation.isValid ? 'VALID' : 'INVALID'}`);
  if (!validation.isValid) {
    console.log(`  Errors: ${validation.message}`);
  }
});

// Test password hashing
console.log('\n=== Testing Password Hashing ===');
async function testHashing() {
  const password = 'StrongPassword123!';
  
  console.log(`Original password: ${password}`);
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  console.log(`Hashed password: ${hashedPassword}`);
  
  // Compare password
  const isMatch = await comparePassword(password, hashedPassword);
  console.log(`Password match: ${isMatch}`);
  
  // Test wrong password
  const wrongMatch = await comparePassword('WrongPassword123!', hashedPassword);
  console.log(`Wrong password match: ${wrongMatch}`);
  
  // Generate secure password
  const generatedPassword = generateSecurePassword(16);
  console.log(`Generated secure password: ${generatedPassword}`);
  
  // Validate generated password
  const generatedValidation = validatePasswordStrength(generatedPassword);
  console.log(`Generated password validation: ${generatedValidation.isValid ? 'VALID' : 'INVALID'}`);
}

testHashing().catch(console.error); 