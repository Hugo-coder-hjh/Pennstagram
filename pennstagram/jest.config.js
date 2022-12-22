module.exports = {
  transformIgnorePatterns: ["node_modules/(?!\@?axios)"],
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: ['src/components/*/*.js', 'src/mockAPI/*.js'],
  setupFiles: ['./test-setup.js'],
  moduleNameMapper: {
    '\\.(css|svg|png|jpeg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/cssStub.js',
  },
};
