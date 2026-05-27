<template>
  <section class="col-12 contact-section" id="contact">
    <!-- Left: image with colored bg -->
    <div class="contact-left col-6">
      <div class="contact-img-wrap" v-if="aboutImageUrl">
        <img v-fade-in :src="aboutImageUrl" alt="Contact" />
      </div>
    </div>

    <!-- Right: form -->
    <div class="contact-right col-6">
      <div class="contact-form-inner">
        <h2>Contact Us</h2>
        <p class="contact-sub">Questions?<br>Ready for a quote? We're here to help</p>

        <form @submit.prevent="submitContact" class="contact-form">
          <div class="contact-row">
            <div class="contact-field">
              <label>First name <span>*</span></label>
              <input v-model="form.first_name" type="text" required />
            </div>
            <div class="contact-field">
              <label>Last name</label>
              <input v-model="form.last_name" type="text" />
            </div>
          </div>
          <div class="contact-field">
            <label>Email <span>*</span></label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="contact-field">
            <label>Enter your message here</label>
            <textarea v-model="form.message" rows="4"></textarea>
          </div>
          <div v-if="status" :class="['contact-status', status.type]">
            {{ status.message }}
          </div>
          <button type="submit" class="btn-contact" :disabled="sending">
            {{ sending ? 'Sending…' : 'Submit' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

defineProps({
  aboutImageUrl: String,
})

const form    = ref({ first_name: '', last_name: '', email: '', message: '' })
const sending = ref(false)
const status  = ref(null)

async function submitContact() {
  sending.value = true
  status.value  = null
  try {
    await axios.post('/api/contact', form.value)
    form.value = { first_name: '', last_name: '', email: '', message: '' }
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: "Your message has been sent! We'll be in touch soon.",
      confirmButtonColor: '#2563eb',
      timer: 3000,
      timerProgressBar: true,
    })
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: err.response?.data?.error || 'Something went wrong. Please try again.',
      confirmButtonColor: '#2563eb',
      timer: 3000,
      timerProgressBar: true,
    })
  } finally {
    sending.value = false
  }
}
</script>
