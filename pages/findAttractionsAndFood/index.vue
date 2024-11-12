<template>
  <NuxtLayout>
    <div class="min-h-screen bg-custom-gray">
      <HeaderComponent />
      <div>
        <div class="mx-24 my-10 flex h-20 flex-wrap items-center justify-center">
          <div class="card">
            <div
              class="m-1 flex h-[150px] w-[362px] gap-2 rounded-md bg-white p-3 shadow-custom-shadow"
            >
              <div class="flex w-full flex-row">
                <div>
                  <img class="h-32 rounded-md" src="/assets/attraction.png" />
                </div>
                <div class="relative flex w-full flex-col">
                  <div class="absolute right-0 text-sm font-normal text-custom-yellow">
                    {{ '1.1km' }}
                  </div>
                  <div class="mt-8 flex">
                    <div class="mx-4 font-google text-base font-bold not-italic">
                      {{ '國立故宮博物院' }}

                      <div
                        class="mt-8 flex-row justify-between text-xs font-normal not-italic text-custom-gray-text"
                      >
                        <div class="flex">
                          <img src="~/assets/tel.png" />
                          <p class="flex items-center justify-center">02-28812102</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let authHeader: any = null;
const runtimeConfig = useRuntimeConfig();
const selectCity = ref('');

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
</script>
