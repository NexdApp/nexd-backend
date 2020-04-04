// jest.config.js
module.exports = {
  verbose: true,
  'moduleFileExtensions': [
    'js',
    'json',
    'ts',
  ],
  'collectCoverageFrom': [
    'src/**/*.{controller,service}.ts',
  ],
  'testRegex': '.spec.ts$',
  'transform': {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // 'setupFiles': ['dotenv/config'],
  //'globalSetup': './test/setupJest.ts',
  //'globalTeardown': './test/teardownJest.ts',
  'coverageDirectory': '../coverage',
  'testEnvironment': 'node',
  'collectCoverage': true,
};
