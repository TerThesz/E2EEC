export default new class status_codes {
  // Success
  SESSION_INITIALIZED = [ 100, 'Session successfully initialized' ];

  // Failure
  SESSION_EXISTS = [ 1, 'Session already exists' ];
  USERNAME_IN_USE = [ 2, 'Username is already in use' ];
  TARGET_NOT_FOUND = [ 3, 'Target user could not be found' ];
  TARGET_SELF = [ 4, 'You cannot send messages to yourself' ];
  ALREADY_IN_PIPELINE = [ 5, 'You are already in a chat room' ];
  TARGET_ALREADY_IN_PIPELINE = [ 6, 'Target user is already in a chat room' ];
  NOT_IN_PIPELINE = [ 7, 'You are not in a chat room' ];
}