<template>
  <section class="testimonials col-12" id="testimonials" v-if="testimonials?.length">
    <!-- Left: title + description -->
    <div class="testimonials-left col-5">
      <h1>{{ testimonialsSection?.title || 'What Clients Say' }}</h1>
      <div class="section-divider" style="margin-left:0"></div>
      <p>{{ testimonialsSection?.description || 'Trusted by businesses around the world' }}</p>
    </div>

    <!-- Right: testimonial list -->
    <div class="testimonials-right col-7">
      <div class="testimonial-item" v-for="t in testimonials" :key="t.id">
        <div class="testimonial-item-inner">
          <div class="testimonial-stars" v-if="t.rating">{{ '★'.repeat(t.rating) }}{{ '☆'.repeat(5 - t.rating) }}</div>
          <h2 class="testimonial-name">{{ t.name }}</h2>
          <p class="testimonial-company" v-if="t.company">{{ t.company }}</p>
          <p class="testimonial-message">"{{ t.message }}"</p>
        </div>
        <hr class="testimonial-divider" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  testimonials:        Array,
  testimonialsSection: Object,
})
</script>
