
const config = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	testPathIgnorePatterns: [
		/* Path de archivos que se ignoran, Ej:
      '<rootDir>/folder/'
      '<rootDir>/folder/file.component.spec.ts'
      '<rootDir>/folder/.../file.component.spec.ts'
		*/
	],
	collectCoverage: true,
	coverageReporters: ['html'],
	cacheDirectory: '.tests/cache',
	coverageDirectory: '.tests/coverage',
	collectCoverageFrom: [
		'**/*.component.ts',
		'**/*.service.ts',
		'!**/node_modules/**'
	],
	coverageThreshold: {
		global: {
			statements: 100
		}
	}
}

module.exports = config;
