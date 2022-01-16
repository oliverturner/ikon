import App from "./app.svelte";

document.body.innerHTML = "";

const app = new App({
  target: document.body,
});

export default app;
