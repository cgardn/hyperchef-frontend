<template>
  <div class="card" @click="getSingleRecipe()">
    <div class="card-title">{{recipe.name}}</div>
    <div class="card-body">Description/difficulty bars go here</div>
  </div>
</template>

<script>
export default { 
  name: "RecipeItem",
  props: ["recipe"],
  methods: {
    getSingleRecipe: function() {
      this.$router.push(`recipe/${this.recipe.slug}`);
    },
  },
}
</script>

<style scoped>
.wrap {
  width: 15%;
  border: 2px solid grey;
  background: #eee;
  margin-bottom: 5px;
  margin-left: 5px;
}

.wrap:hover {
  cursor: pointer;
}
</style>
