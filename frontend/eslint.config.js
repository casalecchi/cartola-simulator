import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        prettierConfig,
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
