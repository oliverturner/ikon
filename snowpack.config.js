const isProd = process.env.NODE_ENV === "production";

console.log({ isProd });

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
