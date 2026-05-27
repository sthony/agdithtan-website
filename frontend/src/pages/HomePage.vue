<template>
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>

  <template v-else>
    <AppHeader           :header="data.header" />
    <HeroSection         :hero="data.hero" />
    <MarqueeTicker       :ticker="data.ticker" />
    <AboutSection        :about="data.about" />
    <ServicesSection     :services="data.services" :services-section="data.servicesSection" />
    <HeroProjectSection  :hero-project="data.heroProject" />
    <PortfolioSection    :portfolio="data.portfolio" :portfolio-section="data.portfolioSection" />
    <ContactSection      :about-image-url="data.about?.image_url" />
    <BannerSection       :banner="data.banner" />
    <AppFooter           :header="data.header" :footer="data.footer" />
  </template>
</template>

<script setup>
import { usePageData } from '../composables/usePageData.js'

import AppHeader           from '../components/AppHeader.vue'
import HeroSection         from '../components/HeroSection.vue'
import MarqueeTicker       from '../components/MarqueeTicker.vue'
import AboutSection        from '../components/AboutSection.vue'
import ServicesSection     from '../components/ServicesSection.vue'
import HeroProjectSection  from '../components/HeroProjectSection.vue'
import PortfolioSection    from '../components/PortfolioSection.vue'
import ContactSection      from '../components/ContactSection.vue'
import BannerSection       from '../components/BannerSection.vue'
import AppFooter           from '../components/AppFooter.vue'

const { loading, data } = usePageData()
</script>
