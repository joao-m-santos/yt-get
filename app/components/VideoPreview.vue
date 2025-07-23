<template>
  <UCard>
    <div class="flex gap-2">
      <img :src="thumbnail" :alt="title" class="w-50 overflow-hidden shrink-0" />
      <div>
        <h3 class="font-bold">{{ title }}</h3>
        <h4>{{ author }}</h4>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  thumbnail?: string;
  author: string;
}>();
</script>
