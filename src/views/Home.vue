<template>
  <div class="container">

    <!-- hero image -->
    <div class="row">
      <div class="col-12" align="center">
        <img class="img-fluid mt-5" src="@/assets/arcadetitle.png" />
      </div>
    </div>

    <!-- search bar -->
    <div class="row">
      <div class="col-12">
        <form>
          <div class="row" align="center">
            <div class="col col-md-4 ml-auto mr-0 pr-1" align="right">
              <input v-model="query" class="form-control rounded-0" type="search" name="search">
            </div>
            <div class="col-4 col-md-2 mr-auto ml-0 pl-1">
              <input type="button" class="form-control rounded-0" value="Search" @click="submitSearch()">
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- load recipes + filter buttons -->
    <div class="row my-3 d-flex justify-space-evenly">
      <div class="col-6" align="right">
        <button @click="getRecipes()">
          <span v-if="staleRecipes">
            Load Recipes
          </span>
          <span v-else>
            Refresh Recipe List
          </span>
        </button>
      </div>

      <div class="col-6">
        <button @click="toggleFilterPanel()">Filters</button>
      </div>

    </div>

    <!-- filter panel -->
    <div class="row" v-if="isFilterPanelVisible">
      <FilterPanel
        :filterList="all_filters"
        @toggleBtn="toggleFilter"
        @clearBtn="clearSelectedFilters"
        ></FilterPanel>
    </div>

    <!-- recipe list -->
    <div class="row">
      <div class="col-2 mt-5 mx-auto text-light" align="center" v-if="loadingRecipesSpinner">
        <h2>Loading...</h2>
      </div>
      <PaginatedResults
        v-else
        :recipeBatch="visibleRecipes"></PaginatedResults>
        <!--
      <div 
        v-else
        class="col mb-4"
        align="center"
        v-for="(eachRecipe, idx) in visibleRecipes"
        :key="idx"
      >
        <RecipeItem :recipe="eachRecipe"></RecipeItem>
      </div>
        -->
    </div>
  </div>
</template>

<script>
//import RecipeItem from '@/components/RecipeItem'
import PaginatedResults from '@/components/PaginatedResults'
import FilterPanel from '@/components/FilterPanel'

export default {
  name: "Home",
  components: {
    //RecipeItem,
    PaginatedResults,
    FilterPanel,
  },
  data: function() {
    return {
      all_filters: {},
      all_recipes: {},
      sorted_recipes: {},
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
        out = this.intersectArrays(out, this.sorted_recipes[tag])
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
    submitSearch: async function() {
      // are we doing search right on frontend?
      return
      /*
      change to searching on client
      await this.$axios({
        method: 'GET',
        url: `${process.env.VUE_APP_BACKEND_URL}/api/search`,
        params: {
          query: this.query,
        },
      }).then( res => {
        if (res.status == 200) {
          this.recipeList = res.data;
        }
      });
      */
    },
    getRecipes: async function() {
      this.loadingRecipesSpinner = true;
      await this.$axios({
        method: 'GET',
        url: `${process.env.VUE_APP_BACKEND_URL}/api/all`,
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
      this.sorted_recipes = data.sorted_recipe_ids;
      this.visibleRecipes = Object.keys(this.all_recipes).map(id => this.all_recipes[id]);
    },
  },
  mounted: async function() {
    if (localStorage.getItem("recipeGraph")) {
      this.parseData();
      return
    }

    /*
    await this.$axios({
      method: 'GET',
      url: `${process.env.VUE_APP_BACKEND_URL}/api/get_tags`,
    }).then( res => {
      if (res.status == 200) {
        this.filterList = res.data['Recipe Tags'].map( (filter) => {
          return {name: filter, state: false, type: 'recipe'}
        });
        this.filterList = this.filterList.concat(res.data['Ingredient Tags'].map( filter => {
          return {name: filter, state: false, type: 'ingredient'}
        }));
      }
      localStorage.setItem('filterList', JSON.stringify(this.filterList));
    });
    */
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
