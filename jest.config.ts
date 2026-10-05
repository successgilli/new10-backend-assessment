import { defineConfig } from 'jest'

export default defineConfig({
    roots: ['<rootDir>/src/'],
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
})
