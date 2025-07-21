// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  app: {
    head: {
      title: 'yt-get',
      meta: [
        { name: 'description', content: 'an app for downloading YouTube videos as .webm files.' },
      ],
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'bun',
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '0 8 * * *': ['files:cleanup'],
    },
  },
});
