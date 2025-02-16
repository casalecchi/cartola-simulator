import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 0,
            'react/jsx-sort-props': [
                2,
                {
                    shorthandFirst: true,
                    multiline: 'last',
                    ignoreCase: true,
                },
            ],
        },
    }
)
