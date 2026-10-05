import globals from 'globals'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig(...tseslint.configs.recommended, prettier, {
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
    },
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },
    },
})
