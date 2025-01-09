// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   testMatch: ["**/*.test.ts", "**/*.test.tsx"],
//   testTimeout: 50000,
// };

// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "jest-environment-jsdom", // Use the installed jsdom environment
//   testMatch: ["**/*.test.(ts|tsx)"], // Match .test.ts and .test.tsx files
//   testTimeout: 50000,
// };

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/*.test.(ts|tsx)"],
  testTimeout: 50000,
};

