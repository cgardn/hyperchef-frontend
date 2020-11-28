<template>
  <div class="wrap">
    <RecipeItem 
       v-for="(eachRecipe, idx) in content"
       :key="idx"
       :recipe="eachRecipe"
    ></RecipeItem>
  </div>
</template>

<script>

export default {
  name: "ResultViewer",
  components: {
    RecipeItem,
  },
  props: ["content"],
  methods: {
  },
}
</script>

<style scoped>
</style>
