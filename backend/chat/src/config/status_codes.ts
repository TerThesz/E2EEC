export default new class status_codes {
  // Success
  SESSION_INITIALIZED = [ 100, 'Session successfully initialized' ];

  // Failure
  SESSION_ALREADY_INITIALIZED = [ 1, 'Session already initialized' ];
  USERNAME_IN_USE = [ 2, 'Username is already in use' ];
  TARGET_NOT_FOUND = [ 3, 'Target user could not be found' ];
  TARGET_SELF = [ 4, 'You cannot send messages to yourself' ];
  ALREADY_IN_PIPE= [ 5, 'You are already in a chat room' ];
  TARGET_ALREADY_IN_PIPE = [ 6, 'Target user is already in a chat room' ];
  NOT_IN_PIPE = [ 7, 'You are not in a chat room' ];
  PIPE_ENDED = [ 8, 'Chat room has ended' ];
  NO_USERNAME = [ 9, 'No username provided' ];
  PIPE_NOT_FOUND = [ 10, 'Chat room could not be found' ];
  TARGET_NOT_IN_PIPE = [ 11, 'Target user is not in the chat room' ];
  REMOVED_FROM_PIPE = [ 12, 'You have been removed from the chat room' ];
  TARGET_REMOVED = (name: string) =>  [ 13, name + ' has been removed from the chat room' ];
}