// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-auth-utils'],
  runtimeConfig: {
    session: {
      name: 'yt-get_session',
      password: process.env.NUXT_SESSION_PASSWORD || '',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
    },
  },
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
