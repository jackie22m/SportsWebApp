<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface Post {
    postId: string;
    userId: string;
    text: string | null;
    mediaUrl: string | null;
    sportsTag: string | null;
    topic: string | null;
    type: 'Text' | 'Media' | 'Discussion' | 'Highlight';
    visibility: 'Public' | 'Private';
    createdAt: string;
    updatedAt: string;
  }

  let posts: Post[] = $state([]);
  let loading = $state(true);

  let hasProfile = $state(false);
  let profileLoading = $state(true);

  onMount(async () => {
    // Check athlete profile
    const profileResult = await api.get('/athleteProfiles/me');
    hasProfile = profileResult.ok;
    profileLoading = false;

    // Load posts
    const result = await api.get<Post[]>('/posts');

    if (result.status === 401) {
      toast.error('Please log in to continue');
      goto('/login');
      return;
    }

    if (result.ok) {
      posts = result.data;
    } else {
      toast.error('Failed to load posts');
    }

    loading = false;
  });
</script>

<h1><strong>Dashboard</strong></h1>
{#if profileLoading}
  <p>Loading your athlete profile…</p>
{:else if !hasProfile}
  <section class="card">
    <p>You haven’t created an athlete profile yet.</p>
    <a href="/athleteProfiles/create" role="button">Create Athlete Profile</a>
  </section>
{:else}
  <section class="card">
    <a href="/athleteProfiles/me" role="button">View Profile</a>
    <a href="/athleteProfiles/edit" role="button">Edit Profile</a>
  </section>
{/if}

<a href="/pickupGames/create" role="button">Create A Pickup Game</a>
<a href="/pickupGames/upcoming" role="button">View upcoming games</a>

{#if loading}
  <Loading />
{:else if posts.length === 0}
  <p>No posts yet.</p>
{:else}
  <ul>
    {#each posts as post}
      <li>
        <h3>{post.type}</h3>
        {#if post.text}
          <p>{post.text}</p>
        {/if}
        {#if post.mediaUrl}
          <img src={post.mediaUrl} alt="Post media" />
        {/if}
        <small>Posted on {new Date(post.createdAt).toLocaleString()}</small>
      </li>
    {/each}
  </ul>
{/if}
