import antfu from '@antfu/eslint-config'
import perfectionist from 'eslint-plugin-perfectionist'

export default antfu(
	{
		stylistic: false,
		formatters: true,
		typescript: true,
	},
	{
		rules: {
			'no-console': 'warn',
			'unicorn/throw-new-error': 'off',
		},
	},
	{
		plugins: {
			perfectionist,
		},
		rules: {
			'perfectionist/sort-imports': [
				'error',
				{
					groups: [
						'type',
						['builtin', 'external'],
						'internal-type',
						['internal'],
						['parent-type', 'sibling-type', 'index-type'],
						['parent', 'sibling', 'index'],
						'object',
						'style',
						'side-effect-style',
						'unknown',
					],
					internalPattern: ['^~/.*', '^@/.*'],
					newlinesBetween: 'always',
					order: 'asc',
					type: 'natural',
				},
			],
		},
	}
)
