const postcssPresetEnv = require("postcss-preset-env");
const postcssImport = require("postcss-import");
const postcssEasings = require("postcss-easings");
const importUrl = require("postcss-import-url");

module.exports = {
  plugins: [
    importUrl(),
    postcssImport({
      path: "app/css",
    }),
    // postcssEasings(),
    // postcssEasings.easings,
    postcssPresetEnv({
      stage: 0,
    }),
  ],
};
