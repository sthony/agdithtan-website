/**
 * v-fade-in directive
 * Fades an element in (with a gentle upward drift) when it enters the viewport.
 *
 * Usage:
 *   v-fade-in            — no delay
 *   v-fade-in="150"      — 150 ms delay (useful for staggered grid items)
 */
export const fadeIn = {
  mounted(el, binding) {
    const delay = typeof binding.value === 'number' ? binding.value : 0

    // Start invisible and slightly below its final position
    Object.assign(el.style, {
      opacity:          '0',
      transform:        'translateY(28px)',
      transition:       `opacity 1.1s ease ${delay}ms, transform 1.1s ease ${delay}ms`,
      willChange:       'opacity, transform',
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)          // fire only once
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
  },
}
