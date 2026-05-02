<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';

  let sport = $state('');
  let title = $state('');
  let description = $state('');
  let location = $state('');
  let date = $state('');
  let time = $state('');
  let maxPlayers = $state(0);
  let skillLevelRequired = $state('Beginner');
  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.post('/pickupGames', {
      sport,
      title,
      description,
      location,
      date,
      time,
      maxPlayers,
      skillLevelRequired,
    });

    submitting = false;

    if (!result.ok) {
      toast.error('Pickup game creation failed.');
      return;
    }

    toast.success('Pickup game created!');
    goto('/dashboard');
  }
</script>

<h1>Pickup Games</h1>
<p>Create a Pickup Game!</p>

<form onsubmit={handleSubmit}>
  <label>
    Sport
    <input type="text" bind:value={sport} required />
  </label>

  <label>
    Title
    <input type="text" bind:value={title} required />
  </label>

  <label>
    Description
    <input type="text" bind:value={description} required />
  </label>

  <label>
    Location
    <input type="text" bind:value={location} required />
  </label>

  <label>
    Date
    <input type="date" bind:value={date} required />
  </label>

  <label>
    Time
    <input type="time" bind:value={time} required />
  </label>

  <label>
    Max number of players
    <input type="number" bind:value={maxPlayers} min="1" required />
  </label>

  <label>
    Skill level required
    <select bind:value={skillLevelRequired}>
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Advanced">Advanced</option>
      <option value="Professional">Professional</option>
    </select>
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? 'Creating pickup game...' : 'Pickup Game'}
  </button>
</form>
