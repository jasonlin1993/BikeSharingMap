<template>
  <div>
    <h1>{{ title }}</h1>
    <TestComponent />
  </div>
</template>

<script setup lang="ts">
import TestComponent from "./components/TestComponent.vue";

const year = 2023;
const title = `${year}  Nuxt.js 練習`;
</script>
