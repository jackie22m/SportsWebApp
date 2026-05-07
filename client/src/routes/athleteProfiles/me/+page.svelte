<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  let showConfirm = $state(false);

  interface AthleteProfile {
    athleteProfileId: string;
    userId: string;
    bio: string;
    primarySport: string;
    secondarySport: string | null;
    position: string;
    skillLevel: string;
    location: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Post {
    postId: string;
    text: string | null;
    type: 'Text' | 'Media' | 'Discussion' | 'Highlight';
    sportsTag: string | null;
    topic: string | null;
    mediaUrl: string | null;
    createdAt: string;
  }

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

  let profile: AthleteProfile | null = $state(null);
  let posts: Post[] = $state([]);
  let games: PickupGame[] = $state([]); // added for pu games
  let loading = $state(true);

  onMount(async () => {
    // Load profile
    const profileResult = await api.get<AthleteProfile>('/athleteProfiles/me');

    if (profileResult.status === 401) {
      toast.error('Please log in to continue');
      goto('/login');
      return;
    }

    if (profileResult.ok) {
      profile = profileResult.data;
    }

    // Load posts
    const postResult = await api.get<Post[]>('/posts/me');
    if (postResult.ok) {
      posts = postResult.data;
    }

    // load pickup games user is in
    const gamesResult = await api.get<PickupGame[]>('/pickupGames/me');

    if (gamesResult.ok) {
      games = gamesResult.data;
    } else {
      toast.error('Failed to load your pickup games');
    }

    loading = false;
  });

  let postToDelete: Post | null = $state(null);
  async function handleDelete(): Promise<void> {
    const result = await api.del<Post>(`/posts/${postToDelete?.postId}`);

    if (result.ok) {
      toast.success('Post deleted');
      posts = posts.filter((p) => p.postId !== postToDelete?.postId);
    } else {
      toast.error('Failed to delete post');
    }

    showConfirm = false;
  }
</script>

<h1>Your Athlete Profile</h1>

{#if loading}
  <Loading />
{:else if !profile}
  <p>You don’t have an athlete profile yet.</p>
  <a href="/athleteProfiles/create" role="button">Create Athlete Profile</a>
{:else}
  <section class="card">
    <h2>Profile Details</h2>

    <p><strong>Bio:</strong> {profile.bio}</p>
    <p><strong>Primary Sport:</strong> {profile.primarySport}</p>

    {#if profile.secondarySport}
      <p><strong>Secondary Sport:</strong> {profile.secondarySport}</p>
    {/if}

    <p><strong>Position:</strong> {profile.position}</p>
    <p><strong>Skill Level:</strong> {profile.skillLevel}</p>
    <p><strong>Location:</strong> {profile.location}</p>

    <small>Created: {new Date(profile.createdAt).toLocaleString()}</small><br />
    <small>Updated: {new Date(profile.updatedAt).toLocaleString()}</small>

    <div class="actions">
      <button onclick={() => goto('/athleteProfiles/me/edit')}>Edit Profile</button>
      <button onclick={() => goto('/dashboard')}>Dashboard</button>
    </div>
  </section>
{/if}

<section class="card" style="margin-top: 2rem;">
  <h2>Your Posts</h2>

  {#if posts.length === 0}
    <p>You haven’t created any posts yet.</p>
  {:else}
    {#each posts as post}
      <div class="post">
        <p><strong>Type:</strong> {post.type}</p>

        {#if post.text}
          <p>{post.text}</p>
        {/if}

        {#if post.mediaUrl}
          <img src={post.mediaUrl} alt="Post media" style="max-width: 100%; margin-top: 0.5rem;" />
        {/if}

        {#if post.sportsTag}
          <p><strong>Sport:</strong> {post.sportsTag}</p>
        {/if}

        {#if post.topic}
          <p><strong>Topic:</strong> {post.topic}</p>
        {/if}

        <small>Posted: {new Date(post.createdAt).toLocaleString()}</small>
        <a href={`/posts/${post.postId}/edit`} role="button"> Edit post </a>

        <button onclick={() => ((postToDelete = post), (showConfirm = true))}>Delete</button>

        <hr />
      </div>
    {/each}
    <Modal title="Delete this item?" bind:open={showConfirm}>
      <p>This will permanently remove the item.</p>

      <button class="secondary" onclick={() => (showConfirm = false)}>Cancel</button>
      <button onclick={handleDelete}>Delete</button>
    </Modal>
  {/if}
</section>

<section class="card" style="margin-top: 2rem;">
  <h2>Your Pickup Games</h2>
  {#if loading}
    <p>Loading your pickup games…</p>
  {:else if games.length === 0}
    <p>You haven't created or joined any pickup games yet.</p>
  {:else}
    <ul>
      {#each games as game}
        <div class="game-card">
          <h3>{game.title}</h3>
          <p><strong>Sport:</strong> {game.sport}</p>
          <p><strong>Date:</strong> {game.date}</p>
          <p><strong>Time:</strong> {game.time}</p>
          <p><strong>Location:</strong> {game.location}</p>
          <p><strong>Max Players:</strong> {game.maxPlayers}</p>
          <p><strong>Skill Level:</strong> {game.skillLevelRequired}</p>
          <a href={`/pickupGames/${game.gameId}`} role="button"> View Details </a>
          <hr />
        </div>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }

  .post {
    margin-bottom: 1rem;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }
</style>
