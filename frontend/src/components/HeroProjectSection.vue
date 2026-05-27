<template>
  <section class="col-12 hero-project-section" id="hero-project" v-if="heroProject?.image_url_left || heroProject?.image_url_right">
    <!-- Left: white bg + framed smaller image -->
    <div class="hero-project-left col-6">
      <div class="hero-project-img-wrap" v-if="heroProject.image_url_left">
        <img v-fade-in :src="heroProject.image_url_left" :alt="heroProject.title || 'Featured project'" />
      </div>
      <div v-if="heroProject.title || heroProject.description" class="hero-project-caption">
        <h3 v-if="heroProject.title">{{ heroProject.title }}</h3>
        <p  v-if="heroProject.description">{{ heroProject.description }}</p>
      </div>
    </div>

    <!-- Right: full-bleed image -->
    <div class="hero-project-right col-6">
      <img
        v-if="heroProject.image_url_right"
        v-fade-in="150"
        :src="heroProject.image_url_right"
        :alt="heroProject.title || 'Featured project'"
        class="hero-project-full"
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  heroProject: Object,
})
</script>
