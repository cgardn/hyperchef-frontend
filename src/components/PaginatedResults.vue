<template>
  <div class="container">
    <div class="row mb-3">
      <div :class="{'col-8' : isFiltersVisible, 'col-2' : !isFiltersVisible}">
        <slot name="filterButtons"></slot>
      </div>
      <div class="col my-auto text-light text-right">
        <button
          v-if="!isFiltersVisible"
          type="button"
          class="btn btn-light mr-0"
          @click="prevPage"
          :disabled="this.pageEnd/this.resultsPerPage <= 1"
          >&#8592;</button>
        <span v-if="!isFiltersVisible">
          {{this.currentPage}} of {{this.pageCount}}
        </span>
        <button
          v-if="!isFiltersVisible"
          type="button"
          class="btn btn-light ml-0"
          @click="nextPage"
          :disabled="this.pageEnd/this.resultsPerPage >= this.pageCount"
          >&#8594;</button>
        <span
          class="text-dark"
          :class="{topFix : !isFiltersVisible}"
        >
          {{this.recipeBatch.length}} results
        </span>
      </div>
    </div>
    <slot name="filterPanel" v-if="isFiltersVisible"></slot>
    <div class="row custom-overflow" v-else>
      <div
        class="col mb-4"
        align="center"
        v-for="(eachRecipe, idx) in visibleRecipes"
        :key="idx"
      >
        <RecipeItem :recipe="eachRecipe"></RecipeItem>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeItem from '@/components/RecipeItem'

export default {
  name: "PaginatedResults",
  components: {
    RecipeItem,
  },
  props: ["recipeBatch", "recipeCount", "isFiltersVisible"],
  data: function() {
    return {
      resultsPerPage: 25,
      pageStart: 0,
    }
  },
  computed: {
    visibleRecipes: function() {
      return this.recipeBatch.slice(this.pageStart, this.pageEnd);
    },
    currentPage: function() {
      return Math.floor(this.pageEnd/this.resultsPerPage)

    },
    pageEnd: function() {
      return this.pageStart + Number(this.resultsPerPage);
    },
    pageCount: function() {
      let total = this.recipeBatch.length;
      // 1. subtract remainder and divide by per-page count for # of whole pages
      // 2. (Math.ceil op) add 1 page if remainder is larger than 0, to catch the 
      //    leftovers
      return (( total - (total % this.resultsPerPage)) / this.resultsPerPage) + Math.ceil((total % this.resultsPerPage / (this.resultsPerPage + 1)))
    },
  },
  watch: {
    resultsPerPage: function(newVal) {
      this.resultsPerPage = Number(newVal);
    }
  },
  methods: {
    setResultsPerPage: function(newAmt) {
      this.resultsPerPage = newAmt;
    },
    nextPage: function() {
      this.pageStart += this.resultsPerPage;
    },
    prevPage: function() {
      this.pageStart -= this.resultsPerPage;
      this.pageStart < 0 ? this.pageStart = 0 : this.pageStart;
      this.pageEnd < this.resultsPerPage ? this.pageEnd = this.resultsPerPage : this.pageEnd;
    },
  },
}
</script>

<style scoped>
.topFix {
  position: relative;
  top: 2px;
}
.custom-overflow {
  height: 70vh;
  overflow-y: scroll;
}
</style>
