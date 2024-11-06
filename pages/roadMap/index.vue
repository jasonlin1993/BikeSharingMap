<template>
  <HeaderComponent>
    <p class="mx-4 px-6 py-2 font-google text-lg font-normal">{{ routeName }}</p>
  </HeaderComponent>
  <body class="bg-custom-gray">
    <div id="map" style="width: 100%; height: 100vh"></div>
  </body>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import BeginIcon from '~/assets/BeginGPS.png';
import EndIcon from '~/assets/EndGPS.png';

const runtimeConfig = useRuntimeConfig();
const routeName = ref('');
let map: google.maps.Map;

function parseGeometry(geometry: string) {
  const coordinates: google.maps.LatLngLiteral[] = [];
  const pattern = /(\d+\.\d+)\s+(\d+\.\d+)/g;
  let match;

  while ((match = pattern.exec(geometry)) !== null) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    coordinates.push({ lat, lng });
  }

  return coordinates;
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

  const storedGeometry = localStorage.getItem('selectedRouteGeometry');
  if (storedGeometry) {
    const path = parseGeometry(storedGeometry);
    const routePolyline = new google.maps.Polyline({
      path: path,
      map: map,
      strokeColor: '#000000',
      strokeOpacity: 0,
      strokeWeight: 2,
      icons: [
        {
          icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
          offset: '0',
          repeat: '15px',
        },
      ],
    });

    const startContent = document.createElement('div');
    const startImg = document.createElement('img');
    startImg.src = BeginIcon;
    startImg.style.width = '36px';
    startImg.style.height = '50px';
    startContent.appendChild(startImg);

    const endContent = document.createElement('div');
    const endImg = document.createElement('img');
    endImg.src = EndIcon;
    endImg.style.width = '36px';
    endImg.style.height = '50px';
    endContent.appendChild(endImg);

    if (path.length > 0) {
      const startMarker = new AdvancedMarkerElement({
        position: path[0],
        map: map,
        content: startContent,
      });

      const endMarker = new AdvancedMarkerElement({
        position: path[path.length - 1],
        map: map,
        content: endContent,
      });
    }

    const bounds = new google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));

    map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
  }
}

onMounted(async () => {
  const storeName = localStorage.getItem('selectedRouteName');
  if (storeName) {
    routeName.value = storeName;
  }

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
