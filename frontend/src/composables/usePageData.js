import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

export function usePageData() {
  const loading = ref(true)
  const data = ref({})

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/pages/all')
      data.value = res.data
    } catch (err) {
      console.error('Failed to load site content:', err)
    } finally {
      loading.value = false
    }
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') fetchContent()
  }

  onMounted(() => {
    fetchContent()
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return { loading, data }
}
