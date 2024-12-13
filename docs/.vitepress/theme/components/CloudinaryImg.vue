<script setup lang="ts">
import { buildUrl } from 'cloudinary-build-url'

const { publicId, alt } = defineProps<{
  publicId: string
  alt?: string
}>()

const prefix = 'tydumpling/'

const url = buildUrl(prefix + publicId, {
  cloud: {
    cloudName: 'tydumpling',
  },
})
</script>

<template>
  <div class="overflow-hidden rounded my-2 md:my-4">
    <img :src="url" :alt="alt ?? publicId">
  </div>
</template>
