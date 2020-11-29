const isProd = process.env.node === "production";

/** @type {import("./typings/snowpack").SnowpackPluginConfig[]} */
let plugins = ["@snowpack/plugin-dotenv", "@snowpack/plugin-svelte"];

/** @type {import("./typings/snowpack").SnowpackPluginConfig[]} */
let extraPlugins = [
  [
    "@snowpack/plugin-run-script",
    {
      cmd: "svelte-check --output human",
      watch: "$1 --watch",
      output: "stream",
    },
  ],
];

if (isProd) {
  extraPlugins = [
    // ["@snowpack/plugin-webpack", { htmlMinifierOptions: false }],
    ["@snowpack/plugin-optimize", { preloadModules: true }],
  ];
}

module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  plugins: [...plugins, ...extraPlugins],
};
