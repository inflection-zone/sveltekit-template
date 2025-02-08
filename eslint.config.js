import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			indent: ['error', 4], // Enforce 4-space indentation
			semi: ['error', 'always'], // Require semicolons
			quotes: ['error', 'single', { avoidEscape: true }], // Use single quotes
			'object-curly-spacing': ['error', 'always'], // Require spaces inside object braces
			'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline lists
			'arrow-parens': ['error', 'always'], // Require parentheses in arrow functions
			'no-trailing-spaces': ['error'], // Disallow trailing spaces
			'max-len': ['warn', { code: 120 }], // Warn if a line exceeds 120 characters
			'no-multiple-empty-lines': ['error', { max: 1 }], // Allow only one empty line
			'key-spacing': ['error', { beforeColon: false, afterColon: true }] // Enforce spaces after colons in objects
		}
	}
);
