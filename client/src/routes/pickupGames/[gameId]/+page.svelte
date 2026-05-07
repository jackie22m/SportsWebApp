<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { onMount } from 'svelte';

  interface AthleteProfile {
    position: string;
    skillLevel: string;
  }

  interface Player {
    user: {
      userId: string;
      name: string;
      athleteProfile?: AthleteProfile;
    };
  }

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
  let players: Player[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    const id = page.params.gameId;

    // Load game
    const result = await api.get<PickupGame>(`/pickupGames/${id}`);
    if (result.ok) {
      game = result.data;
    }

    // Load players
    const playersResult = await api.get<{ participants: Player[] }>(`/pickupGames/players/${id}`);
    if (playersResult.ok) {
      players = playersResult.data.participants;
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
  <p><strong>Skill level required:</strong> {game.skillLevelRequired}</p>

  <h3>Players in this game</h3>

  {#if players.length > 0}
    <ul>
      {#each players as p}
        <li>
          {p.user.name}
          {#if p.user.athleteProfile}
            — {p.user.athleteProfile.position} ({p.user.athleteProfile.skillLevel})
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <p>No players have joined yet.</p>
  {/if}
{/if}

<a href={`/dashboard`} role="button"> Dashboard </a>
