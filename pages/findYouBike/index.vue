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
    <div class="relative z-10"></div>
    <button
      class="absolute bottom-24 right-20 z-10 flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-black xl:bottom-11"
      @click="goToCurrentLocation"
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
import rentYellowIcon from '@/assets/rentYellow.svg';
import returnBlackIcon from '@/assets/returnBlack.svg';
import zeroGrayIcon from '@/assets/zeroBikeGray.svg';

let map: google.maps.Map, infoWindow: google.maps.InfoWindow;
let data: bikeStation[] = []; //全域共享的站點資料
let filterData: bikeAvailability[] = []; //全域共享的篩選資料
let markers: CustomMarker[] = [];

const selectedName = ref('Default Name');
const currentCategory = ref('rent');
const isChecked = ref(false);
const runtimeConfig = useRuntimeConfig();

const rentContent = document.createElement('div');
const rentYellowImg = document.createElement('img');
rentYellowImg.src = rentYellowIcon;
rentYellowImg.style.width = '36px';
rentYellowImg.style.height = '50px';
rentContent.appendChild(rentYellowImg);

const returnContent = document.createElement('div');
const returnBlackImg = document.createElement('img');
returnBlackImg.src = returnBlackIcon;
returnBlackImg.style.width = '36px';
returnBlackImg.style.height = '50px';
returnContent.appendChild(returnBlackImg);

const zeroBikeContent = document.createElement('div');
const zeroBikeGrayImg = document.createElement('img');
zeroBikeGrayImg.src = zeroGrayIcon;
zeroBikeGrayImg.style.width = '36px';
zeroBikeGrayImg.style.height = '50px';
zeroBikeContent.appendChild(zeroBikeGrayImg);

interface bikeStation {
  StationUID: string;
  StationID: string;
  AuthorityID: string;
  StationName: {
    Zh_tw: string;
    En: string;
  };
  StationPosition: {
    PositionLon: number;
    PositionLat: number;
    GeoHash: string;
  };
  StationAddress: {
    Zh_tw: string;
    En: string;
  };
  BikesCapacity: number;
  ServiceType: number;
  SrcUpdateTime: string;
  UpdateTime: string;
}

interface bikeAvailability {
  StationUID: string;
  StationID: string;
  ServiceStatus: number;
  ServiceType: number;
  AvailableRentBikes: number;
  AvailableReturnBikes: number;
  SrcUpdateTime: string;
  UpdateTime: string;
  AvailableRentBikesDetail: {
    GeneralBikes: number;
    ElectricBikes: number;
  };
  StationName?: {
    Zh_tw: string;
    En: string;
  };
  StationAddress?: {
    Zh_tw: string;
    En: string;
  };
  StationPosition?: {
    PositionLon: number;
    PositionLat: number;
    GeoHash: string;
  };
}

class CustomMarker extends google.maps.OverlayView {
  position: google.maps.LatLng;
  map: google.maps.Map;
  container: HTMLElement;

  constructor(position: google.maps.LatLng, map: google.maps.Map, content: HTMLElement) {
    super();
    this.position = position;
    this.map = map;
    this.container = content;
    this.setMap(map); // 將標記添加到地圖
  }

  override onAdd() {
    const panes = this.getPanes();
    panes?.overlayMouseTarget.appendChild(this.container);
  }

  override draw() {
    const projection = this.getProjection();
    const position = projection.fromLatLngToDivPixel(this.position);

    if (position) {
      this.container.style.left = `${position.x - this.container.offsetWidth / 2}px`;
      this.container.style.top = `${position.y - this.container.offsetHeight}px`;
    }
  }

  override onRemove() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

async function initMap(): Promise<void> {
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    'marker',
  )) as google.maps.MarkerLibrary;

  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat, lng },
        zoom: 16,
        mapId: 'DEMO_MAP_ID',
      });

      new AdvancedMarkerElement({
        position: { lat, lng },
        map: map,
        title: selectedName.value,
      });

      getCombinedData(lat, lng);
    },
    (error: GeolocationPositionError) => {
      console.error('Error getting location:', error.message);
    },
  );

  // No need to return CustomMarker
}

let authHeader: null = null;
async function getAuthorizationHeader() {
  if (authHeader !== null) {
    return authHeader;
  }

  const parameters = {
    grant_type: 'client_credentials',
    client_id: runtimeConfig.public.tdxClientId,
    client_secret: runtimeConfig.public.tdxClientSecret,
  };

  const auth_url =
    'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
  const data: any = await $fetch(auth_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(parameters),
  });

  authHeader = data;

  return data;
}

async function getCombinedData(lat: number, lng: number) {
  if (!lat || !lng) {
    throw new Error('Latitude and Longitude are not provided');
  }

  const authHeader = await getAuthorizationHeader();
  const stationUrl = `https://tdx.transportdata.tw/api/advanced/v2/Bike/Station/NearBy?%24top=50&%24spatialFilter=nearby(${lat},${lng},1000)`;
  const availabilityUrl = `https://tdx.transportdata.tw/api/advanced/v2/Bike/Availability/NearBy?%24top=30&%24spatialFilter=nearby(${lat},${lng},1000)`;

  // 並行請求
  const [stationResponse, availabilityResponse] = await Promise.all([
    $fetch(stationUrl, { headers: { Authorization: `Bearer ${authHeader.access_token}` } }),
    $fetch(availabilityUrl, { headers: { Authorization: `Bearer ${authHeader.access_token}` } }),
  ]);

  // 解析回應
  const stations: bikeStation[] = stationResponse as bikeStation[];
  const availability: bikeAvailability[] = availabilityResponse as bikeAvailability[];

  console.log('租借站位資料', stations);
  console.log('車位資料', availability);

  // 更新全域變數
  data = stations;

  // 初始化篩選資料
  filterData = [];

  // 遍歷資料進行匹配與篩選
  availability.forEach((availableItem) => {
    const stationItem = data.find((station) => station.StationUID === availableItem.StationUID);

    if (stationItem) {
      // 更新 availableItem 的詳細資料
      availableItem.StationName = stationItem.StationName;
      availableItem.StationAddress = stationItem.StationAddress;
      availableItem.StationPosition = stationItem.StationPosition;

      // 檢查條件並加入篩選資料
      if (stationItem.StationName?.Zh_tw.includes('YouBike2.0')) {
        console.log('符合條件的資料:', availableItem);
        filterData.push(availableItem); // 加入篩選資料
      }
    }
  });

  console.log('篩選資料', filterData);

  if (filterData.length > 0) {
    addMarkersToMap(); // 根據篩選資料更新地圖標記
  }
}

// 切換租還車
function toggleCategory() {
  currentCategory.value = isChecked.value ? 'return' : 'rent';
  addMarkersToMap(); // 切換模式後重新渲染地圖標記
}

function toggleImage(category: string) {
  currentCategory.value = category;
  addMarkersToMap();
}

function goToCurrentLocation() {
  navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
    map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
  });
}

// 清除所有地圖標記
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

// 在地圖上添加標記
function addMarkersToMap() {
  clearMarkers();

  filterData.forEach((item) => {
    const position = new google.maps.LatLng(
      item.StationPosition?.PositionLat || 0,
      item.StationPosition?.PositionLon || 0,
    );

    const isRentMode = currentCategory.value === 'rent';
    const availableCount = isRentMode ? item.AvailableRentBikes : item.AvailableReturnBikes;

    // 建立容器並添加圖標與文字
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '36px';
    container.style.height = '50px';

    const iconImg = document.createElement('img');
    iconImg.src =
      availableCount > 0 ? (isRentMode ? rentYellowIcon : returnBlackIcon) : zeroGrayIcon;
    iconImg.style.width = '36px';
    iconImg.style.height = '50px';

    const countText = document.createElement('div');
    countText.textContent = availableCount.toString();
    countText.style.position = 'absolute';
    countText.style.top = '40%';
    countText.style.left = '50%';
    countText.style.transform = 'translate(-50%, -50%)';
    countText.style.color = availableCount > 0 ? (isRentMode ? 'black' : 'yellow') : 'gray';
    countText.style.fontWeight = 'bold';
    countText.style.fontSize = '15px';
    countText.style.textAlign = 'center';

    container.appendChild(iconImg);
    container.appendChild(countText);

    // 創建自定義標記
    const marker = new CustomMarker(position, map, container);
    markers.push(marker);
  });

  console.log(`已在地圖上添加 ${markers.length} 個標記`);
}

onMounted(async () => {
  const loader = new Loader({
    apiKey: runtimeConfig.public.googleMapsApiKey,
    version: 'weekly',
  });
  try {
    window.google.maps.Map; // 確保 Google Maps API 已經加載
    await initMap(); // 然後初始化地圖
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
  }
});
</script>
