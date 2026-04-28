<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';

  let email = $state('');
  let password = $state('');
  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.post('/login', { email, password });

    submitting = false;

    if (result.status === 403) {
      toast.error('Invalid email or password');
      return;
    }

    if (!result.ok) {
      toast.error('Something went wrong');
      return;
    }

    await auth.refresh();
    goto('/dashboard');
  }
</script>

<h1>Sports!</h1>

<article>
  <header><strong>Log in for Sports!</strong></header>
  <form onsubmit={handleSubmit}>
    <label>
      Email
      <input type="email" bind:value={email} required />
    </label>

    <label>
      Password
      <input type="password" bind:value={password} required />
    </label>

    <button type="submit" disabled={submitting}>
      {submitting ? 'Logging in...' : 'Log In'}
    </button>
  </form>
</article>

<p>Don't have an account? <a href="/signup">Sign up</a></p>

<style>
  h1 {
    color: red;
  }
</style>
