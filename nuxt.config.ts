export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: false },
  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      tdxClientId: process.env.NUXT_PUBLIC_TDX_CLIENT_ID,
      tdxClientSecret: process.env.NUXT_PUBLIC_TDX_CLIENT_SECRET,
    },
  },
});
