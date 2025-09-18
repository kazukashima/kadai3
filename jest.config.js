// // next/jest.js はNext.jsによって提供されるJestの設定を簡単に行うためのヘルパー
// import nextJest from "next/jest.js";

// // nextJest はNext.jsの設定を読み込むためのディレクトリを指定している
// // これを使うことでnext.config.jsや.envをテスト環境に組み込める
// const createJestConfig = nextJest({
//   dir: "./",
// });

// // Jestのカスタム設定
// /** @type {import('jest').Config} */
// const config = {
//   // Jestがテストを実行する環境を指定
//   testEnvironment: "jest-environment-jsdom",

//   // jestがテストを実行する前に読み込むセットアップファイルを指定
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
// };

// // 作成したJestのカスタム設定をエクスポートする
// export default createJestConfig(config);


// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   moduleNameMapper: {
//     "\\.(css|less|scss)$": "identity-obj-proxy"
//   },
//   transform: {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   },
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
// };



// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   transform: {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   },
//   moduleNameMapper: {
//     "\\.(css|less|scss)$": "identity-obj-proxy"
//   },
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
//   globals: {
//     "ts-jest": {
//       tsconfig: "tsconfig.json" // ← これ絶対必要！
//     }
//   }
// };


// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: "ts-jest/presets/default-esm", // ESM対応
//   testEnvironment: "jsdom",
//   extensionsToTreatAsEsm: [".ts", ".tsx"],

//   transform: {
//     "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }]
//   },

//   moduleNameMapper: {
//     "\\.(css|less|scss)$": "identity-obj-proxy"
//   },

//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
// };

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  automock: false,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
