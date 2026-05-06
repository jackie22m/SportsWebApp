<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';

  let gameId = $state('');
  let type = $state('Text');
  let text = $state('');
  let mediaUrl = $state('');
  let sportsTag = $state('');
  let topic = $state('');
  let visibility = $state('Public');

  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.post('/posts', {
      gameId: gameId || null,
      type,
      text: text || null,
      mediaUrl: mediaUrl || null,
      sportsTag: sportsTag || null,
      topic: topic || null,
      visibility,
    });

    submitting = false;

    if (!result.ok) {
      toast.error('Post creation failed.');
      return;
    }

    toast.success('Post created!');
    goto('/posts');
  }
</script>

<h1>Create Post</h1>

<form onsubmit={handleSubmit}>
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

  <button type="submit" disabled={submitting}>
    {submitting ? 'Creating post...' : 'Create Post'}
  </button>

  <button type="button" class="secondary" onclick={() => goto('/dashboard')}> Cancel </button>
</form>
