const mongoose = require('mongoose');
const Assignment = require('../models/AcademicSchema/Assignment');
const Subject = require('../models/AcademicSchema/Subject');

// Connect to MongoDB (you'll need to set your connection string)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sims';

async function debugAssignments() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all assignments
    const assignments = await Assignment.find({});
    console.log(`Total assignments found: ${assignments.length}`);

    // Check each assignment
    for (let i = 0; i < assignments.length; i++) {
      const assignment = assignments[i];
      console.log(`\nAssignment ${i + 1}:`);
      console.log(`  Title: ${assignment.title}`);
      console.log(`  Subject ID: ${assignment.subject}`);
      console.log(`  Subject type: ${typeof assignment.subject}`);
      
      // Check if subject exists
      if (assignment.subject) {
        const subject = await Subject.findById(assignment.subject);
        if (subject) {
          console.log(`  Subject found: ${subject.name}`);
        } else {
          console.log(`  ❌ Subject not found in database!`);
        }
      } else {
        console.log(`  ❌ No subject ID!`);
      }
    }

    // Get all subjects
    const subjects = await Subject.find({});
    console.log(`\nTotal subjects found: ${subjects.length}`);
    subjects.forEach((subject, index) => {
      console.log(`  Subject ${index + 1}: ${subject.name} (ID: ${subject._id})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

debugAssignments();
