<template>
  <NuxtLayout>
    <div class="flex min-h-screen items-center justify-center bg-custom-yellow">
      <div class="flex w-64 flex-col">
        <img src="~/assets/bike.gif" alt="bike" width="119px" height="75px" />
        <img src="~/assets/bike.png" width="270px" height="47px" />
        <p
          class="mb-28 h-5 w-72 font-google text-custom-size font-normal not-italic leading-custom-height tracking-custom-spacing"
        >
          微笑單車 暢遊城市
        </p>
        <MainPageLink to="/findYouBike"> 尋找 Youbike </MainPageLink>
        <MainPageLink to="/findBikeRoad"> 尋找自行車道 </MainPageLink>
        <MainPageLink to="/findAttractionsAndFood"> 附近景點、美食 </MainPageLink>
      </div>
    </div>
    <p class="absolute bottom-2 right-6 text-xs">
      Where's YouBike &copy; Code: Jason Lin / Design:
      <a href="https://www.behance.net/KT_Designer">KT</a>
    </p>
  </NuxtLayout>
</template>
