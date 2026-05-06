<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface User {
    userId: string;
    username: string;
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

  interface Comment {
    commentId: string;
    postId: string;
    userId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
  }

  interface Reaction {
    reactionId: string;
    postId: string;
    userId: string;
    type: string;
    createdAt: string;
    user?: User;
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

  let post: Post | null = $state(null);
  let loading = $state(true);

  async function loadPost() {
    const id = $page.params.postId;
    const result = await api.get<Post>(`/posts/${id}`);

    if (result.ok) {
      post = result.data;
    } else {
      toast.error('Failed to load post');
    }
  }

  onMount(async () => {
    await loadPost();
    loading = false;
  });

  // COMMENTS
  let commentText = $state('');
  let submittingComment = $state(false);

  async function submitComment() {
    submittingComment = true;

    const result = await api.post(`/posts/${post?.postId}/comments`, {
      text: commentText,
    });

    submittingComment = false;

    if (!result.ok) {
      toast.error('Comment failed');
      return;
    }

    commentText = '';
    toast.success('You commented!');
    await loadPost();
  }

  // REACTIONS
  let submittingReaction = $state(false);

  async function react(type: string) {
    submittingReaction = true;

    const result = await api.post(`/posts/${post?.postId}/reactions`, {
      reactionType: type,
    });

    submittingReaction = false;

    if (!result.ok) {
      toast.error('Reaction failed');
      return;
    }

    toast.success('You reacted!');
    await loadPost();
  }
</script>

{#if loading}
  <Loading />
{:else if !post}
  <p>Post could not be retrieved.</p>
{:else}
  <h2>Post</h2>

  <p><strong>Type:</strong> {post.type}</p>
  <p><strong>Text:</strong> {post.text}</p>
  <p><strong>Media:</strong> {post.mediaUrl}</p>
  <p><strong>Tag:</strong> {post.sportsTag}</p>
  <p><strong>Topic:</strong> {post.topic}</p>

  <div class="comments">
    <h3>Comments</h3>

    {#each post.comments as c}
      <div class="comment">
        <strong>{c.user?.username}</strong>: {c.text}
      </div>
    {/each}

    <input bind:value={commentText} placeholder="Write a comment..." />
    <button onclick={submitComment} disabled={submittingComment}>
      {submittingComment ? 'Posting...' : 'Comment'}
    </button>
  </div>

  <div class="reactions">
    <button onclick={() => react('like')}>👍 Like</button>
    <button onclick={() => react('love')}>❤️ Love</button>
    <button onclick={() => react('clap')}>👏 Clap</button>
    <button onclick={() => react('fire')}>🔥 Fire</button>

    <p>{post.reactions?.length ?? 0} reactions</p>
  </div>
{/if}

<button type="button" class="secondary" onclick={() => goto('/dashboard')}> Dashboard </button>
