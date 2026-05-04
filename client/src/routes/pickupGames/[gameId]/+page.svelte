<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { onMount } from 'svelte';

  interface PickupGame {
    gameId: string;
    userId: string;
    sport: string;
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    maxPlayers: number;
    skillLevelRequired: string;
  }

  let game: PickupGame | null = $state(null);
  let loading = $state(true);

  onMount(async () => {
    const id = page.params.gameId;
    const result = await api.get<PickupGame>(`/pickupGames/${id}`);

    if (result.ok) {
      game = result.data;
    } else {
      game;
    }

    loading = false;
  });
</script>

{#if loading}
  <Loading />
{:else if !game}
  <p>Pickup game not found.</p>
{:else}
  <h2>Pickup Game Details</h2>

  <p><strong>Sport:</strong> {game.sport}</p>
  <p><strong>Title:</strong> {game.title}</p>
  <p><strong>Description:</strong> {game.description}</p>
  <p><strong>Location:</strong> {game.location}</p>
  <p><strong>Date:</strong> {game.date}</p>
  <p><strong>Time:</strong> {game.time}</p>
  <p><strong>Max number of players:</strong> {game.maxPlayers}</p>
  <p><strong>skillLevelRequired:</strong> {game.skillLevelRequired}</p>
{/if}
