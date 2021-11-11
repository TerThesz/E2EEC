export default new class status_codes {
  // Success
  SESSION_INITIALIZED = [ 100, 'Session successfully initialized' ];

  // Failure
  MULTIPLE_SESSIONS = [ 1, 'Another session is already active for this username' ];
  TARGET_NOT_FOUND = [ 2, 'Target user could not be found' ];
  TARGET_SELF = [ 3, 'You cannot send messages to yourself' ];
  NO_USERNAME = [ 4, 'No username provided' ];
  BAD_DATA_TYPE = [ 5, 'Bad data type' ];
  BAD_REQUEST_TYPE = [ 6, 'Bad request type']
  BAD_REQUEST_FORMAT = [ 7, 'Bad request format' ];
  BAD_DATA_FORMAT = [ 8, 'Bad data format' ];
}