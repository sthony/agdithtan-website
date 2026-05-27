<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo">{{ header?.company_name || 'Agdith' }}</div>
          <p>{{ footer?.copyright_text || 'Professional solutions for your business.' }}</p>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li v-if="footer?.email">{{ footer.email }}</li>
            <li v-if="footer?.phone">{{ footer.phone }}</li>
            <li v-if="footer?.address">{{ footer.address }}</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} {{ header?.company_name || 'Agdith' }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  header: Object,
  footer: Object,
})
</script>
