export default defineAppConfig({
  ui: {
    colors: {
      primary: 'rose',
      secondary: 'sky',
      neutral: 'slate',
    },
    fonts: false,
    card: {
      slots: {
        root: 'rounded-lg overflow-hidden',
        header: 'p-2 sm:px-3',
        body: 'p-2 sm:p-3',
        footer: 'p-2 sm:px-3',
      },
    },
  },
});
