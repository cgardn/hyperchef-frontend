<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col-2">
        <span class="text-light">Results per page:</span>
        <select 
          v-model="resultsPerPage" 
          class="form-control">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
      <div class="col mt-auto text-light">
        <button
          type="button"
          class="btn btn-light mr-2"
          @click="prevPage"
          :disabled="this.pageEnd/this.resultsPerPage <= 1"
          >Previous</button>
        <span>Page {{this.pageEnd/this.resultsPerPage}} of {{this.pageCount}}</span>
        <button
          type="button"
          class="btn btn-light ml-2"
          @click="nextPage"
          :disabled="this.pageEnd/this.resultsPerPage >= 20"
          >Next</button>
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
  props: ["recipeBatch"],
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
    pageEnd: function() {
      return this.pageStart + Number(this.resultsPerPage);
    },
    pageCount: function() {
      let total = this.recipeBatch.length;
      return ( total - (total % this.resultsPerPage)) / this.resultsPerPage
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
