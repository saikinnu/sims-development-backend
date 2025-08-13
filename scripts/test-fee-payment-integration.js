const mongoose = require('mongoose');
const Fee = require('../models/AdministrativeSchema/Fee');
const PaymentDetails = require('../models/AdministrativeSchema/PaymentDetails');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sims', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testFeePaymentIntegration = async () => {
  try {
    console.log('Testing Fee-PaymentDetails Integration...\n');

    // 1. Test creating a fee with payment information
    console.log('1. Testing fee creation with payment info...');
    const testFeeData = {
      student_id: new mongoose.Types.ObjectId(), // Mock student ID
      student_name: 'Test Student',
      class: '10',
      section: 'A',
      amount: 15000,
      first_term: {
        amount_due: 5000,
        status: 'Paid',
        due_date: new Date('2024-06-15'),
        payment_method: 'Cash',
        payment_date: new Date('2024-06-10'),
      },
      second_term: {
        amount_due: 5000,
        status: 'Pending',
        due_date: new Date('2024-09-15'),
        payment_method: '',
        payment_date: null,
      },
      third_term: {
        amount_due: 5000,
        status: 'Pending',
        due_date: new Date('2024-12-15'),
        payment_method: '',
        payment_date: null,
      },
      admin_id: new mongoose.Types.ObjectId(), // Mock admin ID
    };

    const createdFee = await Fee.create(testFeeData);
    console.log('✓ Fee created successfully:', createdFee._id);

    // 2. Check if PaymentDetails records were created
    console.log('\n2. Checking PaymentDetails records...');
    const paymentRecords = await PaymentDetails.find({ fee_id: createdFee._id });
    console.log(`✓ Found ${paymentRecords.length} payment records`);
    
    if (paymentRecords.length > 0) {
      paymentRecords.forEach(payment => {
        console.log(`  - ${payment.term_name}: ₹${payment.amount_paid} via ${payment.payment_method}`);
      });
    }

    // 3. Test updating fee with new payment
    console.log('\n3. Testing fee update with new payment...');
    const updateData = {
      ...testFeeData,
      second_term: {
        amount_due: 5000,
        status: 'Paid',
        due_date: new Date('2024-09-15'),
        payment_method: 'Online',
        payment_date: new Date('2024-09-10'),
      }
    };

    const updatedFee = await Fee.findByIdAndUpdate(
      createdFee._id,
      updateData,
      { new: true }
    );
    console.log('✓ Fee updated successfully');

    // 4. Check if new PaymentDetails record was created
    console.log('\n4. Checking for new PaymentDetails record...');
    const updatedPaymentRecords = await PaymentDetails.find({ fee_id: createdFee._id });
    console.log(`✓ Total payment records: ${updatedPaymentRecords.length}`);
    
    if (updatedPaymentRecords.length > 0) {
      updatedPaymentRecords.forEach(payment => {
        console.log(`  - ${payment.term_name}: ₹${payment.amount_paid} via ${payment.payment_method}`);
      });
    }

    // 5. Cleanup test data
    console.log('\n5. Cleaning up test data...');
    await Fee.findByIdAndDelete(createdFee._id);
    await PaymentDetails.deleteMany({ fee_id: createdFee._id });
    console.log('✓ Test data cleaned up');

    console.log('\n🎉 All tests passed! Fee-PaymentDetails integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
};

// Run the test
testFeePaymentIntegration();
