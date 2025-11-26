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

const USER_SELECT_FIELDS = 'name email role phone avatar';
const USER_DETAILED_SELECT_FIELDS = 'name email role phone avatarUrl address currentLevel';

module.exports = {
  USER_ROLES,
  SCHEDULE_STATUS,
  USER_SELECT_FIELDS,
  USER_DETAILED_SELECT_FIELDS,
};

