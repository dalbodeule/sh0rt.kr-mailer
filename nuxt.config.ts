// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-05-17",
  srcDir: ".",
  dir: {
    app: "app",
  },
  nitro: {
    preset: "cloudflare_module",
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  devServer: {
    port: 3000
  },
  build: {
    transpile: [ '' ]
  },
  runtimeConfig: {

  },
  hub: {
    database: true,
    blob: true
  },
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxtjs/turnstile",
    "@vesp/nuxt-fontawesome",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-auth-utils",
    "@nuxt/image",
  ]
})