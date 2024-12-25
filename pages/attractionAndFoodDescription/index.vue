<template>
  <HeaderComponent>
    <p class="mx-4 px-6 py-2 font-google text-base font-normal">{{ selectedName }}</p>
  </HeaderComponent>

  <div class="flex min-h-screen justify-center font-google">
    <div class="flex flex-col text-sm">
      <div
        class="mt-8 flex h-[370px] w-[544px] items-center justify-center rounded-md bg-white shadow-[0_3px_4px_rgba(0,0,0,0.1)]"
      >
        <div class="flex h-[330px] w-[500px] items-center justify-center">
          <img class="rounded-md" :src="selectedImage" />
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <img src="/assets/time.png" class="mx-1" alt="timeLogo" />
        <p>{{ selectedOpenTime }}</p>
      </div>
      <div class="mt-4 flex items-center">
        <img src="/assets/Call.png" class="mx-2" alt="telLogo" />
        <p>{{ selectedPhone }}</p>
      </div>
      <div class="mt-4 flex items-center">
        <img src="/assets//Vector.png" class="mx-2" alt="address" />
        <p>{{ selectedAddress }}</p>
        <NuxtLink to="/attractionAndFoodMap">
          <div
            class="mx-2.5 flex h-[25px] w-12 cursor-pointer items-center justify-center rounded-[50px] bg-[#FED801] font-google text-[13px] font-bold"
          >
            <p>地圖</p>
          </div>
        </NuxtLink>
      </div>
      <div class="mt-4 flex w-[544px] text-[#7A7A7A]">
        {{ selectedDescription }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const selectedName = ref('');
const selectedOpenTime = ref('');
const selectedPhone = ref('');
const selectedAddress = ref('');
const selectedDescription = ref('');
const selectedImage = ref('');

onMounted(async () => {
  const Name = localStorage.getItem('selectedName');
  const OpenTime = localStorage.getItem('selectedOpenTime');
  const Phone = localStorage.getItem('selectedPhone');
  const Address = localStorage.getItem('selectedAddress');
  selectedName.value = Name || '';
  selectedOpenTime.value = OpenTime || '';
  selectedPhone.value = (Phone || '').replace(/^886/, '0');
  selectedAddress.value = Address || '';
  selectedDescription.value = localStorage.getItem('selectedDescription') || '';
  selectedImage.value = localStorage.getItem('selectedPictureUrl') || '';
});
</script>
