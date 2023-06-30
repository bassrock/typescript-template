// Our cursors for pagination require the server and code run in a single timezone.
// Sets the timezone for date objects in tests to be the same as the database timezone.
// This is the mimic application timezone set in the Dockerfile.
// IMPORTANT: Always keep this timezone the same as the application timezone
process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/?(*.)+(spec|integration).[jt]s?(x)'],
  testPathIgnorePatterns: ['/dist/'],
  testTimeout: 10000,
  displayName: 'template',
  setupFilesAfterEnv: ['jest-extended/all'],
};
