<template>
  <div class="container">
    <div class="row">
      <div class="col" align="center">
        <img class="img-fluid mt-5" src="@/assets/arcadetitle.png" />
      </div>
    </div>
    <form>
      <input v-model="query" type="search" name="search">
      <input type="button" value="Search" @click="submitSearch()">
    </form>
    <br />

    <button @click="getRecipes()">Browse all recipes</button>
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

export default {
  name: "Home",
  components: {
    RecipeItem,
  },
  data: function() {
    return {
      recipeList: [],
      query: "",
    }
  },
  methods: {
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
