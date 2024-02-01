import { Config } from "@jest/types";
import path from "path";
const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["src/tests/"],
    moduleFileExtensions: ["ts", "js"],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
        },
    },
    setupFilesAfterEnv: [path.join(__dirname, "src", "tests", "setupTests.ts")],
    testTimeout: 10000
};

export default config;
