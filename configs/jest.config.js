module.exports = {
  rootDir: "..",
  coverageDirectory: "<rootDir>/tests/__coverage__/",
  setupFiles: ["<rootDir>/tests/__mocks__/shim.js"],
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/__mocks__/fileMock.js",
    "\\.(css|scss|less)$": "<rootDir>/tests/__mocks__/styleMock.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "<rootDir>/configs/jest.preprocessor.js",
  },
  transformIgnorePatterns: ["/node_modules/"],
  testRegex: "/tests/.*\\.(ts|tsx)$",
  moduleDirectories: ["node_modules"],
  setupTestFrameworkScriptFile: require.resolve("./jest.setup.js"),

  globals: {
    DEVELOPMENT: false,
    FAKE_SERVER: false,
  },
}