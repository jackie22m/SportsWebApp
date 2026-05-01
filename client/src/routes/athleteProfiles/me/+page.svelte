<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

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

  let profile: AthleteProfile | null = $state(null);
  let loading = $state(true);

  onMount(async () => {
    const result = await api.get<AthleteProfile>('/athleteProfiles/me');

    if (result.status === 401) {
      toast.error('Please log in to continue');
      goto('/login');
      return;
    }

    if (result.ok) {
      profile = result.data;
    } else {
      profile = null;
    }

    loading = false;
  });
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

<style>
  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }
</style>
