export default new class status_codes {
  // Success
  SESSION_INITIALIZED = [ 100, 'Session successfully initialized' ];

  // Failure
  SESSION_EXISTS = [ 1, 'Session already exists' ];
  USERNAME_IN_USE = [ 2, 'Username is already in use' ];
}