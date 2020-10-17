<style>
  .loader,
  .loader:after {
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
  }
  .loader {
    margin: auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border: 0.5rem solid#999;
    border-left: 0.5rem solid #333;

    animation: spin 1.1s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="loader">loading...</div>
