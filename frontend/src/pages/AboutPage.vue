<template>
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>

  <template v-else>
    <AppHeader           :header="data.header" />
    <AboutSection        :about="data.about" />
    <TeamSection         :team="data.team" :team-section="data.teamSection" />
    <TestimonialsSection :testimonials="data.testimonials" :testimonials-section="data.testimonialsSection" />
    <BannerSection       :banner="data.banner" />
    <AppFooter           :header="data.header" :footer="data.footer" />
  </template>
</template>

<script setup>
import { usePageData } from '../composables/usePageData.js'

import AppHeader           from '../components/AppHeader.vue'
import AboutSection        from '../components/AboutSection.vue'
import TeamSection         from '../components/TeamSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import BannerSection       from '../components/BannerSection.vue'
import AppFooter           from '../components/AppFooter.vue'

const { loading, data } = usePageData()
</script>
