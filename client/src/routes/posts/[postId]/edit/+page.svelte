<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface Post {
    postId: string;
    gameId: string | null;
    type: 'Text' | 'Media' | 'Discussion' | 'Highlight';
    text: string | null;
    mediaUrl: string | null;
    sportsTag: string | null;
    topic: string | null;
    visibility: 'Public' | 'Private';
  }

  let post: Post | null = $state(null);
  let loading = $state(true);
  let saving = $state(false);

  // Form fields
  let gameId = $state('');
  let type = $state('Text');
  let text = $state('');
  let mediaUrl = $state('');
  let sportsTag = $state('');
  let topic = $state('');
  let visibility = $state('Public');

  onMount(async () => {
    const postId = $page.params.postId;

    const result = await api.get<Post>(`/posts/${postId}`);

    if (!result.ok) {
      toast.error('Failed to load post');
      goto('/posts');
      return;
    }

    post = result.data;

    // Pre-fill form
    gameId = post.gameId ?? '';
    type = post.type;
    text = post.text ?? '';
    mediaUrl = post.mediaUrl ?? '';
    sportsTag = post.sportsTag ?? '';
    topic = post.topic ?? '';
    visibility = post.visibility;

    loading = false;
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    saving = true;

    const postId = $page.params.postId;

    const result = await api.put(`/posts/${postId}`, {
      gameId: gameId || null,
      type,
      text: text || null,
      mediaUrl: mediaUrl || null,
      sportsTag: sportsTag || null,
      topic: topic || null,
      visibility,
    });

    saving = false;

    if (!result.ok) {
      toast.error('Failed to update post');
      return;
    }

    toast.success('Post updated!');
    goto(`/posts/${postId}`);
  }
</script>

<h1>Edit Post</h1>

{#if loading}
  <Loading />
{:else}
  <form onsubmit={handleSubmit} class="card">
    <label>
      Post Type
      <select bind:value={type}>
        <option value="Text">Text</option>
        <option value="Media">Media</option>
        <option value="Discussion">Discussion</option>
        <option value="Highlight">Highlight</option>
      </select>
    </label>

    <label>
      Text
      <textarea bind:value={text} placeholder="Write something..."></textarea>
    </label>

    <label>
      Media URL
      <input type="text" bind:value={mediaUrl} placeholder="https://..." />
    </label>

    <label>
      Sports Tag
      <input type="text" bind:value={sportsTag} placeholder="Basketball, Soccer..." />
    </label>

    <label>
      Topic
      <input type="text" bind:value={topic} placeholder="Training, Scheduling..." />
    </label>

    <label>
      Attach to Pickup Game (optional)
      <input type="text" bind:value={gameId} placeholder="gameId or leave empty" />
    </label>

    <label>
      Visibility
      <select bind:value={visibility}>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>
    </label>

    <div class="actions">
      <button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>

      <button type="button" class="secondary" onclick={() => goto(`/posts/${post?.postId}`)}>
        Cancel
      </button>
    </div>
  </form>
{/if}

<style>
  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }

  textarea {
    min-height: 100px;
  }
</style>
