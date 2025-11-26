const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TUTOR: 'tutor',
  PARENT: 'parent',
};

const SCHEDULE_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

const ASSIGNMENT_TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
};

const HOMEWORK_TASK_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
};

const USER_SELECT_FIELDS = 'name email role phone avatar';
const USER_DETAILED_SELECT_FIELDS = 'name email role phone avatarUrl address currentLevel';

module.exports = {
  USER_ROLES,
  SCHEDULE_STATUS,
  USER_SELECT_FIELDS,
  USER_DETAILED_SELECT_FIELDS,
  ASSIGNMENT_STATUS,
  ASSIGNMENT_TASK_STATUS,
  HOMEWORK_TASK_STATUS,
};

