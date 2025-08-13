const TeacherSchedule = require('../../models/Attendance_PerformanceSchema/TeacherSchedule');
const mongoose = require('mongoose');
const Student = require('../../models/CoreUser/Student');
const Teacher = require('../../models/CoreUser/Teacher');

exports.getSchedulesByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }
    

    
    const schedules = await TeacherSchedule.find({ teacherId: teacherId });
    
    res.json(schedules);
  } catch (err) {
    console.error('Error in getSchedulesByTeacher:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { teacherId, dayOfWeek, classId, subject, startTime, endTime,admin_id } = req.body;
    
    const teacher = await Teacher.findOne({users: req.user._id});

    // Validate required fields
    if (!teacherId || !dayOfWeek || !classId || !subject || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'All fields are required: teacherId, dayOfWeek, classId, subject, startTime, endTime' 
      });
    }
    
    
    const schedule = new TeacherSchedule({
      teacherId,
      dayOfWeek,
      classId,
      subject,
      startTime,
      endTime,
      createdAt: new Date(),
      admin_id: teacher.admin_id
    });
    
    await schedule.save();
    
    res.status(201).json(schedule);
  } catch (err) {
    console.error('Error in createSchedule:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      return res.status(400).json({ error: 'Invalid schedule ID format' });
    }
    
    
    const schedule = await TeacherSchedule.findByIdAndUpdate(
      scheduleId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (err) {
    console.error('Error in updateSchedule:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      return res.status(400).json({ error: 'Invalid schedule ID format' });
    }
    

    
    const schedule = await TeacherSchedule.findByIdAndDelete(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error('Error in deleteSchedule:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    
    
    const { classId, teacherId } = req.query;
    let filter = {};
    
    if (classId) {
      filter.classId = classId;
    }
    
    if (teacherId) {
      filter.teacherId = teacherId;
    }
    
    console.log('Filter:', filter);
    const schedules = await TeacherSchedule.find(filter).sort({ dayOfWeek: 1, startTime: 1 });
    console.log('Found schedules:', schedules.length);
    
    res.json(schedules);
  } catch (err) {
    console.error('Error in getAllSchedules:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSchedulesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }
    
    
    // First, get the student's class ID
    const Student = require('../../models/CoreUser/Student');
    const student = await Student.findOne({ user_id: studentId });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (!student.class_id) {
      return res.status(404).json({ error: 'Student is not assigned to any class' });
    }
  
    const teacher = await Teacher.findOne({admin_id: student.admin_id})
    
    
    // Get all schedules for the student's class
    const schedules = await TeacherSchedule.find({ classId: student.class_id, admin_id: teacher.admin_id})
      .sort({ dayOfWeek: 1, startTime: 1 });

      
    
    
    res.json(schedules);
  } catch (err) {
    console.error('Error in getSchedulesByStudent:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSchedulesByStudentForHomePage = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }
    
    
    // First, get the student's class ID
    
    const student = await Student.findOne({ user_id: studentId });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (!student.class_id) {
      return res.status(404).json({ error: 'Student is not assigned to any class' });
    }
  
    const teacher = await Teacher.findOne({admin_id: student.admin_id})
    
    
    // Get all schedules for the student's class
    const schedules = await TeacherSchedule.find({ classId: student.class_id, admin_id: teacher.admin_id,createdAt:{$gte: new Date(new Date().setDate(new Date().getDate() - 1))}})
      .sort({ dayOfWeek: 1, startTime: 1 });

      
    
    
    res.json(schedules);
  } catch (err) {
    console.error('Error in getSchedulesByStudent:', err);
    res.status(500).json({ error: err.message });
  }
};