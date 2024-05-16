module.exports = {
  // Test environment: Node.js
  testEnvironment: "node",

  testTimeout: 10000,

  // Test file patterns: Match files in the 'tests' directory with a .test.js extension
  testMatch: ["<rootDir>/tests/**/*.test.js"],

  setupFiles: ["<rootDir>/tests/setup.js"],

  // Transform JavaScript files using Babel
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  coverageThreshold: {
    global: {
      branches: 2,
      functions: 2,
      lines: 2,
      statements: 2,
    },
  },

  // Coverage settings
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],

  // Directories or files to ignore during testing
  testPathIgnorePatterns: ["/node_modules/"],

  // Supported file extensions
  moduleFileExtensions: ["js", "json", "jsx", "node"],
};
