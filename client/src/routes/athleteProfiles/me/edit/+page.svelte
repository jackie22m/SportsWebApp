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
  let saving = $state(false);

  // Form fields
  let bio = $state('');
  let primarySport = $state('');
  let secondarySport = $state('');
  let position = $state('');
  let skillLevel = $state('');
  let location = $state('');

  onMount(async () => {
    const result = await api.get<AthleteProfile>('/api/athleteProfiles/me');

    if (!result.ok) {
      toast.error('Failed to load profile');
      goto('/dashboard');
      return;
    }

    profile = result.data;

    // Past athlete profile
    bio = profile.bio;
    primarySport = profile.primarySport;
    secondarySport = profile.secondarySport ?? '';
    position = profile.position;
    skillLevel = profile.skillLevel;
    location = profile.location;

    loading = false;
  });

  async function saveProfile() {
    saving = true;

    const result = await api.put('/api/athleteProfiles/me', {
      bio,
      primarySport,
      secondarySport: secondarySport || null,
      position,
      skillLevel,
      location,
    });

    saving = false;

    if (!result.ok) {
      toast.error('Failed to update profile');
      return;
    }

    toast.success('Profile updated');
    goto('/athleteProfiles/me');
  }
</script>

<h1>Edit Athlete Profile</h1>

{#if loading}
  <Loading />
{:else}
  <form onsubmit={saveProfile}>
    <label>
      Bio
      <textarea bind:value={bio} required></textarea>
    </label>

    <label>
      Primary Sport
      <input type="text" bind:value={primarySport} required />
    </label>

    <label>
      Secondary Sport (optional)
      <input type="text" bind:value={secondarySport} />
    </label>

    <label>
      Position
      <input type="text" bind:value={position} required />
    </label>

    <label>
      Skill Level
      <select bind:value={skillLevel} required>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Professional">Professional</option>
      </select>
    </label>

    <label>
      Location
      <input type="text" bind:value={location} required />
    </label>

    <div class="actions">
      <button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </button>

      <button type="button" class="secondary" onclick={() => goto('/athleteProfiles/me')}>
        Cancel
      </button>
    </div>
  </form>
{/if}
