<template>
  <div class="card">
    <span>List of recipes</span>
    <div v-for="(recipe, idx) in Object.keys(recipes)" :key="idx">
      <a @click="getRecipe(recipe)">
        {{recipes[recipe][0]}} : {{recipes[recipe][1]}}
      </a>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeList",
  props: ["recipes"],
  data: function() {
    return {
    }
  },
  methods: {
    getRecipe: function(id) {
      this.$emit("recipeClick", id);
    },
  },
}
</script>
