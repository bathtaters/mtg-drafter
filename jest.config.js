const createJestConfig = require('next/jest')({ dir: './', })

module.exports = createJestConfig({
  moduleDirectories: ['node_modules', 'src/'],
  testEnvironment: 'jest-environment-jsdom',
})