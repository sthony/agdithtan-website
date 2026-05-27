<template>
  <section class="portfolio" id="projects" v-if="portfolio?.length">
    <div class="container">
      <div class="section-header">
        <h2>{{ portfolioSection?.title || 'Our Portfolio' }}</h2>
        <div class="section-divider"></div>
        <p>{{ portfolioSection?.description || 'A selection of our recent work' }}</p>
      </div>

      <!-- Staggered grid -->
      <div class="portfolio-stagger">
        <div
          class="portfolio-stagger-item"
          v-for="item in portfolio"
          :key="item.id"
          @click="openLightbox(item)"
        >
          <div class="portfolio-stagger-img">
            <img v-if="item.image_url" v-fade-in :src="item.image_url" :alt="item.title" />
            <div v-else class="portfolio-placeholder"><i>No image</i></div>
          </div>
          <span class="portfolio-stagger-num">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <teleport to="body">
    <div class="lightbox" v-if="lightbox">
      <button class="lightbox-close" @click="closeLightbox">&#x2715;</button>

      <button
        v-if="lightboxIndex > 0"
        class="lightbox-arrow lightbox-arrow-prev"
        @click="prevImage"
      >&#8249;</button>

      <img :src="lightbox.image_url" :alt="lightbox.title" class="lightbox-img" />

      <button
        v-if="portfolio && lightboxIndex < portfolio.length - 1"
        class="lightbox-arrow lightbox-arrow-next"
        @click="nextImage"
      >&#8250;</button>

      <div class="lightbox-caption">
        <h3>{{ lightbox.title }}</h3>
        <p v-if="lightbox.description">{{ lightbox.description }}</p>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  portfolio:        Array,
  portfolioSection: Object,
})

const lightbox      = ref(null)
const lightboxIndex = ref(0)

function openLightbox(item) {
  const idx = props.portfolio?.indexOf(item) ?? 0
  lightboxIndex.value = idx
  lightbox.value = item
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.value = null
  document.body.style.overflow = ''
}

function prevImage() {
  if (!props.portfolio || lightboxIndex.value <= 0) return
  lightboxIndex.value--
  lightbox.value = props.portfolio[lightboxIndex.value]
}

function nextImage() {
  if (!props.portfolio || lightboxIndex.value >= props.portfolio.length - 1) return
  lightboxIndex.value++
  lightbox.value = props.portfolio[lightboxIndex.value]
}

function onKeydown(e) {
  if (!lightbox.value) return
  if (e.key === 'ArrowLeft')  prevImage()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'Escape')     closeLightbox()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>
