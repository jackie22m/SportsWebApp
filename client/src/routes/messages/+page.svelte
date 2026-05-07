<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface Conversation {
    otherUserId: string;
    otherUsername: string;
    lastMessage: string;
    lastMessageAt: string;
  }

  let conversations: Conversation[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    const result = await api.get<{ conversations: Conversation[] }>('/messages');

    if (result.ok) {
      conversations = result.data.conversations;
    } else {
      toast.error('Failed to load conversations');
    }

    loading = false;
  });
</script>

<button type="button" class="secondary" onclick={() => goto('/dashboard/')}>Go back</button>

<h1>Messages</h1>

{#if loading}
  <Loading />
{:else if conversations.length === 0}
  <p>You have no conversations yet.</p>
{:else}
  <ul>
    {#each conversations as convo}
      <li class="card">
        <h3>{convo.otherUsername}</h3>

        <p><strong>Last message:</strong> {convo.lastMessage}</p>
        <small>{new Date(convo.lastMessageAt).toLocaleString()}</small>

        <a href={`/messages/conversation/${convo.otherUserId}`} role="button">
          Open Conversation
        </a>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }
</style>
