<template>
  <section class="team" id="team" v-if="team?.length">
    <div class="container">
      <div class="section-header">
        <h1>{{ teamSection?.title || 'Meet the Team' }}</h1>
        <div class="section-divider"></div>
        <p>{{ teamSection?.description || 'The people behind our success' }}</p>
      </div>
      <div class="team-grid">
        <div class="team-card" v-for="member in team" :key="member.id">
          <img v-if="member.image_url" v-fade-in :src="member.image_url" :alt="member.name" class="team-avatar" />
          <div v-else class="team-avatar-placeholder">{{ member.name[0] }}</div>
          <h3>{{ member.name }}</h3>
          <p class="position">{{ member.position }}</p>
          <p>{{ member.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  team:        Array,
  teamSection: Object,
})
</script>
