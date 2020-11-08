module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{ico,svg,css,html,js,txt}"],
  swDest: "build/sw.js",
  skipWaiting: true,
  clientsClaim: true,
  navigateFallback: "/index.html"
};
