<script setup lang="ts">
defineProps<{
  title?: string
  padding?: boolean
}>()
</script>

<template>
  <div class="card">
    <div v-if="title" class="card-header">
      <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
    </div>
    <div :class="padding !== false ? 'card-body' : ''">
      <slot />
    </div>
  </div>
</template>
