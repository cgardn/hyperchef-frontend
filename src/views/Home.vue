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
        <button @click="getRecipes()">Browse all recipes</button>
      </div>
      <div class="col-6">
        <button @click="toggleFilters()">Filters</button>
      </div>
    </div>
    <div class="row" v-if="isFilterPanelVisible">
      <div class="col bg-light">
        <ToggleButton
          v-for="(f, idx) in filterList"
          :key="idx"
          :active="f.state"
          @click="toggleFilter(f.name)"
          >{{f.name}}</ToggleButton>
      </div>
    </div>

    <div class="row">
      <div 
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
import ToggleButton from '@/components/ToggleButton'

export default {
  name: "Home",
  components: {
    RecipeItem,
    ToggleButton,
  },
  data: function() {
    return {
      filterList: [
        {name: 'Root', state: false},
        {name: 'Poultry', state: false},
        {name: 'Herb', state: false},
      ],
      recipeList: [],
      query: "",
      isFilterPanelVisible: false,
    }
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
      await this.$axios({
        method: 'GET',
        url: `http://192.168.1.203:3000/api/all`,
      }).then( res => {
        if (res.status == 200) {
          this.recipeList = res.data;
        }
      });
    },
  }
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
