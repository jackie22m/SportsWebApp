<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';

  let email = $state('');
  let password = $state('');
  let name = $state('');
  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.post('/users', { email, password, name });

    submitting = false;

    if (!result.ok) {
      toast.error('Registration failed. Try a different email.');
      return;
    }

    toast.success('Account created!');
    goto('/athleteProfile');
  }
</script>

<h1>Sports!</h1>
<p>Create your account to join games, share highlights, and connect with athletes.</p>

<article>
  <header><strong>Sign up for Sports!</strong></header>

  <form onsubmit={handleSubmit}>
    <label>
      Name
      <input type="text" bind:value={name} required />
    </label>

    <label>
      Email
      <input type="email" bind:value={email} required />
    </label>

    <label>
      Password
      <input type="password" bind:value={password} required />
    </label>

    <button type="submit" disabled={submitting}>
      {submitting ? 'Creating account...' : 'Sign Up'}
    </button>
  </form>

  <p>Already have an account? <a href="/login">Log in</a></p>
</article>

<style>
  h1 {
    color: red;
  }
</style>
