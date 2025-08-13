const Subject = require('../../models/AcademicSchema/Subject');
const Teacher = require('../../models/CoreUser/Teacher');
const mongoose = require('mongoose');

exports.createSubject = async (req, res) => {
  try {
    const { name, className, teachers, maxMarks, passingMarks, category } = req.body;
    
    // Validation
    if (!name || !className || !teachers || teachers.length === 0) {
      return res.status(400).json({ message: 'Subject name, class name, and at least one teacher are required' });
    }

    // Validate teachers array
    const validTeachers = teachers.filter(teacher => teacher.name && teacher.empId);
    if (validTeachers.length === 0) {
      return res.status(400).json({ message: 'At least one valid teacher (with name and employee ID) is required' });
    }

    const subjectData = {
      name: name.trim(),
      className: className.trim(),
      teachers: validTeachers,
      maxMarks: maxMarks || 100,
      passingMarks: passingMarks || 35,
      category: category || '',
      admin_id: req.user._id
    };

    const subject = new Subject(subjectData);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ admin_id: req.user._id }).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSubjectsUnderMyAdmin = async (req, res) => {
  try {
    console.log('getAllSubjectsUnderMyAdmin called with user ID:', req.user._id);
    
    const teacher = await Teacher.findOne({ users: req.user._id });
    console.log('Found teacher:', teacher ? 'Yes' : 'No');
    
    if (!teacher) {
      console.log('Teacher not found for user:', req.user._id);
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    console.log('Teacher admin_id:', teacher.admin_id);
    const subjects = await Subject.find({ admin_id: teacher.admin_id }).sort({ createdAt: -1 });
    console.log('Found subjects count:', subjects.length);
    console.log('Subjects:', subjects.map(s => ({ name: s.name, className: s.className })));
    
    res.json(subjects);
  } catch (error) {
    console.error('Error in getAllSubjectsUnderMyAdmin:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    console.log('getSubjectById called with ID:', req.params.id);
    console.log('ID type:', typeof req.params.id);
    console.log('ID length:', req.params.id?.length);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({ message: 'Invalid subject ID format' });
    }

    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    console.log('updateSubject called with ID:', req.params.id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({ message: 'Invalid subject ID format' });
    }

    const { name, className, teachers, maxMarks, passingMarks, category } = req.body;
    
    // Validation
    if (!name || !className || !teachers || teachers.length === 0) {
      return res.status(400).json({ message: 'Subject name, class name, and at least one teacher are required' });
    }

    // Validate teachers array
    const validTeachers = teachers.filter(teacher => teacher.name && teacher.empId);
    if (validTeachers.length === 0) {
      return res.status(400).json({ message: 'At least one valid teacher (with name and employee ID) is required' });
    }

    const updateData = {
      name: name.trim(),
      className: className.trim(),
      teachers: validTeachers,
      maxMarks: maxMarks || 100,
      passingMarks: passingMarks || 35,
      category: category || ''
    };

    const subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    console.log('deleteSubject called with ID:', req.params.id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({ message: 'Invalid subject ID format' });
    }

    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: error.message });
  }
};
