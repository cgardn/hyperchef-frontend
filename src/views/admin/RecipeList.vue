<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <button @click="getRecipe('new')">New Recipe</button>
      </div>
    </div>
    <div class="row">
      <div class="col bg-light" v-if="recipeView">
        <button @click="back">Back</button>
        <RecipeForm
          :recipeId="currentRecipe"
        ></RecipeForm>
      </div>
  
      <div v-else class="col bg-light" v-for="(recipe, idx) in recipeList" :key="idx">
        <a @click="getRecipe(recipe[0])">
          <span>{{recipe[1]}}</span>
        </a>
      </div>
    </div>

  </div>
</template>

<script>
import RecipeForm from '@/views/admin/RecipeForm'

export default {
  name: "RecipeList",
  components: { RecipeForm },
  props: ["recipes"],
  data: function() {
    return {
      recipeList: [],
      recipeView: false,
      isNewRecipe: false,
    }
  },
  created: async function() {
    await this.$axios.get(
      `${this.$backend}/api/${this.$apiVersion}/admin/recipes`, 
      {
        headers: {
          authorization: sessionStorage.getItem('token'),
        },
      }
    ).then( res => {
      if (res.status == 200) {
        this.recipeList = res.data;
      }
    });
  },
  methods: {
    back: function() {
      this.recipeView = false;
    },
    getRecipe: function(id) {
      this.recipeView = true;
      this.currentRecipe = id;
    },
  },
}
</script>
