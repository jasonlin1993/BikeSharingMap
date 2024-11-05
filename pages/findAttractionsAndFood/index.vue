<template>
  <NuxtLayout>
    <div class="min-h-screen bg-custom-gray">
      <HeaderComponent />
      <div>
        <div class="mx-24 my-10 flex h-20 flex-wrap items-center justify-center">
          <div class="card">
            <div
              class="m-1 flex h-[143px] w-[362px] gap-2 rounded-md bg-white p-3 shadow-custom-shadow"
            >
              <div class="h-[79px] w-[362px]">
                <div class="flex flex-col items-end">
                  <div class="text-sm font-normal text-custom-yellow">
                    {{ '1.1km' }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-google text-base font-bold not-italic">
                    {{ '國立故宮博物院' }}
                  </div>
                  <div
                    class="my-2 flex flex-row justify-between text-xs font-normal not-italic text-custom-gray-text"
                  >
                    <div class="flex">
                      <img src="~/assets/tel.png" class="mx-2" />
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
  </NuxtLayout>
</template>
