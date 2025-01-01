<template>
  <NuxtLayout>
    <HeaderComponent>
      <p class="mx-4 px-6 py-2 font-google text-base font-normal">{{ selectedName }}</p>
      <div class="mx-4 h-11 w-11 sm:hidden"></div>
    </HeaderComponent>
    <div class="bg-custom-gray">
      <div id="map" style="width: 100%; height: 100vh"></div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
const selectedName = ref('');
const PositionLat = ref(0);
const PositionLon = ref(0);
const runtimeConfig = useRuntimeConfig();

let map: google.maps.Map;

const Name = localStorage.getItem('selectedName');
const storedLat = localStorage.getItem('selectedPositionLat');
const storedLon = localStorage.getItem('selectedPositionLon');
Name ? (selectedName.value = Name) : (selectedName.value = 'No Name');
PositionLat.value = storedLat ? parseFloat(storedLat) : 0;
PositionLon.value = storedLon ? parseFloat(storedLon) : 0;

async function initMap(): Promise<void> {
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    'marker',
  )) as google.maps.MarkerLibrary;

  map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: { lat: PositionLat.value, lng: PositionLon.value },
    zoom: 18,
    mapId: 'DEMO_MAP_ID',
  });

  new AdvancedMarkerElement({
    position: { lat: PositionLat.value, lng: PositionLon.value },
    map: map,
    title: selectedName.value,
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
