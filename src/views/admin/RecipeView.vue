<template>
  <div class="container">
    {{recipe}}
  </div>
</template>

<script>
export default {
  name: "RecipeView",
  props: ['recipeId'],
  data: function() {
    return {
      recipe: {},
    }
  },
  created: async function() {
    this.$axios.get(
     `${this.$backend}/api/${this.$apiVersion}/admin/recipes/${this.recipeId}`,
      {
        headers: {
          authorization: sessionStorage.getItem('token'),
        },
      }
    ).then(res => {
      if (res.status == 200) {
        this.recipe = res.data;
      }
    });
  },
}
</script>
