<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
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
    const id = page.params.userId;
    const result = await api.get<AthleteProfile>(`/athleteProfiles/${id}`);

    if (result.ok) {
      profile = result.data;
    } else {
      profile;
    }

    loading = false;
  });
</script>

{#if loading}
  <Loading />
{:else if !profile}
  <p>Athlete profile not found.</p>
{:else}
  <h2>Profile Details</h2>

  <p><strong>Bio:</strong> {profile.bio}</p>
  <p><strong>Primary Sport:</strong> {profile.primarySport}</p>

  {#if profile.secondarySport}
    <p><strong>Secondary Sport:</strong> {profile.secondarySport}</p>
  {/if}

  <p><strong>Position:</strong> {profile.position}</p>
  <p><strong>Skill Level:</strong> {profile.skillLevel}</p>
  <p><strong>Location:</strong> {profile.location}</p>
{/if}
