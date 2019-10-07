module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },    
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/test/",
    "/__tests__/",
    "/dist/",
    "/config/",
    "/jestSetup.js"
  ],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "__tests__/utils/"
  ],
  "setupFiles": [
    "./jestSetup.js"
  ]
}
