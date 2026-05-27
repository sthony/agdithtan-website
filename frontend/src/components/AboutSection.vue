<template>
  <section class="col-12 about-section" v-if="about">
    <section class="about-left col-6" id="about">
      <div class="container">
        <div class="about-inner">
          <div class="about-text">
            <div class="section-header" style="text-align:left">
              <h1>{{ about.title }}</h1>
              <div class="section-divider" style="margin-left:0"></div>
            </div>
            <p>{{ about.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="about-right col-6">
      <div class="container">
        <div class="about-inner">
          <div class="about-img-section">
            <div class="about-img" v-if="about.image_url">
              <img v-fade-in :src="about.image_url" :alt="about.title" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
defineProps({
  about: Object,
})
</script>
