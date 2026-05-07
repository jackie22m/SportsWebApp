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
  let postLoading = $state(true);

  let hasProfile = $state(false);
  let profileLoading = $state(true);

  onMount(async () => {
    // Check athlete profile
    const profileResult = await api.get('/athleteProfiles/me');
    hasProfile = profileResult.ok;
    profileLoading = false;

    // Load posts
    const postResult = await api.get<Post[]>('/posts');

    if (postResult.status === 401) {
      toast.error('Please log in to continue');
      goto('/login');
      return;
    }

    if (postResult.ok) {
      posts = postResult.data;
    } else {
      toast.error('Failed to load posts');
    }
    postLoading = false;
  });
</script>

<h1 style="text-align: center;">DASHBOARD</h1>
<section class="quick-actions">
  <a href="/messages" role="button">Messages</a>
  <a href="/pickupGames/create" role="button">Create Pickup Game</a>
  <a href="/pickupGames" role="button">Upcoming Games</a>
  <a href="/posts/create" role="button">Share a Post</a>
  <a href="/posts" role="button">All Posts</a>
</section>

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
    <a href="/athleteProfiles/me/edit" role="button">Edit Profile</a>
  </section>
{/if}

<h2 style="text-align: center;">FEED</h2>
{#if postLoading}
  <Loading />
{:else if posts.length === 0}
  <p>No posts yet.</p>
{:else}
  <ul>
    {#each posts as post}
      <div>
        <h3>{post.type}</h3>
        {#if post.text}
          <p>{post.text}</p>
        {/if}
        {#if post.mediaUrl}
          <img src={post.mediaUrl} alt="Post media" />
        {/if}
        <small>Posted on {new Date(post.createdAt).toLocaleString()}</small>
        <hr />
      </div>
    {/each}
  </ul>
{/if}

<button type="button" class="secondary" onclick={() => goto('/logout')}>Log Out</button>

<style>
  h1 {
    color: red;
  }
</style>
