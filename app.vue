<template>
  <div>
    <h1>{{ title }}</h1>
    <TestComponent />
    <div class="bg-white py-24">
      <div class="flex flex-col items-center">
        <h1 class="text-6xl font-semibold text-blue-600">2022 iThome</h1>
        <p class="mt-4 text-9xl font-bold text-gray-900">鐵人賽</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TestComponent from "./components/TestComponent.vue";

const year = 2023;
const title = `${year}  Nuxt.js 練習`;
</script>
