<template>
  <div>
    <h2>{{ message }}</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      message: "Hello, this is a TypeScript component!",
    };
  },
});
</script>
