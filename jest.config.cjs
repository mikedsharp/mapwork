module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRunner: 'jest-circus/runner',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'svelte'],
  "setupFiles": [
    "jest-canvas-mock"
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
  },
  testRegex: '/src/.*\\.test.(ts|tsx|js)$',
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: ['node_modules']
};
