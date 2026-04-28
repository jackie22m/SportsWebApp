<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';

  let bio = $state('');
  let primarySport = $state('');
  let secondarySport = $state('');
  let position = $state('');
  let skillLevel = $state(['Beginner', 'Intermediate', 'Advanced', 'Professional']);
  let location = $state('');
  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.post('/athleteProfiles', {
      bio,
      primarySport,
      secondarySport,
      position,
      skillLevel,
      location,
    });

    submitting = false;

    if (!result.ok) {
      toast.error('Athlete profile creation failed.');
      return;
    }

    toast.success('Athlete profile created!');
    goto('/dashboard');
  }
</script>

<h1>Sports!</h1>
<p>Create your Athlete Profile!</p>
<form onsubmit={handleSubmit}>
  <label>
    bio
    <input type="text" bind:value={bio} required />
  </label>

  <label>
    Primary sport
    <input type="text" bind:value={primarySport} required />
  </label>

  <label>
    Secondary sport
    <input type="text" bind:value={secondarySport} required />
  </label>

  <label>
    Position
    <input type="text" bind:value={position} required />
  </label>

  <label>
    Skill level
    <select bind:value={skillLevel}>
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Advanced">Advanced</option>
      <option value="Professional">Professional</option>
    </select>
  </label>
  <button type="submit" disabled={submitting}>
    {submitting ? 'Creating account...' : 'Sign Up'}
  </button>
</form>

<style>
  h1 {
    color: red;
  }
</style>
