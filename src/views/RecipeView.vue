<template>
  <div class="container">
    <h2 class="text-light mx-auto my-5" align="center">{{recipe.name}}</h2>
    <div class="row d-flex justify-content-center">
      <div class="col-12 col-md mx-auto">
        <div class="container mb-2">
        <div class="card bg-grey px-2 py-2">
          <h4>Equipment you'll need</h4>
          <div class="row">
            <div
              class="col-12"
              v-for="(equip, idx) in recipe.equipment"
              :key="idx"
            >
              <EquipmentLink :equipment="equip"></EquipmentLink>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div class="col-12 col-md mx-auto">
        <IngredientList :ingredients="recipe.ingredients"></IngredientList>
      </div>
    </div>


    <div class="row bg-light my-5 py-3">
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
    }
  },
  mounted: async function() {
    this.$axios({
      method: 'GET',
      url: `${this.$backend}/api/${this.$apiVersion}/recipes/${this.recipeSlug}`,
    }).then( res => {
      if (res.status == 200) {
        console.log(res.data);
        this.recipe = res.data;
      }
    })
  },
}
</script>
