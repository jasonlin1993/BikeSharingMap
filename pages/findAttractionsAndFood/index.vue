<template>
  <NuxtLayout>
    <HeaderComponent>
      <div
        class="relative hidden h-10 w-72 cursor-pointer rounded-full bg-white font-google text-base font-normal leading-5 lg:hidden xl:flex"
      >
        <input
          type="checkbox"
          id="check"
          class="peer hidden"
          v-model="isChecked"
          @change="toggleCategory"
        />

        <!-- 黑色背景 -->
        <div
          class="absolute flex h-full w-1/2 items-center justify-center rounded-full bg-black transition-transform duration-500 peer-checked:translate-x-full"
        ></div>

        <!-- 景點（黃色文字 + 圖片） -->
        <span
          class="absolute bottom-1/4 left-[10%] top-1/4 flex items-center font-google text-lg font-black text-custom-yellow transition-opacity duration-300 peer-checked:opacity-0"
        >
          <img src="/assets/attractionYellow.png" />
          <p class="mx-2">景</p>
          <p class="mx-2">點</p>
        </span>
        <!-- 美食（黃色文字 + 圖片） -->
        <span
          class="absolute bottom-1/4 right-[10%] top-1/4 hidden items-center font-google text-lg font-black text-custom-yellow duration-300 peer-checked:flex"
        >
          <img src="/assets/foodYellow.png" />
          <p class="mx-2">美</p>
          <p class="mx-2">食</p>
        </span>
        <!-- 景點（黑色文字 + 圖片） -->
        <span
          class="absolute bottom-1/4 left-[10%] top-1/4 hidden items-center justify-center font-google text-lg font-black text-black peer-checked:flex"
        >
          <img src="/assets/attractionBlack.png" />
          <p class="mx-2">景</p>
          <p class="mx-2">點</p>
        </span>
        <!-- 美食（黑色文字 + 圖片） -->
        <span
          class="absolute bottom-1/4 right-[10%] top-1/4 flex items-center justify-center font-google text-lg font-black text-black peer-checked:opacity-0"
        >
          <img src="/assets/foodBlack.png" />
          <p class="mx-2">美</p>
          <p class="mx-2">食</p>
        </span>
        <label for="check" class="absolute h-full w-full cursor-pointer rounded-full"></label>
      </div>
      <div class="invisible hidden w-20"></div>

      <select
        v-model="selectCity"
        class="mx-4 h-11 w-40 cursor-pointer rounded-md bg-black px-4 py-2 font-google text-sm font-normal text-white lg:mx-24 xl:flex"
      >
        <option disabled value="">選擇城市</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </HeaderComponent>

    <div class="min-h-screen">
      <div v-if="selectCity" class="mx-24 my-10 flex flex-wrap items-center justify-center">
        <div v-for="item in DataItem" :key="item.Name" class="card">
          <NuxtLink
            to="attractionAndFoodDescription"
            @click="
              saveAttractionDataToLocalStorage(
                item.Name,
                item.DescriptionDetail,
                item.OpenTime,
                item.Phone,
                item.Picture.PictureUrl1 || '',
                item.Position.PositionLon,
                item.Position.PositionLat,
                item.Position.GeoHash,
                item.Distance || '',
                item.Address || '',
              )
            "
          >
            <div
              class="hover: m-1 flex h-[150px] w-[362px] -translate-y-2 transform gap-2 rounded-md bg-white p-3 shadow-custom-shadow transition duration-300 hover:cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-custom-yellow"
            >
              <div class="flex w-full flex-row">
                <div>
                  <img class="h-32 rounded-md" :src="item.Picture.PictureUrl1" alt="Image" />
                </div>
                <div class="relative flex w-full flex-col">
                  <div class="absolute right-0 text-sm font-normal text-custom-yellow">
                    {{ item.Distance }}
                  </div>
                  <div class="mt-8 flex">
                    <div class="mx-4 font-google text-base font-bold not-italic">
                      {{ item.Name }}

                      <div
                        class="mt-8 flex-row justify-between text-xs font-normal not-italic text-custom-gray-text"
                      >
                        <div class="flex items-center">
                          <img src="~/assets/Call.png" class="mx-2" />
                          <p class="flex items-center justify-center">{{ item.Phone }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div
        v-else
        class="absolute left-[89px] top-[150px] font-google text-lg font-normal text-custom-gray-text"
      >
        尚未選擇任何縣市
      </div>
    </div>
    <FooterComponent>
      <div
        :class="[
          'flex h-full w-2/4 items-center justify-center font-google text-lg font-black',
          currentCategory === 'attraction' ? 'text-black' : 'text-white',
        ]"
        @click="toggleImage('attraction')"
      >
        <img :src="currentCategory === 'attraction' ? attractionBlackImg : attractionWhiteImg" />
        <p class="mx-2">景</p>
        <p class="mx-2">點</p>
      </div>
      <div
        :class="[
          'flex h-full w-2/4 items-center justify-center font-google text-lg font-black',
          currentCategory === 'food' ? 'text-black' : 'text-white',
        ]"
        @click="toggleImage('food')"
      >
        <img :src="currentCategory === 'food' ? foodBlackImg : foodWhiteImg" />
        <p class="mx-2">美</p>
        <p class="mx-2">食</p>
      </div>
    </FooterComponent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

import attractionBlackImg from '@/assets/attractionBlack.png';
import attractionWhiteImg from '@/assets/attractionWhite.png';
import foodWhiteImg from '@/assets/foodWhite.png';
import foodBlackImg from '@/assets/foodBlack.png';

let authHeader: any = null;
const runtimeConfig = useRuntimeConfig();
const selectCity = ref('');
const DataItem = ref<ApiDataItem[]>([]);
const cache: Record<string, ApiDataItem[]> = {};
const userPosition = ref({ lat: 0, lon: 0 });
const currentCategory = ref('attraction');
const isChecked = ref(false);

interface ApiDataItem {
  Name: string;
  DescriptionDetail: string;
  Description: string;
  Phone: string;
  OpenTime: string;
  Address: string;
  Picture: {
    PictureUrl1?: string;
    PictureDescription1?: string;
    PictureUrl?: string;
    PictureDescription?: string;
  };

  Position: {
    PositionLon: number;
    PositionLat: number;
    GeoHash: string;
  };
  Distance?: string;
}

function toggleCategory() {
  currentCategory.value = isChecked.value ? 'food' : 'attraction';
}

function toggleImage(category: string) {
  currentCategory.value = category;
}

watch([currentCategory, selectCity], ([newCategory, newCity], [oldCategory, oldCity]) => {
  if (newCategory !== oldCategory || newCity !== oldCity) {
    fetchAttractionAndFood();
  }
});

const options = ref([
  { text: '臺中市', value: 'Taichung' },
  { text: '彰化縣', value: 'ChanghuaCounty' },
  { text: '雲林縣', value: 'YunlinCounty' },
]);

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(1) + ' km';
}

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

async function fetchAttractionAndFood() {
  if (selectCity.value === '') return;

  const cacheKey = `${selectCity.value}-${currentCategory.value}`;
  if (cache[cacheKey]) {
    DataItem.value = cache[cacheKey];
    return;
  }
  try {
    const accessTokenData = await getAuthorizationHeader();
    const accessToken = accessTokenData.access_token;

    const endpoint =
      currentCategory.value === 'attraction'
        ? `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${selectCity.value}?%24top=20&%24format=JSON`
        : `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/${selectCity.value}?%24top=20&%24format=JSON`;
    const rawData: ApiDataItem[] = await $fetch<ApiDataItem[]>(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const filteredData = rawData
      .filter((item: any) => {
        const name =
          currentCategory.value === 'attraction' ? item.ScenicSpotName : item.RestaurantName;
        return item.Picture?.PictureUrl1 && name;
      })
      .map((item: any) => {
        const name =
          currentCategory.value === 'attraction' ? item.ScenicSpotName : item.RestaurantName;
        const description =
          currentCategory.value === 'attraction' ? item.DescriptionDetail : item.Description;

        const distance = calculateDistance(
          userPosition.value.lat,
          userPosition.value.lon,
          item.Position.PositionLat,
          item.Position.PositionLon,
        );

        const phone = (item.Phone || '').replace(/^886-/, '0');
        const openTime = item.OpenTime || '';
        const address = item.Address || '';

        return {
          Name: name,
          DescriptionDetail: description || '',
          Phone: phone,
          OpenTime: openTime,
          Address: address,
          Picture: {
            PictureUrl1: item.Picture.PictureUrl1 || '',
            PictureDescription1: item.Picture.PictureDescription1 || '',
          },
          Position: {
            PositionLon: item.Position.PositionLon || 0,
            PositionLat: item.Position.PositionLat || 0,
            GeoHash: item.Position.GeoHash || '',
          },
          Distance: distance,
        } as ApiDataItem;
      });
    cache[cacheKey] = filteredData as ApiDataItem[];
    DataItem.value = filteredData as ApiDataItem[];
  } catch (error) {
    console.error('Error fetching road data:', error);
  }
}

function getUserPosition() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userPosition.value.lat = position.coords.latitude;
      userPosition.value.lon = position.coords.longitude;
    },
    (error) => {
      console.error('Error getting user position:', error);
    },
  );
}

function saveAttractionDataToLocalStorage(
  Name: string,
  Description: string,
  OpenTime: string,
  Phone: string,
  PictureUrl: string,
  PositionLon: number,
  PositionLat: number,
  GeoHash: string,
  Distance: string,
  Address: string,
) {
  localStorage.setItem('selectedName', Name);
  localStorage.setItem('selectedDescription', Description);
  localStorage.setItem('selectedOpenTime', OpenTime);
  localStorage.setItem('selectedPhone', Phone);
  localStorage.setItem('selectedPictureUrl', PictureUrl);
  localStorage.setItem('selectedPositionLon', PositionLon.toString());
  localStorage.setItem('selectedPositionLat', PositionLat.toString());
  localStorage.setItem('selectedGeoHash', GeoHash);
  localStorage.setItem('selectedDistance', Distance);
  localStorage.setItem('selectedAddress', Address);
}

onMounted(() => {
  getUserPosition();
});
</script>
