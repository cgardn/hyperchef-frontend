<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col-5 offset-1 col-md-2 offset-md-4">
        <div class="row d-flex flex-column">
          <div class="col">
            <span class="text-light">Results per page:</span>
          </div>
          <div class="col-7 col-md">
            <select 
              v-model="resultsPerPage" 
              class="form-control">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col mt-auto text-light">
        <button
          type="button"
          class="btn btn-light mr-2"
          @click="prevPage"
          :disabled="this.pageEnd/this.resultsPerPage <= 1"
          >&#8592;</button>
        <span>{{this.currentPage}} of {{this.pageCount}}</span>
        <button
          type="button"
          class="btn btn-light ml-2"
          @click="nextPage"
          :disabled="this.pageEnd/this.resultsPerPage >= this.pageCount"
          >&#8594;</button>
      </div>
    </div>
    <div class="row mb-3 mt-auto text-light">
      <div class="col">
        {{this.recipeBatch.length}} of {{this.recipeCount}} recipes selected
      </div>
    </div>
    <div class="row">
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
  props: ["recipeBatch", "recipeCount"],
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
