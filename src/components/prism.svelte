<script>
  // Svelte Imports
  import { afterUpdate, tick, onMount } from "svelte";

  // Prism Imports
  import "prismjs";

  import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.js";
  import "prismjs/components/prism-markup.js";
  import "prismjs/themes/prism.css";
  import "prismjs/themes/prism-okaidia.css";

  export let code = "";

  let fakeCodeEl;
  let preEl;
  let formattedCode = "";
  let language = "markup";

  onMount(() => {
    Prism.plugins.NormalizeWhitespace.setDefaults({
      "remove-trailing": true,
      "remove-indent": true,
      "left-trim": true,
      "right-trim": true,
      "break-lines": 80,
      "tabs-to-spaces": 2,
    });
  });

  afterUpdate(async () => {
    // code variable if they are using a prop
    // Have to use innerText because innerHTML will create weird escape characaters
    if (fakeCodeEl && fakeCodeEl.innerText !== "") {
      code = fakeCodeEl.innerText;
    }
    // We need to wait till everything been rendered before we can
    // call highlightAll and load all the plugins
    await tick();
    // This will make sure all the plugins are loaded
    // Prism.highlight will not do that
    Prism.highlightAllUnder(preEl);
  });

  // Only run if Prism is defined and we code
  $: if (typeof Prism !== "undefined" && code) {
    formattedCode = Prism.highlight(code, Prism.languages[language], language);
  }
</script>

<style>
  .dummy-code {
    display: none;
  }
  .codearea {
    font-size: 0.7rem;
  }
</style>

<code class="dummy-code" bind:this={fakeCodeEl}>
  <slot />
</code>

<pre class="codearea language-markup" bind:this={preEl}>
  <code
    class="language-markup">
    {@html formattedCode}
  </code>
</pre>
