<template>
  <div>
    <bounce-loader :loading="isLoading" :color="loaderColor" :size="100" />
    <px-assets-table
      v-if="!isLoading"
      :assets="assets"
      :sortDirectionUp="sortDirectionUp"
      :sortCriteria="sortCriteria"
      @sort="sortBy"
    />
  </div>
</template>

<script>
import PxAssetsTable from "@/components/PxAssetsTable";
import api from "@/services/api";

export default {
  name: "Home",

  components: { PxAssetsTable },

  data() {
    return {
      assets: [],
      isLoading: false,
      loaderColor: "#90cdf4",
      sortCriteria: "rank",
      sortDirectionUp: true
    };
  },

  methods: {
    sortBy({ criteria, directionUp }) {
      console.log("Ordenando", criteria, directionUp);

      if (this.sortCriteria === criteria) {
        this.sortDirectionUp = !directionUp;
      } else {
        this.sortCriteria = criteria;
        this.sortDirectionUp = true;
      }

      this.assets.sort((a, b) => {
        const aNumber = Number(a[criteria]);
        const bNumber = Number(b[criteria]);
        if (aNumber && bNumber) {
          return aNumber - bNumber;
        }
        const aString = a[criteria].toLowerCase();
        const bString = b[criteria].toLowerCase();
        return aString < bString ? -1 : 1;
      });

      if (!this.sortDirectionUp) {
        this.assets.reverse();
      }
    }
  },
  async created() {
    this.isLoading = true;
    this.assets = await api.getAssets();
    this.isLoading = false;
  }
};
</script>
