<template>
  <NuxtLayout>
    <HeaderComponent>
      <div>
        <select
          v-model="selectCity"
          @change="fetchRoadData"
          class="mx-4 h-11 w-40 cursor-pointer rounded-md bg-black px-4 py-2 font-google text-sm font-normal text-white lg:mx-24"
        >
          <option disabled value="">選擇城市</option>
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </HeaderComponent>
    <div v-if="roadData.length">
      <div class="mx-24 my-10 flex h-20 flex-wrap items-center justify-center">
        <div v-for="item in roadData" :key="item.RouteName" class="card">
          <div
            class="m-1 flex h-[86px] w-[362px] gap-2 rounded-md bg-white p-3 shadow-custom-shadow"
          >
            <div class="h-[79px] w-[362px]">
              <div class="font-google text-base font-bold not-italic">{{ item.RouteName }}</div>
              <div
                class="my-2 flex flex-row justify-between text-xs font-normal not-italic text-custom-gray-text"
              >
                <div>{{ item.Direction }} {{ item.CyclingLength }} 公里</div>
                <div class="flex justify-between">
                  <img src="~/assets/Vector.png" class="mx-2" />
                  <NuxtLink to="roadMap" @click="saveRouteData(item.RouteName, item.Geometry)">
                    <p class="cursor-pointer hover:text-custom-yellow">
                      {{ item.City }}
                    </p>
                  </NuxtLink>
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const runtimeConfig = useRuntimeConfig();
let authHeader: any = null;
const selectCity = ref('');
const roadData = ref<RoadDataItem[]>([]);

interface RoadDataItem {
  RouteName: string;
  Direction: string;
  CyclingLength: number;
  City: string;
  Geometry: string;
}

const options = ref([
  { text: '臺中市', value: 'Taichung' },
  { text: '基隆市', value: 'Keelung' },
  { text: '新竹縣', value: 'HsinchuCounty' },
  { text: '苗栗縣', value: 'MiaoliCounty' },
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
  { text: '臺北市', value: 'TAIPEI' },
  { text: '桃園市', value: 'Taoyuan' },
  { text: '高雄市', value: 'Kaohsiung' },
  { text: '台南市', value: 'Tainan' },
]);

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

async function fetchRoadData() {
  if (selectCity.value === '') return;
  try {
    const accessTokenData = await getAuthorizationHeader();
    const accessToken = accessTokenData.access_token;
    const data: RoadDataItem[] = await $fetch(
      `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${selectCity.value}?%24top=30&%24format=JSON`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    roadData.value = data.map((item: RoadDataItem) => ({
      RouteName: item.RouteName,
      Direction: item.Direction,
      CyclingLength: parseFloat((item.CyclingLength / 1000).toFixed(1)),
      City: item.City,
      Geometry: item.Geometry,
    }));

    saveToLocalStorage(selectCity.value, roadData.value);
  } catch (error) {
    console.error('Error fetching road data:', error);
    roadData.value = [];
  }
}

function saveToLocalStorage(city: string, data: RoadDataItem[]) {
  const storageKey = `roadData_${city}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadFromLocalStorage(city: string) {
  const storageKey = `roadData_${city}`;
  const storageData = localStorage.getItem(storageKey);
}

function saveRouteData(name: string, geometry: string) {
  localStorage.setItem('selectedRouteName', name);
  localStorage.setItem('selectedRouteGeometry', geometry);
}

onMounted(() => {
  if (selectCity.value) {
    loadFromLocalStorage(selectCity.value);
  }
});
</script>
