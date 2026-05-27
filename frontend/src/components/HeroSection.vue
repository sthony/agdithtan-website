<template>
  <section class="hero" id="home">
    <div
      v-if="hero?.background_image_url"
      class="hero-bg"
      :style="{ backgroundImage: `url(${hero.background_image_url})` }"
    ></div>
    <div class="container">
      <div class="hero-content">
        <h1>
          {{ hero?.title || 'Welcome to Agdith' }}
          <span v-if="hero?.subtitle"><br />{{ hero.subtitle }}</span>
        </h1>
        <p>{{ hero?.description || 'Professional solutions tailored for your business.' }}</p>
        <a v-if="hero?.cta_link" :href="hero.cta_link" class="btn btn-primary">
          {{ hero?.cta_text || 'Get Started' }}
        </a>
        <a href="#contact" class="btn btn-outline">Contact Us</a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  hero: Object,
})
</script>
