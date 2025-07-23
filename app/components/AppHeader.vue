<template>
  <header class="p-4 flex justify-between">
    <img src="/favicon.svg" alt="yt-get" class="w-9 h-9" />
    <button @click="clear" class="border-2">logout</button>
    <ColorModeButton />
  </header>
</template>

<script setup lang="ts">
const { clear } = useUserSession();
</script>
