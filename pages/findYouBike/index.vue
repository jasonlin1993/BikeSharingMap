<template>
  <HeaderComponent>
    <div
      class="relative hidden h-10 w-72 cursor-pointer rounded-full bg-white font-google text-base font-normal leading-5 lg:hidden xl:flex"
    >
      <input
        type="checkbox"
        id="check"
        class="peer hidden"
        @change="toggleCategory"
        v-model="isChecked"
      />

      <!-- 黑色背景 -->
      <div
        class="absolute flex h-full w-1/2 items-center justify-center rounded-full bg-black transition-transform duration-500 peer-checked:translate-x-full"
      ></div>

      <!-- 景點（黃色文字 + 圖片） -->
      <span
        class="absolute bottom-1/4 left-[10%] top-1/4 flex items-center font-google text-lg font-black text-custom-yellow transition-opacity duration-300 peer-checked:opacity-0"
      >
        <img src="/assets/bikeYellow.png" />
        <p class="mx-2">租</p>
        <p class="mx-2">車</p>
      </span>
      <!-- 美食（黃色文字 + 圖片） -->
      <span
        class="absolute bottom-1/4 right-[10%] top-1/4 hidden items-center font-google text-lg font-black text-custom-yellow duration-300 peer-checked:flex"
      >
        <img src="/assets/parkingYellow.png" />
        <p class="mx-2">還</p>
        <p class="mx-2">車</p>
      </span>
      <!-- 景點（黑色文字 + 圖片） -->
      <span
        class="absolute bottom-1/4 left-[10%] top-1/4 hidden items-center justify-center font-google text-lg font-black text-black peer-checked:flex"
      >
        <img src="/assets/bikeBlack.png" />
        <p class="mx-2">租</p>
        <p class="mx-2">車</p>
      </span>
      <!-- 美食（黑色文字 + 圖片） -->
      <span
        class="absolute bottom-1/4 right-[10%] top-1/4 flex items-center justify-center font-google text-lg font-black text-black peer-checked:opacity-0"
      >
        <img src="/assets/parkingBlack.png" />
        <p class="mx-2">還</p>
        <p class="mx-2">車</p>
      </span>
      <label for="check" class="absolute h-full w-full cursor-pointer rounded-full"></label>
    </div>
    <div class="invisible hidden w-20"></div>

    <div class="mx-4 h-11 w-40 lg:mx-24 xl:flex"></div>
  </HeaderComponent>
  <body class="bg-custom-gray">
    <div class="relative z-10">
      <!-- 搜索框容器 -->
      <div class="absolute left-1/2 top-20 flex -translate-x-1/2 items-center">
        <!-- 輸入框 -->
        <input
          type="text"
          id="search"
          class="h-[46px] w-[305px] rounded-l-lg p-2.5 font-google text-[17px] text-black shadow-custom-shadow lg:w-[400px]"
          placeholder="尋找站點"
          required
        />
        <!-- 搜索按鈕 -->
        <button
          class="flex h-[46px] w-[46px] items-center justify-center rounded-r-lg bg-black shadow-custom-shadow"
        >
          <img src="/assets/search.png" class="h-[24px] w-[24px]" />
        </button>
      </div>
    </div>
    <button
      class="absolute bottom-24 right-20 z-10 flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-black xl:bottom-11"
    >
      <img src="/assets/GPS.png" />
      <p class="top-1 text-xs text-white">附近</p>
    </button>
    <div id="map" style="width: 100%; height: 100vh" />
  </body>
  <FooterComponent>
    <div
      :class="[
        'flex h-full w-2/4 items-center justify-center font-google text-lg font-black',
        currentCategory === 'rent' ? 'text-black' : 'text-white',
      ]"
      @click="toggleImage('rent')"
    >
      <img :src="currentCategory === 'rent' ? bikeBlack : bikeWhite" />
      <p class="mx-2">租</p>
      <p class="mx-2">車</p>
    </div>
    <div
      :class="[
        'flex h-full w-2/4 items-center justify-center font-google text-lg font-black',
        currentCategory === 'return' ? 'text-black' : 'text-white',
      ]"
      @click="toggleImage('return')"
    >
      <img :src="currentCategory === 'return' ? parkingYellow : parkingWhite" />
      <p class="mx-2">還</p>
      <p class="mx-2">車</p>
    </div>
  </FooterComponent>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import parkingWhite from '@/assets/parkingWhite.png';
import parkingYellow from '@/assets/parkingYellow.png';
import bikeWhite from '@/assets/bikeWhite.png';
import bikeBlack from '@/assets/bikeBlack.png';
let map: google.maps.Map;
const currentCategory = ref('rent');
const isChecked = ref(false);
const runtimeConfig = useRuntimeConfig();
function toggleCategory() {
  currentCategory.value = isChecked.value ? 'return' : 'rent';
}

function toggleImage(category: string) {
  currentCategory.value = category;
}

async function initMap(): Promise<void> {
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    'marker',
  )) as google.maps.MarkerLibrary;

  map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: { lat: 23.553118, lng: 121.0211025 },
    zoom: 7,
    mapId: 'DEMO_MAP_ID',
  });
}

onMounted(async () => {
  const loader = new Loader({
    apiKey: runtimeConfig.public.googleMapsApiKey,
    version: 'weekly',
  });
  const { Autocomplete, PlacesService, Place } = await loader.importLibrary('places');
  try {
    await initMap();
  } catch (e) {
    console.error('Error loading Google Maps API:', e);
  }
});
</script>
