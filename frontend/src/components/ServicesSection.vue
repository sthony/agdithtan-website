<template>
  <section class="services col-12" id="services" v-if="services?.length">
    <!-- Left: title + description -->
    <div class="services-left col-6">
      <h1>{{ servicesSection?.title || 'Our Services' }}</h1>
      <div class="section-divider" style="margin-left:0"></div>
      <p>{{ servicesSection?.description || 'What we offer to help your business grow' }}</p>
    </div>

    <!-- Right: service list -->
    <div class="services-right col-6">
      <div class="service-item" v-for="svc in services" :key="svc.id">
        <div class="service-item-inner">
          <img v-if="svc.icon_url" v-fade-in :src="svc.icon_url" :alt="svc.title" class="service-icon" />
          <div>
            <h1 class="service-right-title">{{ svc.title }}</h1>
            <p>{{ svc.description }}</p>
          </div>
        </div>
        <hr class="service-divider" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  services:        Array,
  servicesSection: Object,
})
</script>
