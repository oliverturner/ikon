/**
 * @jest-environment jsdom
 */

import { render, type RenderResult } from "@testing-library/svelte";
import App from "../app.svelte";

/**
 * An example test suite outlining the usage of
 * `describe()`, `beforeEach()`, `test()` and `expect()`
 *
 * @see https://jestjs.io/docs/getting-started
 * @see https://github.com/testing-library/jest-dom
 */

describe("App", () => {
	let renderedComponent: RenderResult;

	beforeEach(() => {
		renderedComponent = render(App);
	});

	describe("once the component has been rendered", () => {
		test("should show the proper heading", () => {
			expect(renderedComponent.getByText(/SvelteKit/)).toBeInTheDocument();
		});
	});
});
