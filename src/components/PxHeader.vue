<template>
  <header class="shadow">
    <nav>
      <nav class="flex items-center gap-2 flex-wrap bg-gray-900 p-6">
        <router-link
            :to="{ name: 'home' }"
        >
          <img src="../../public/favicon.png" class="h-16 w-16" height="176" width="201"/>
        </router-link>
        <div>

          <div class="flex items-center flex-shrink-0 text-white mr-6">
            <router-link
                :to="{ name: 'home' }"
                class="font-semibold text-xl tracking-tight"
            >Cryptic
            </router-link
            >
          </div>
          <div
              class="hidden sm:block w-full flex-grow lg:flex lg:items-center lg:wauto"
          >
            <div class="text-sm lg:flex-grow">
              <router-link
                  v-for="l in links"
                  :key="l.title"
                  :to="l.to"
                  class="block mt-4 lg:inline-block lg:mt-0 text-blue-300 hover:text-white mr-4"
              >
                {{ l.title }}
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </nav>
  </header>
</template>

<script>
// import PxIcon from "@/components/PxIcon";

export default {
  name: "PxHeader",
  // components: { PxIcon }
  data() {
    return {
      links: [
        {
          title: "BTC",
          to: {name: "coin-detail", params: {id: "bitcoin"}}
        },
        {
          title: "ETH",
          to: {name: "coin-detail", params: {id: "ethereum"}}
        },
        {
          title: "USDT",
          to: {name: "coin-detail", params: {id: "tether"}}
        },
        {
          title: "XRP",
          to: {name: "coin-detail", params: {id: "xrp"}}
        }
      ]
    };
  }
};
</script>
