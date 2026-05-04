<script lang="ts">
  import { auth } from '$lib/auth.svelte';
</script>

<h1>Welcome to Sports!</h1>
{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <p>Signed in as <strong>{auth.user.displayName}</strong> ({auth.user.email}).</p>
{:else}
  <p>You are not signed in.</p>
{/if}

<article>
  <ul>
    <li>Connect with athletes</li>
    <li>Join pickup games</li>
    <li>Share your highlights</li>
    <li>Build your community</li>
  </ul>
  <footer>
    <a href="/login" role="button">Log in</a>
    <a href="/signup" role="button">Sign up</a>
  </footer>
</article>

<style>
  h1 {
    color: red;
  }
</style>
