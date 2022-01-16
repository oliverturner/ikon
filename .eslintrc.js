module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: "module",
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
		extraFileExtensions: [".svelte"],
	},
	plugins: ["svelte3", "@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	overrides: [
		{
			files: ["**/*.svelte"],
			processor: "svelte3/svelte3",
		},
	],
	settings: {
		"svelte3/typescript": true, // load TypeScript as peer dependency
	},

	rules: {},
};
