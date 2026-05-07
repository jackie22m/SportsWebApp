<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface User {
    userId: string;
    name: string;
    email: string;
  }

  interface PickupGame {
    gameId: string;
    title: string;
    sport: string;
    date: string;
    time: string;
    location: string;
    maxPlayers: number;
    skillLevelRequired: string;
    description: string | null;
    userId: string;
  }

  interface Post {
    postId: string;
    userId: string;
    gameId: string | null;

    user?: User;
    game?: PickupGame | null;

    createdAt: string;
    updatedAt: string;

    type: 'Text' | 'Media' | 'Discussion' | 'Highlight';

    text: string | null;
    mediaUrl: string | null;
    sportsTag: string | null;
    topic: string | null;

    visibility: 'Public' | 'Private';

    comments?: Comment[];
    reactions?: Reaction[];
  }

  interface Comment {
    commentId: string;
    postId: string;
    userId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    user?: {
      userId: string;
      name?: string;
    };
  }

  interface Reaction {
    reactionId: string;
    postId: string;
    userId: string;
    type: string;
    createdAt: string;

    user?: {
      userId: string;
      name?: string;
    };
  }

  let posts: Post[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    const result = await api.get<Post[]>('/posts');

    if (result.ok) {
      posts = result.data;
    } else {
      toast.error('Failed to load posts');
    }
    loading = false;
  });
</script>

<h1>SPORTS</h1>
<button type="button" class="secondary" onclick={() => goto('/dashboard/')}> Go back </button>
{#if loading}
  <Loading />
{:else if posts.length === 0}
  <p>No posts yet.</p>
{:else}
  <ul>
    {#each posts as post}
      <div class="post">
        <h3>{post.type}</h3>

        {#if post.text}
          <p>{post.text}</p>
        {/if}

        {#if post.gameId}
          <p>{post.gameId}</p>
        {/if}

        {#if post.mediaUrl}
          <img src={post.mediaUrl} alt="Post media" />
        {/if}

        {#if post.sportsTag}
          <p>{post.sportsTag}</p>
        {/if}

        {#if post.topic}
          <p>{post.topic}</p>
        {/if}

        <small>Posted on {new Date(post.createdAt).toLocaleString()}</small>
        <p><strong>Posted by:</strong> {post.user?.name}</p>

        <a href={`/athleteProfiles/${post.userId}`} role="button"> View Athlete </a>

        <a href={`/posts/${post.postId}`} role="button">View Details</a>
      </div>
    {/each}
  </ul>
{/if}

<style>
  .post {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }
</style>
