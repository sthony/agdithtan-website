<template>
  <header class="site-header">
    <div class="container">
      <nav class="nav-links">
        <a href="/"          :class="{ active: isHome && activeSection === 'home' }">Home</a>
        <RouterLink to="/about"  :class="{ active: isAbout || (isHome && activeSection === 'about') }">About</RouterLink>
        <a v-if="isHome" href="/#services" :class="{ active: activeSection === 'services' }">Services</a>
        <a v-if="isHome" href="/#projects" :class="{ active: activeSection === 'projects' }">Projects</a>
        <a v-if="isHome" href="/#contact"  :class="{ active: activeSection === 'contact' }">Contact</a>
      </nav>

      <div class="logo">
        <img v-if="header?.logo_url" :src="header.logo_url" :alt="header.company_name" />
        <span v-else>{{ header?.company_name || 'Agdith' }}</span>
      </div>

      <div class="header-contact">
        <span v-if="header?.phone">📞 {{ header.phone }}</span>
        <span v-if="header?.email">✉️ {{ header.email }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

defineProps({
  header: Object,
})

const route   = useRoute()
const isHome  = computed(() => route.path === '/')
const isAbout = computed(() => route.path === '/about')

const activeSection = ref('home')

const SECTIONS = ['home', 'about', 'services', 'projects', 'contact']

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          if (id === 'home' || id === 'hero') activeSection.value = 'home'
          else if (id === 'about')         activeSection.value = 'about'
          else if (id === 'services')         activeSection.value = 'services'
          else if (id === 'projects')        activeSection.value = 'projects'
          else if (id === 'contact')          activeSection.value = 'contact'
        }
      })
    },
    { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  )

  SECTIONS.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
