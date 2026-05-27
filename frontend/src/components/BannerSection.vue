<template>
  <div v-if="banner?.image_url" class="banner-section">
    <img :src="banner.image_url" alt="" />
  </div>
</template>

<script setup>
defineProps({
  banner: Object,
})
</script>

<style scoped>
.banner-section {
  width: 100%;
  line-height: 0;
}
.banner-section img {
  width: 100%;
  display: block;
  object-fit: cover;
}
</style>
