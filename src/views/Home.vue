<template>
  <div class="container">

    <!-- hero image -->
    <div class="row">
      <div class="col-12" align="center">
        <img class="img-fluid mt-5" src="@/assets/arcadetitle.png" />
      </div>
    </div>

    <!-- load recipes + filter buttons -->
    <div class="row my-3 d-flex justify-space-evenly" align="center">

      <div class="col" align="right">
        <button @click="toggleFilterPanel()">
          <span v-if="isFilterPanelVisible">
            Hide Filters
          </span>
          <span v-else>
            Show Filters
          </span>
        </button>
      </div>
      <div class="col" align="left">
        <button @click="clearSelectedFilters">Clear Filters</button>
      </div>

    </div>

    <!-- filter panel -->
    <div class="row" v-if="isFilterPanelVisible">
      <FilterPanel
        :filterList="all_filters"
        :visibleCount="visibleRecipes.length"
        :allCount="Object.keys(all_recipes).length"
        @toggleBtn="toggleFilter"
        @clearBtn="clearSelectedFilters"
        ></FilterPanel>
    </div>
    
    <!--
    <div class="row" align="center" v-if="isFilterPanelVisible">
      <div class="col" align="right">
        <button @click="toggleFilterPanel()">
          <span v-if="isFilterPanelVisible">
            Hide Filters
          </span>
        </button>
      </div>
      <div class="col" align="left">
        <button @click="clearSelectedFilters">Clear Filters</button>
      </div>
    </div>
    -->

    <!-- recipe list -->
    <div class="row" v-if="!isFilterPanelVisible">
      <div 
        v-if="loadingRecipesSpinner"
        class="col-2 mt-5 mx-auto text-light"
        align="center"
      >
        <h2>Loading...</h2>
      </div>
      <PaginatedResults
        v-else
        :recipeBatch="visibleRecipes"
        :recipeCount="Object.keys(all_recipes).length"
      ></PaginatedResults>
    </div>
  </div>
</template>

<script>
import PaginatedResults from '@/components/PaginatedResults'
import FilterPanel from '@/components/FilterPanel'

export default {
  name: "Home",
  components: {
    PaginatedResults,
    FilterPanel,
  },
  data: function() {
    return {
      all_filters: {},
      all_recipes: {},
      sorted_recipe_ids: {},
      selectedFilters: [],
      visibleRecipes: [],
      query: "",
      isFilterPanelVisible: false,
      loadingRecipesSpinner: false,
    }
  },
  computed: {
    staleRecipes: function() {
      return localStorage.getItem('all_recipes') == null;
    },
  },
  methods: {
    getSelectedFilters: function() {
      this.selectedFilters = Object.keys(this.all_filters).filter(tag => this.all_filters[tag].state === true);
    },
    clearSelectedFilters: function() {
      this.selectedFilters.forEach(tag => {
        this.all_filters[tag].state = false;
      });
      this.selectedFilters = [];
      this.parseData();
    },
    getVisibleRecipes: function() {
      // start with all recipe ids
      let out = Object.keys(this.all_recipes).map(i => Number(i));

      // for each selected filter, perform a series of intersections to get
      //   to the final set of selected recipes
      this.selectedFilters.forEach(tag => {
        out = this.intersectArrays(out, this.sorted_recipe_ids[tag])
      })
      this.visibleRecipes = out.map(id => this.all_recipes[id])
    },
    unionArrays: function(arr1, arr2) {
      // returns the union of the two arrays
      return [...new Set([...arr1, ...arr2])]
    },
    intersectArrays: function(arr1, arr2) {
      // intersection of two arrays
      return arr1.filter(x => arr2.includes(x))
    },
    toggleFilter: function(fName) {
      this.all_filters[fName].state = !this.all_filters[fName].state;
      this.getSelectedFilters();
      this.getVisibleRecipes();
    },
    toggleFilterPanel: function() {
      this.isFilterPanelVisible = !this.isFilterPanelVisible;
    },
    getRecipes: async function() {
      this.loadingRecipesSpinner = true;
      await this.$axios({
        method: 'GET',
        url: `${this.$backend}/api/${this.$apiVersion}/recipes`,
      }).then( res => {
        if (res.status == 200) {
          localStorage.setItem('recipeGraph', JSON.stringify(res.data));
          this.parseData();
        }
      });
      this.loadingRecipesSpinner = false;
    },
    parseData: function() {
      let data = JSON.parse(localStorage.getItem("recipeGraph"));
      this.all_recipes = data.all_recipes;
      this.all_filters = data.all_filters;
      this.sorted_recipe_ids = data.sorted_recipe_ids;
      this.visibleRecipes = Object.keys(this.all_recipes).map(id => this.all_recipes[id]);
    },
  },
  mounted: async function() {
    this.getRecipes();
  },
}
</script>

<style scoped>
img {
}
form {
  flex: 1 100%;
  text-align: center;
  margin: auto;
  margin-top: 15%;
}

form > * {
  font-size: 1.8em;
}

form > input {
  height: 2em;
  border: none;
}

button {
  text-align: center;
  margin: auto;
}

</style>
