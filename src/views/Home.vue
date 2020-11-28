<template>
  <div>
    <TitleLink text="Hyperchef"></TitleLink>
    <form>
      <input v-model="query" type="search" name="search">
      <input type="button" value="Search" @click="submitSearch()">
    </form>
    <br />

    <button @click="getRecipes()">Browse all recipes</button>
    <RecipeItem
      v-for="(eachRecipe, idx) in recipeList"
      :key="idx"
      :recipe="eachRecipe"
    ></RecipeItem>
  </div>
</template>

<script>
import TitleLink from '@/components/TitleLink'
import RecipeItem from '@/components/RecipeItem'

export default {
  name: "Home",
  components: {
    TitleLink,
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
