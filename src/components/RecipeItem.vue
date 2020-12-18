<template>
  <div class="card hoverPointer" style="width: 330px" @click="getSingleRecipe()">
    <div class="card-title card-text-color text-center mb-4">
      <h4>{{recipe.name}}</h4>
    </div>
    <div class="row px-2 mb-2" align=left>
      <div class="col-4 card-text justify-content-start my-auto pr-0">
        Skill:
      </div>
      <div class="col-8 card-text justify-content-end my-auto">
        <div class="progress">
          <div 
             class="progress-bar"
             :class="[difficultyColor]"
             role="progressbar"
             :style="{ width: difficulty }"
             ></div>
        </div>
      </div>
    </div>

    <div class="row align-items-start px-2 mb-2" align=left>
      <div class="col-4 card-text justify-content-start my-auto pr-0">
        Ingredients: 
      </div>
      <div class="col-8 card-text justify-content-end my-auto">
        <div class="progress my-auto">
          <div 
             class="progress-bar"
             :class="[ingredientsColor]"
             role="progressbar"
             :style="{ width: this.ingredients }"
             ></div>
        </div>
      </div>
    </div>

    <div class="row align-items-start px-2">
      <div class="col-6 card-text justify-content-start mb-2 pr-0">
        Prep: {{this.prepTime}} minutes
      </div>
      <div class="col-6 card-text justify-content-start mb-2 pr-0" align=left>
        Cook: {{this.cookTime}} minutes
      </div>
    </div>

  </div>
</template>

<script>
export default { 
  name: "RecipeItem",
  data: function() {
    return {
      barColors: ['success','success','success','success',
                  'warning','warning','warning',
                  'danger','danger','danger'],
    }
  },
  computed: {
    difficulty: function() {
      return `${this.recipe.difficulty * 10}%`;
    },
    difficultyColor: function() {
      return `bg-${this.barColors[this.recipe.difficulty-1]}`;
    },
    ingredients: function() {
      return `${this.recipe.ingredient_score}%`;
    },
    ingredientsColor: function() {
      return `bg-${this.barColors[Math.floor(this.recipe.ingredient_score/10)]}`;
    },
    prepTime: function() {
      return this.recipe.prep_time;
    },
    cookTime: function() {
      return this.recipe.cook_time;
    },
  },
  props: ["recipe"],
  methods: {
    getSingleRecipe: function() {
      this.$router.push(`recipe/${this.recipe.slug}`);
    },
  },
}
</script>

<style scoped>
.hoverPointer:hover {
  cursor: pointer;
}
</style>
