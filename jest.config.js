/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',        // Usa ts-jest para transformar TypeScript
    testEnvironment: 'node',  // Ambiente Node
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    transform: {
        '^.+\\.ts$': 'ts-jest', // Transforma arquivos .ts
    },
    testMatch: ['**/test/**/*.test.ts', '**/?(*.)+(spec|test).ts'], // Onde estão seus testes
};
