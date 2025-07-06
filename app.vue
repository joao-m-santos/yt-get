<script setup lang="ts">
import { NuxtLayout, NuxtPage, UApp } from '#components';
</script>

<template>
  <UApp :toaster="{ position: 'bottom-center' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
