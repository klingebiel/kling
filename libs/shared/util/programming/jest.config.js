module.exports = {
	displayName: "shared-util-programming",
	preset: "../../../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json"
		}
	},
	transform: {
		"^.+\\.[tj]sx?$": "ts-jest"
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	coverageDirectory: "../../../../coverage/libs/shared/util/programming"
};
