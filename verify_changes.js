const mongoose = require('mongoose');
const { Schedule, Review, User } = require('./src/models');
const config = require('./src/config/config');

async function verify() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  console.log('Connected.');

  try {
    // 1. Create dummy users
    const student = await User.create({
      name: 'Test Student',
      email: `student_${Date.now()}@example.com`,
      password: 'password123',
      role: 'student',
    });
    const tutor = await User.create({
      name: 'Test Tutor',
      email: `tutor_${Date.now()}@example.com`,
      password: 'password123',
      role: 'tutor',
    });

    console.log('Created users:', { student: student.id, tutor: tutor.id });

    // 2. Create a Schedule
    const schedule = await Schedule.create({
      startTime: new Date(),
      duration: 60,
      studentId: student.id,
      tutorId: tutor.id,
      subjectCode: 'MATH',
      status: 'completed',
    });
    console.log('Created schedule:', schedule.id);

    // 3. Update Schedule with overallRating and reviews
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      schedule.id,
      {
        overallRating: 'Excellent progress',
        reviews: [
          { name: 'Understanding', rating: 5, comment: 'Great grasp of concepts' },
          { name: 'Participation', rating: 4, comment: 'Good participation' },
        ],
      },
      { new: true }
    );

    console.log('Updated Schedule with reviews:', {
      overallRating: updatedSchedule.overallRating,
      reviews: updatedSchedule.reviews,
    });

    if (updatedSchedule.overallRating !== 'Excellent progress' || updatedSchedule.reviews.length !== 2) {
      throw new Error('Schedule update failed!');
    }

    // 4. Create a Review (Assignment Grades only)
    const review = await Review.create({
      scheduleId: schedule.id,
      assignmentGrades: [
        { taskId: new mongoose.Types.ObjectId(), result: 95, comment: 'Perfect' },
      ],
    });

    console.log('Created Review:', {
      id: review.id,
      assignmentGrades: review.assignmentGrades,
    });

    // Verify Review does NOT have overallRating/reviews (schema should prevent it, but check doc)
    if (review.overallRating || review.reviews) {
      console.warn('WARNING: Review document has unexpected fields!');
    } else {
      console.log('Review document structure is correct (no overallRating/reviews).');
    }

    // Cleanup
    await Schedule.deleteMany({ _id: schedule.id });
    await Review.deleteMany({ _id: review.id });
    await User.deleteMany({ _id: { $in: [student.id, tutor.id] } });
    console.log('Cleanup complete.');

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verify();
