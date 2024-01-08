<!-- Toaster.svelte -->
<script lang="ts">
    import { Toast } from 'flowbite-svelte';
    import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';

    export let message = '';
    export let statusCode = '';

    $: isResErr = statusCode !== 'success';
</script>

<div class="toaster">
{#if isResErr === false}
<Toast color="green" position="top-right">
    <svelte:fragment slot="icon">
      <CheckCircleSolid class="w-5 h-5" />
      <span class="sr-only">Check icon</span>
    </svelte:fragment>
    {message}
</Toast>
{:else}
<Toast color="red" position="top-right">
    <svelte:fragment slot="icon">
      <CloseCircleSolid class="w-5 h-5" />
      <span class="sr-only">Close icon</span>
    </svelte:fragment>
    {message}
</Toast>
{/if}
</div>
  