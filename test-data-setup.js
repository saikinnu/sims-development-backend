const mongoose = require('mongoose');
const Subject = require('./models/AcademicSchema/Subject');
const Class = require('./models/AcademicSchema/Class');
const Student = require('./models/CoreUser/Student');
const StudentMarks = require('./models/Attendance_PerformanceSchema/StudentMarks');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const sampleClasses = [
  { class_name: 'Grade 5', section: 'A' },
  { class_name: 'Grade 6', section: 'B' },
  { class_name: 'Grade 7', section: 'A' }
];

const sampleSubjects = [
  { 
    name: 'Mathematics', 
    className: 'Grade 5', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'John Doe', empId: 'T001' }],
    admin_id: new mongoose.Types.ObjectId() // We'll need to get a real admin ID
  },
  { 
    name: 'English', 
    className: 'Grade 5', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Jane Smith', empId: 'T002' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'Science', 
    className: 'Grade 5', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Bob Johnson', empId: 'T003' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'History', 
    className: 'Grade 5', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Alice Brown', empId: 'T004' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'Geography', 
    className: 'Grade 5', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Charlie Wilson', empId: 'T005' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'Mathematics', 
    className: 'Grade 6', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'John Doe', empId: 'T001' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'English', 
    className: 'Grade 6', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Jane Smith', empId: 'T002' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'Science', 
    className: 'Grade 6', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Bob Johnson', empId: 'T003' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'History', 
    className: 'Grade 6', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Alice Brown', empId: 'T004' }],
    admin_id: new mongoose.Types.ObjectId()
  },
  { 
    name: 'Geography', 
    className: 'Grade 6', 
    maxMarks: 100, 
    passingMarks: 35,
    teachers: [{ name: 'Charlie Wilson', empId: 'T005' }],
    admin_id: new mongoose.Types.ObjectId()
  }
];

async function setupTestData() {
  try {
    console.log('Setting up test data...');

    // Clear existing test data
    await Subject.deleteMany({});
    await Class.deleteMany({});
    await StudentMarks.deleteMany({});

    // Create classes
    const createdClasses = await Class.insertMany(sampleClasses);
    console.log('Classes created:', createdClasses.length);

    // Create subjects
    const createdSubjects = await Subject.insertMany(sampleSubjects);
    console.log('Subjects created:', createdSubjects.length);

    // Find a student to add marks for (assuming there's at least one student)
    const student = await Student.findOne();
    if (!student) {
      console.log('No students found. Please create a student first.');
      return;
    }

    // Create sample marks for the student
    const sampleMarks = [];
    for (const subject of createdSubjects) {
      if (subject.className === 'Grade 5') { // Only add marks for Grade 5 subjects
        sampleMarks.push({
          exam_id: new mongoose.Types.ObjectId(), // Create a dummy exam ID
          class_id: createdClasses.find(c => c.class_name === 'Grade 5')._id,
          subject_id: subject._id,
          student_id: student._id,
          marks_obtained: Math.floor(Math.random() * 40) + 60, // Random marks between 60-100
          max_marks: subject.maxMarks,
          grade: 'A',
          remarks: 'Good performance'
        });
      }
    }

    if (sampleMarks.length > 0) {
      await StudentMarks.insertMany(sampleMarks);
      console.log('Sample marks created for student:', student.full_name);
    }

    console.log('Test data setup completed successfully!');
    console.log('Student ID for testing:', student.user_id);

  } catch (error) {
    console.error('Error setting up test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

setupTestData(); 