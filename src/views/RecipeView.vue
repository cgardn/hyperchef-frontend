<template>
  <div class="container">
    <h2 class="mx-auto my-5" align="center">{{recipe.name}}</h2>
    <div class="row mb-3">
      <div class="col">
        <button
          @click="toggleGrocery"
          class="btn btn-light no-border"
          :class="{'onList' : isGrocery}"
        >
          <img src="../assets/baseline_receipt_long_black_18dp.png">
          <img v-if="!isGrocery" src="../assets/add-24px.svg">
          <img v-else src="../assets/done-24px.svg">
        </button>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col-12 col-md mx-auto mb-2">
        <div class="card bg-grey px-2 py-2">
          <h4>Equipment you'll need</h4>
          <div class="row">
            <div
              class="col-12"
              v-for="(equip, idx) in equipment"
              :key="idx"
            >
              <EquipmentLink :equipment="equip"></EquipmentLink>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md mx-auto">
        <IngredientList @changeServings="updateServings" :ingredients="ingredients"></IngredientList>
      </div>
    </div>


    <div class="row bg-light py-3 mb-2">
      <div class="col-12">
        <h4>Steps:</h4>
      </div>
      <div class="col-12 mb-3"
        v-for="(step, idx) in recipe.action_array"
        :key="idx"
      >
        <b>{{Number(idx)+1}}. {{step[0]}}</b>
        <br />
        <span>{{step[1]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import EquipmentLink from '@/components/EquipmentLink'
import IngredientList from '@/components/IngredientList'

export default {
  name: "RecipeView",
  components: {
    EquipmentLink,
    IngredientList,
  },
  props: [ "recipeSlug" ],
  data: function() {
    return {
      recipe: {},
      equipment: [],
      ingredients: [],
      servings: 1,
      isGrocery: false,
    }
  },
  methods: {
    updateServings: function(n) {
      this.servings = n;
    },
    toggleGrocery: function() {
      this.$state.toggleGroceryRecipe(this.recipe, this.servings);
      this.isGrocery = this.$state.groceryHasRecipe(this.recipe.id);
    },
  },
  mounted: async function() {
    this.$axios({
      method: 'GET',
      url: `${this.$backend}/api/${this.$apiVersion}/recipes/${this.recipeSlug}`,
    }).then( res => {
      if (res.status == 200) {
        this.recipe = res.data['recipe'];
        this.ingredients = res.data['ingredients'];
        this.equipment = res.data['equipment'];
        this.isGrocery = this.$state.groceryHasRecipe(this.recipe.id);
      }
    })
  },
}
</script>

<style scoped> 
.no-border {
  border: none;
}
.onList {
  background: rgb(120,227,149);
}
</style>
