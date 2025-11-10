module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

