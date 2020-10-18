<style>
  .wrapper {
    margin: auto;
    opacity: 0;

    animation-name: fade-in;
    animation-duration: 0.5s;
    animation-delay: 0.5s;
    animation-fill-mode: forwards;
  }

  .loader,
  .loader:after {
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
  }
  .loader {
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border: 0.5rem solid#999;
    border-left: 0.5rem solid #333;

    animation: spin 1.1s infinite linear;
  }

  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="wrapper">
  <div class="loader">loading...</div>
</div>
