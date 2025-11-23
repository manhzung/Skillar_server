const crypto = require('crypto');

/**
 * Generate a unique Jitsi meeting room name
 * @param {Object} options - Options for generating room name
 * @param {string} options.prefix - Prefix for room name (default: 'skillar')
 * @param {string} options.scheduleId - Schedule ID to include in room name
 * @param {Date} options.date - Schedule date
 * @returns {string} - Unique room name
 */
const generateRoomName = (options = {}) => {
  const { prefix = 'skillar', scheduleId, date } = options;
  
  // Create a unique identifier
  const timestamp = date ? new Date(date).getTime() : Date.now();
  const randomStr = crypto.randomBytes(4).toString('hex');
  
  // Combine elements to create room name
  // Format: skillar-{timestamp}-{random} or skillar-{scheduleId}-{random}
  let roomName = prefix;
  
  if (scheduleId) {
    // Use last 8 chars of scheduleId for brevity
    const shortId = scheduleId.toString().slice(-8);
    roomName += `-${shortId}`;
  } else {
    roomName += `-${timestamp}`;
  }
  
  roomName += `-${randomStr}`;
  
  return roomName;
};

/**
 * Generate a complete Jitsi meeting URL
 * @param {Object} options - Options for generating meeting URL
 * @param {string} options.roomName - Custom room name (optional)
 * @param {string} options.scheduleId - Schedule ID (optional)
 * @param {Date} options.date - Schedule date (optional)
 * @param {string} options.baseUrl - Jitsi server URL (default: https://meet.jit.si)
 * @returns {string} - Complete Jitsi meeting URL
 */
const generateMeetingUrl = (options = {}) => {
  const { roomName, baseUrl = 'https://meet.jit.si' } = options;
  
  const finalRoomName = roomName || generateRoomName(options);
  
  // Ensure room name is URL-safe
  const safeRoomName = finalRoomName.replace(/[^a-zA-Z0-9-_]/g, '');
  
  return `${baseUrl}/${safeRoomName}`;
};

/**
 * Generate meeting URL with additional config parameters
 * @param {Object} options - Meeting options
 * @param {string} options.roomName - Room name
 * @param {string} options.displayName - Participant display name
 * @param {string} options.subject - Meeting subject/title
 * @returns {string} - Jitsi meeting URL with config
 */
const generateMeetingUrlWithConfig = (options = {}) => {
  const { displayName, subject } = options;
  const baseUrl = generateMeetingUrl(options);
  
  const params = new URLSearchParams();
  
  if (displayName) {
    params.append('displayName', displayName);
  }
  
  if (subject) {
    params.append('subject', subject);
  }
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}#config.${queryString}` : baseUrl;
};

module.exports = {
  generateRoomName,
  generateMeetingUrl,
  generateMeetingUrlWithConfig,
};
