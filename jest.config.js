export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.cube.ts'],
  setupFiles: ['dotenv/config'],
}
