const mongoose = require('mongoose');
const { createHomeworkReview } = require('../../src/validations/homeworkReview.validation');
const HomeworkReview = require('../../src/models/homeworkReview.model');

async function verify() {
  console.log('Verifying HomeworkReview schema...');

  // Test Validation
  const validData = {
    body: {
      homeworkId: '5ebac534954b54139806c112',
      overallRating: 5,
      reviews: [
        {
          name: 'Completion',
          rating: 5,
          comment: 'Excellent'
        }
      ],
      assignmentGrades: [
        {
          taskId: '5ebac534954b54139806c113',
          result: 90,
          comment: 'Good job'
        }
      ]
    }
  };

  const { error } = createHomeworkReview.body.validate(validData.body);
  if (error) {
    console.error('Validation failed:', error.details);
  } else {
    console.log('Validation successful!');
  }

  // Test Model
  const review = new HomeworkReview({
    homeworkId: new mongoose.Types.ObjectId(),
    overallRating: 4,
    reviews: [
      {
        name: 'Quality',
        rating: 4,
        comment: 'Good'
      }
    ],
    assignmentGrades: []
  });

  const err = review.validateSync();
  if (err) {
    console.error('Model validation failed:', err);
  } else {
    console.log('Model validation successful!');
    console.log('HomeworkReview document:', review.toJSON());
  }
}

verify();
