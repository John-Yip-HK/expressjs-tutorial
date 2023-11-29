/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  coverageProvider: 'v8',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
};

module.exports = config;