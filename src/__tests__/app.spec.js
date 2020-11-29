import { render } from "@testing-library/svelte";
import App from "../app";

describe("App", () => {
  let getByLabelText;

  beforeEach(() => {
    getByLabelText = render(App).getByLabelText;
  });

  describe.each([
    ["dropzone", /Drop folders and SVGs here/i],
    ["GH link", /View source on GitHub/i],
  ])("renders %s", (input, expected) => {
    test(`renders ${input}`, () => {
      expect(getByLabelText(expected)).toBeInTheDocument();
    });
  });
});
