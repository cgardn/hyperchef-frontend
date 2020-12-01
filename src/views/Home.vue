<template>
  <div class="container">
    <div class="row">
      <div class="col-12" align="center">
        <img class="img-fluid mt-5" src="@/assets/arcadetitle.png" />
      </div>
      <div class="col-12">
        <form>
          <input v-model="query" type="search" name="search">
          <input type="button" value="Search" @click="submitSearch()">
        </form>
      </div>
    </div>
    <div class="row d-flex justify-space-evenly">
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
        <button @click="toggleFilters()">Filters</button>
      </div>
    </div>
    <div class="row" v-if="isFilterPanelVisible">
      <FilterPanel
        :filterList="filterList"
        @toggleBtn="toggleFilter"
        ></FilterPanel>
    </div>

    <div class="row">
      <div class="col" v-if="loadingRecipesSpinner">
        Loading...
      </div>
      <div 
        v-else
        class="col mb-4"
        align="center"
        v-for="(eachRecipe, idx) in recipeList"
        :key="idx"
      >
        <RecipeItem :recipe="eachRecipe"></RecipeItem>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeItem from '@/components/RecipeItem'
import FilterPanel from '@/components/FilterPanel'

export default {
  name: "Home",
  components: {
    RecipeItem,
    FilterPanel,
  },
  data: function() {
    return {
      filterList: [],
      recipeList: [],
      query: "",
      isFilterPanelVisible: false,
      loadingRecipesSpinner: false,
    }
  },
  computed: {
    staleRecipes: function() {
      return localStorage.getItem('recipeList') == null;
    },
  },
  methods: {
    toggleFilter: function(fName) {
      let idx = this.filterList.findIndex(i => {return i.name === fName});
      this.filterList[idx].state = !this.filterList[idx].state;
    },
    toggleFilters: function() {
      this.isFilterPanelVisible = !this.isFilterPanelVisible;
    },
    submitSearch: async function() {
      await this.$axios({
        method: 'GET',
        url: `http://192.168.1.203:3000/api/search`,
        params: {
          query: this.query,
        },
      }).then( res => {
        if (res.status == 200) {
          this.recipeList = res.data;
        }
      });
    },
    getRecipes: async function() {
      this.loadingRecipesSpinner = true;
      await this.$axios({
        method: 'GET',
        url: `http://192.168.1.203:3000/api/all`,
      }).then( res => {
        if (res.status == 200) {
          this.recipeList = res.data;
          localStorage.setItem('recipeList', JSON.stringify(this.recipeList));
        }
      });
      this.loadingRecipesSpinner = false;
    },
  },
  mounted: async function() {
    if (localStorage.getItem("recipeList")) {
      this.recipeList = JSON.parse(localStorage.getItem("filterList"));
    }
    if (localStorage.getItem("filterList")) {
      this.filterList = JSON.parse(localStorage.getItem("filterList"));
      return
    }

    await this.$axios({
      method: 'GET',
      url: `http://192.168.1.203:3000/api/get_tags`,
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
