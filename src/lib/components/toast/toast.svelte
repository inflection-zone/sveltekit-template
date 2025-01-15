<script>
  import { fade } from "svelte/transition";
  import SuccessIcon from "../icons/success.icon.svelte";
  import ErrorIcon from "../icons/error.icon.svelte";
  import InfoIcon from "../icons/info.icon.svelte";
  import CloseIcon from "../icons/close.icon.svelte";

  //////////////////////////////////////////////////////////////////////////////

  export let type = "error";
  export let dismissible = true;
  export let dismiss;
</script>

<article class="{type} bg-gray-700"  role="alert" transition:fade>
  {#if type === "success"}
    <SuccessIcon width="1.1em" />
  {:else if type === "error"}
    <ErrorIcon width="1.1em" />
  {:else}
    <InfoIcon width="1.1em" />
  {/if}

  <div class="text">
    <slot />
  </div>

  {#if dismissible}
    <button class="close" on:click={dismiss}>
      <CloseIcon width="0.8em" />
    </button>
  {/if}
</article>

<style>
  article {
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.3rem;
    display: flex;
    box-shadow: 1px 1px 1px 1px rgba(249, 249, 249, 0.103);
    align-items: center;
    margin: 0 auto 0.5rem auto;
    width: 20rem;
  }
  .error {
    background: IndianRed;
  }
  .success {
    background: MediumSeaGreen;
  }
  .info {
    background: rgb(78, 143, 247);
  }
  .text {
    margin-left: 1rem;
  }
  button {
    color: white;
    background: transparent;
    border: 0 none;
    padding: 0;
    margin: 0 0 0 auto;
    line-height: 1;
    font-size: 1rem;
  }
</style>
