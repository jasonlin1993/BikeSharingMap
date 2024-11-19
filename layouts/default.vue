<template>
  <div class="flex min-h-screen flex-col bg-custom-gray">
    <slot name="header" />
    <!-- 主內容區域 -->
    <main class="flex-grow bg-custom-gray">
      <slot />
    </main>
    <slot name="footer" />
  </div>
</template>
