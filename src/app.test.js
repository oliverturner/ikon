import { render } from "@testing-library/svelte";
import App from "./app";

test("renders the dropzone", () => {
  const { getByText } = render(App);
  const linkElement = getByText(/Drop folders and SVGs here/i);
  expect(linkElement).toBeInTheDocument();
});
