<template>
  <table class="text-white">
    <thead class="select-none">
      <tr class="bg-blue-900 border-b-2 border-gray-800">
        <th></th>
        <th
          @click="sortBy('rank')"
          class=" cursor-pointer"
          :class="{
            up: this.sortCriteria === 'rank' && sortDirectionUp,
            down: this.sortCriteria === 'rank' && !sortDirectionUp
          }"
        >
          <span>Ranking</span>
        </th>
        <th
          @click="sortBy('name')"
          class=" cursor-pointer"
          :class="{
            up: this.sortCriteria === 'name' && sortDirectionUp,
            down: this.sortCriteria === 'name' && !sortDirectionUp
          }"
        >
          Nombre
        </th>
        <th
          @click="sortBy('priceUsd')"
          class=" cursor-pointer"
          :class="{
            up: this.sortCriteria === 'priceUsd' && sortDirectionUp,
            down: this.sortCriteria === 'priceUsd' && !sortDirectionUp
          }"
        >
          Precio
        </th>
        <th
          @click="sortBy('marketCapUsd')"
          class=" cursor-pointer"
          :class="{
            up: this.sortCriteria === 'marketCapUsd' && sortDirectionUp,
            down: this.sortCriteria === 'marketCapUsd' && !sortDirectionUp
          }"
        >
          Cap. de Mercado
        </th>
        <th
          @click="sortBy('changePercent24Hr')"
          class=" cursor-pointer"
          :class="{
            up: this.sortCriteria === 'changePercent24Hr' && sortDirectionUp,
            down: this.sortCriteria === 'changePercent24Hr' && !sortDirectionUp
          }"
        >
          Variación 24hs
        </th>
        <td class="hidden sm:block">
          <input
            class="focus:outline-none focus:shadow-outline border border-white bg-transparent text-white rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            id="filter"
            placeholder="Buscar"
            type="text"
            autofocus
            autocomplete="off"
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="a in filteredAssets"
        :key="a.id"
        class="border-b border-gray-200 hover:bg-pink-800"
      >
        <td>
          <img
            v-show="a.isLoadedImg"
            v-if="!a.isErroredImg"
            class="w-8 h-8"
            :src="
              `https://static.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`
            "
            :alt="a.name"
            @load="onImgLoad(a)"
            @error="onImgError(a)"
          />
          <beat-loader
            v-show="!a.isLoadedImg && !a.isErroredImg"
            color="#90cdf4"
            :size="8"
          />
          <span v-show="a.isErroredImg">⚠</span>
        </td>
        <td>
          <b>{{ a.rank | rank }}</b>
        </td>
        <td>
          <router-link
            class="hover:underline text-blue-200"
            :to="{ name: 'coin-detail', params: { id: a.id } }"
            >{{ a.name }}</router-link
          >
          <small class="ml-2 text-blue-300">{{ a.symbol }}</small>
        </td>
        <td>
          {{ a.priceUsd | dollar }}
        </td>
        <td>
          {{ a.marketCapUsd | dollar }}
        </td>
        <td
          :class="
            a.changePercent24Hr.includes('-') ? 'text-red-600' : 'text-white'
          "
        >
          {{ a.changePercent24Hr | percent }}
        </td>
        <td class="hidden sm:block">
          <px-button @custom-click="goToCoin(a.id)">
            <span>Detalles</span>
          </px-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PxButton from "@/components/PxButton";

export default {
  name: "PxAssetsTable",

  components: {
    PxButton
  },

  props: {
    assets: {
      type: Array,
      default: () => []
    },
    sortDirectionUp: {
      type: Boolean,
      default: true
    },
    sortCriteria: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      filter: ""
    };
  },

  computed: {
    currentCriteriaIsUp(criteria) {
      if (this.sortCriteria === criteria) return this.isDirectionUp;

      return null;
    },
    filteredAssets() {
      return this.assets.filter(
        v =>
          v.name.toLowerCase().includes(this.filter.toLowerCase()) ||
          v.symbol.toLowerCase().includes(this.filter.toLowerCase())
      );
    }
  },

  methods: {
    goToCoin(id) {
      this.$router.push({ name: "coin-detail", params: { id } });
    },

    sortBy(criteria) {
      this.$emit("sort", { criteria, directionUp: this.sortDirectionUp });
    },

    onImgLoad(a) {
      this.$set(a, "isLoadedImg", true);
    },

    onImgError(a) {
      console.log(a.name, "onError");
      this.$set(a, "isErroredImg", true);
    }
  }
};
</script>

<style scoped>
.up::before {
  content: "⬆";
  padding-right: 10px;
}

.down::before {
  content: "⬇";
  padding-right: 10px;
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
