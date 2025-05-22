import { onMounted, onBeforeUnmount, ref } from 'vue'

export function useIntersectionObserver(callback, options) {
  const target = ref(null)
  let observer = null

  onMounted(() => {
    if (!target.value) return

    observer = new IntersectionObserver((entries, obs) => {
      callback(entries, obs)
    }, options)

    observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    if (observer && target.value){
      observer.unobserve(target.value)
      observer.disconnect()
    }
  })

  return {
    target
  }
}
