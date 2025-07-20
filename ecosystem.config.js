export default {
  apps: [
    {
      name: 'yt-get',
      script: '.output/server/index.mjs',
      interpreter: 'bun',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
