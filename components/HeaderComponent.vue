<template>
  <header class="w-full">
    <div
      class="flex h-20 w-full flex-row items-center justify-around bg-custom-yellow shadow-custom-shadow sm:justify-between"
    >
      <NuxtLink to="/">
        <img
          src="~/assets/bike.png"
          width="225px"
          height="43px"
          class="mx-4 hidden sm:mx-4 sm:block lg:mx-24"
        />
        <img
          src="~/assets/backlogo.png"
          class="mx-4 flex w-auto sm:mx-4 sm:hidden lg:mx-24 lg:hidden"
        />
      </NuxtLink>
      <slot />
    </div>

    <div class="hidden w-[100px] lg:block"></div>
  </header>
</template>
