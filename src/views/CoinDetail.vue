<template>
  <div class="flex-col text-white">
    <div class="flex justify-center">
      <bounce-loader :loading="isLoading" :color="loaderColor" :size="100" />
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <beat-loader v-show="isImgLoading" :color="loaderColor" :size="20" />
          <span v-show="isImgErrored" class="w-20 h-20 mr-5 text-5xl">⚠</span>
          <img
            v-show="!isImgLoading && !isImgErrored"
            :src="iconSrc"
            :alt="asset.name"
            class="w-20 h-20 mr-5 "
            ref="assetIcon"
            @error="onImgError"
            @load="onImgLoad"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2" :style="{ color: `${colors[0]}` }">{{
              asset.symbol
            }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="mr-10 uppercase">Ranking</b>
              <span>{{ asset.rank | rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="mr-10 uppercase">Variación 24hs</b>
              <span
                :class="
                  asset.changePercent24Hr.includes('-')
                    ? 'text-red-400'
                    : 'text-green-400'
                "
                >{{ asset.changePercent24Hr | percent }}</span
              >
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <px-button @custom-click="toggleFromUsd">
            {{ convertion }}
          </px-button>
          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                id="convertValue"
                type="number"
                :placeholder="`0.00  ${fromUsd ? 'USD' : asset.symbol}`"
                v-model="convertValue"
                class="text-center focus:outline-none focus:shadow-outline border border-white bg-transparent text-white rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span v-if="fromUsd" class="text-xl">
            {{ convertedValue }} {{ asset.symbol }}
          </span>
          <span v-else class="text-xl">
            {{ convertedValue | dollar }} USD
          </span>
        </div>
      </div>

      <area-chart
        class="my-10"
        :colors="colors"
        :min="min"
        :max="max"
        :data="history.map(h => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ m.priceUsd | dollar }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button @custom-click="getWebsite(m)" v-if="!m.url">
              <beat-loader
                v-if="m.isLoading"
                :color="`${colors[0]}`"
                :size="8"
              />
              <template v-else>Obtener link</template>
            </px-button>
            <a
              v-else
              class="hover:underline text-blue-200"
              target="_blank"
              :href="m.url"
            >
              {{ m.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from "@/services/api";
import AssetsMainColor from "@/assets/cryptoAssetColors";
import PxButton from "@/components/PxButton";

export default {
  components: { PxButton },
  name: "CoinDetail",

  data() {
    return {
      asset: {},
      history: [],
      markets: [],
      isLoading: false,
      isImgLoading: true,
      isImgErrored: false,
      loaderColor: "#90cdf4",
      convertValue: 0,
      fromUsd: true
    };
  },

  computed: {
    convertion() {
      return this.fromUsd
        ? `USD to ${this.asset.symbol}`
        : `${this.asset.symbol} to USD`;
    },
    convertedValue() {
      if (!this.convertValue) {
        return "0.00";
      }
      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;

      const decimalPart = result.toString().split(".")[1];
      let fixedTo = 0;
      if (decimalPart) {
        const decimalPartAsArray = decimalPart.split("");
        const firstDigitNonZero = decimalPartAsArray.filter(v => Number(v))[0];
        fixedTo = decimalPartAsArray.indexOf(firstDigitNonZero);
      }

      return result.toFixed(fixedTo + 2).toString();
    },
    colors() {
      return [AssetsMainColor[this.asset.symbol.toLowerCase()] || "orange"];
    },
    iconSrc() {
      return `https://static.coincap.io/assets/icons/${this.asset.symbol.toLowerCase()}@2x.png`;
    },
    min() {
      return Math.min(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    max() {
      return Math.max(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    avg() {
      return Math.abs(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      );
    }
  },

  created() {
    this.getCoin();
  },

  methods: {
    toggleFromUsd() {
      this.fromUsd = !this.fromUsd;
    },
    async getWebsite(exchange) {
      this.$set(exchange, "isLoading", true);

      const data = await api.getExchange(exchange.exchangeId);
      this.$set(exchange, "url", data.exchangeUrl);

      this.$set(exchange, "isLoading", false);
    },

    getCoin() {
      const { id } = this.$route.params;

      this.isLoading = true;
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id)
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset;
          this.history = history;
          this.markets = markets;
        })
        .catch(e => {
          console.log(e.message);
          console.error("Una llamada fallo.");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    onImgLoad() {
      this.isImgLoading = false;
    },
    onImgError() {
      this.isImgLoading = false;
      this.isImgErrored = true;
    }
  },
  watch: {
    $route() {
      this.getCoin();
    }
  }
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
