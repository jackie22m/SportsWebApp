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

  onMount(async () => {
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
