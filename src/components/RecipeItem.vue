<template>
  <div class="card hoverPointer" style="width: 350px" @click="getSingleRecipe()">
    <div class="card-title card-text-color text-center mb-4">
      {{recipe.name}}
    </div>
    <div class="row align-items-start px-2">
      <div class="col-4 card-text justify-content-start mb-2 pr-0">
        Skill:
      </div>
      <div class="col-8 card-text justify-content-end mb-2">
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

    <div class="row align-items-start px-2">
      <div class="col-4 card-text justify-content-start mb-2 pr-0">
        Ingredients: 
      </div>
      <div class="col-8 card-text justify-content-end mb-2">
        <div class="progress">
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
      <div class="col-4 card-text justify-content-start mb-2 pr-0">
        Time:
      </div>
      <div class="col-8 card-text justify-content-end mb-2">
        <div class="progress">
          <div 
             class="progress-bar"
             :class="[timeColor]"
             role="progressbar"
             :style="{ width: time }"
             ></div>
        </div>
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
    time: function() {
      return `${this.recipe.time_score}%`;
    },
    timeColor: function() {
      return `bg-${this.barColors[Math.floor(this.recipe.time_score/10)]}`;
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
