<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface PickupGame {
    gameId: string;
    sport: string;
    title: string;
    location: string;
    date: string;
    time: string;
    maxPlayers: number;
    skillLevelRequired: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  }

  let games: PickupGame[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    const gamesResult = await api.get<PickupGame[]>('/pickupGames/upcoming');

    if (gamesResult.ok) {
      games = gamesResult.data;
    } else {
      toast.error('Failed to load your pickup games');
    }
    loading = false;
  });
</script>

<button type="button" class="secondary" onclick={() => goto('/dashboard/')}> Go back </button>
{#if loading}
  <p>Loading upcoming pickup games…</p>
{:else if games.length === 0}
  <p>No upcoming pickup games.</p>
{:else}
  <ul>
    {#each games as game}
      <li class="card">
        <h3>{game.title}</h3>
        <p><strong>Sport:</strong> {game.sport}</p>
        <p><strong>Date:</strong> {game.date}</p>
        <p><strong>Time:</strong> {game.time}</p>
        <p><strong>Location:</strong> {game.location}</p>
        <p><strong>Max Players:</strong> {game.maxPlayers}</p>
        <p><strong>Skill Level:</strong> {game.skillLevelRequired}</p>
        <a href={`/pickupGames/${game.gameId}`} role="button"> View Details </a>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }
</style>
