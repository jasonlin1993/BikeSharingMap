<template>
  <NuxtLayout>
    <HeaderComponent>
      <div
        class="relative hidden h-10 w-72 cursor-pointer rounded-full bg-white font-google text-base font-normal leading-5 md:hidden xl:flex"
      >
        <input type="checkbox" id="check" class="peer hidden" />

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
        @change="fetchAttractionAndFood"
        class="mx-4 hidden h-11 w-40 cursor-pointer rounded-md bg-black px-4 py-2 font-google text-sm font-normal text-white lg:mx-24 xl:flex"
      >
        <option disabled value="">選擇城市</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </HeaderComponent>

    <div class="min-h-screen">
      <div v-if="selectCity" class="mx-24 my-10 flex flex-wrap items-center justify-center">
        <div v-for="item in attractionData" :key="item.ScenicSpotName" class="card">
          <div
            class="hover: m-1 flex h-[150px] w-[362px] -translate-y-2 transform gap-2 rounded-md bg-white p-3 shadow-custom-shadow transition duration-300 ease-in-out hover:-translate-x-2 hover:cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-custom-yellow"
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
                    {{ item.ScenicSpotName }}

                    <div
                      class="mt-8 flex-row justify-between text-xs font-normal not-italic text-custom-gray-text"
                    >
                      <div class="flex">
                        <img src="~/assets/tel.png" />
                        <p class="flex items-center justify-center">{{ item.Phone }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      <div class="flex h-full w-2/4 items-center justify-center font-google text-lg font-black">
        <p class="mx-2">景</p>
        <p class="mx-2">點</p>
      </div>
      <div
        class="flex h-full w-2/4 items-center justify-center font-google text-lg font-black text-gray-50"
      >
        <p class="mx-2">美</p>
        <p class="mx-2">食</p>
      </div>
    </FooterComponent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let authHeader: any = null;
const runtimeConfig = useRuntimeConfig();
const selectCity = ref('');
const attractionData = ref<AttractionDataItem[]>([]);
const cache: Record<string, AttractionDataItem[]> = {};
const userPosition = ref({ lat: 0, lon: 0 });
const isSliding = ref(false);

function toggleSlide() {
  isSliding.value = !isSliding.value;
}

interface AttractionDataItem {
  ScenicSpotName: string;
  DescriptionDetail: string;
  Phone: string;
  Picture: {
    PictureUrl1: string;
    PictureDescription1: string;
  };

  Position: {
    PositionLon: number;
    PositionLat: number;
    GeoHash: string;
  };
  Distance?: string;
}

const options = ref([
  { text: '臺中市', value: 'Taichung' },
  { text: '基隆市', value: 'Keelung' },
  { text: '新竹縣', value: 'HsinchuCounty' },
  { text: '彰化縣', value: 'ChanghuaCounty' },
  { text: '新北市', value: 'NewTaipei' },
  { text: '南投縣', value: 'NantouCounty' },
  { text: '雲林縣', value: 'YunlinCounty' },
  { text: '嘉義縣', value: 'ChiayiCounty' },
  { text: '嘉義市', value: 'Chiayi' },
  { text: '屏東縣', value: 'PingtungCounty' },
  { text: '宜蘭縣', value: 'YilanCounty' },
  { text: '台東縣', value: 'TaitungCounty' },
  { text: '花蓮縣', value: 'HualienCounty' },
  { text: '金門縣', value: 'KinmenCounty' },
  { text: '花蓮縣', value: 'HualienCounty' },
  { text: '澎湖縣', value: 'PenghuCounty' },
  { text: '臺北市', value: 'Taipei' },
  { text: '桃園市', value: 'Taoyuan' },
  { text: '高雄市', value: 'Kaohsiung' },
  { text: '台南市', value: 'Tainan' },
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

  if (cache[selectCity.value]) {
    attractionData.value = cache[selectCity.value];
    return;
  }
  try {
    const accessTokenData = await getAuthorizationHeader();
    const accessToken = accessTokenData.access_token;
    const data: AttractionDataItem[] = await $fetch(
      `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${selectCity.value}?%24top=240&%24format=JSON`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const uniqueNames = new Set();

    const filteredData = data
      .filter((item: AttractionDataItem) => {
        if (item.Picture?.PictureUrl1 && !uniqueNames.has(item.ScenicSpotName)) {
          uniqueNames.add(item.ScenicSpotName);
          return true;
        }
        return false;
      })
      .map((item: AttractionDataItem) => {
        const distance = calculateDistance(
          userPosition.value.lat,
          userPosition.value.lon,
          item.Position.PositionLat,
          item.Position.PositionLon,
        );
        return {
          ScenicSpotName: item.ScenicSpotName,
          DescriptionDetail: item.DescriptionDetail,
          Phone: item.Phone.replace(/^886-/, '0'),
          Picture: {
            PictureUrl1: item.Picture.PictureUrl1,
            PictureDescription1: item.Picture.PictureDescription1,
          },
          Position: {
            PositionLon: item.Position.PositionLon,
            PositionLat: item.Position.PositionLat,
            GeoHash: item.Position.GeoHash,
          },
          Distance: distance,
        };
      });
    cache[selectCity.value] = filteredData;
    attractionData.value = filteredData;
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

onMounted(() => {
  getUserPosition();
});
</script>
