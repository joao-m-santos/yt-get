<script setup>
import { PhMoonStars, PhSun } from '@phosphor-icons/vue';

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light';
  },
});

const icon = computed(() => (isDark ? PhMoonStars : PhSun));
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton color="neutral" variant="outline" class="px-[6px]" @click="isDark = !isDark">
      <component :is="icon" :size="24" />
    </UButton>

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
