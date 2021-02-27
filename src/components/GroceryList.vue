<template>
  <div>
    <!--
    grocery list: simple line-based list of all recipes on list with servings
                  for each, adjustable with +/- buttons. at the bottom there
                  is a sum of all the different ingredients needed
        - can also remove recipes from list, or temporarily hide
        - maybe have it be combination "favorite" list, with multiple lists available to make/manage, and you can just "activate" or "deactivate" whether it's contributing its things to your total
        - the presence of a recipe on the list means its ingredients get pulled from the server for manipulation?
        ! might finally need Vuex for this
    -->
    <div class="row border-bottom border-dark darkBg py-2" v-for="(recipe, idx) in list" :key="idx">
      <div class="col-12 col-md-3 mb-2 text-center text-md-left">
        <a class="btn btn-light" :href="'/#/recipe/' + recipe.slug">{{recipe.name}}</a>
      </div>
      <div class="col my-auto">
        <span class="mr-2 textContrastFix">Servings:</span>
        <button class="btn btn-light mr-1" @click="changeServing(-1, recipe.recipeId)">-</button>
        <span class="textContrastFix">{{recipe.servings}}</span>
        <button class="btn btn-light ml-1" @click="changeServing(1, recipe.recipeId)">+</button>
      </div>
      <div class="col-4 my-auto text-center">
        <button class="btn btn-light" @click="removeRecipe(recipe.recipeId)">X</button>
      </div>
    </div>
    <div class="row my-3">
      <div class="col my-auto text-left">
        <button
          class="btn btn-light"
          @click="getIngredientList"
          :disabled="waitList"
        >
          {{waitList ? "Generating..." : "Refresh List"}}
        </button>
      </div>
      <div class="col my-auto text-right">
        <button
          class="btn btn-light"
          @click="toggleUnits"
          :disabled="waitList"
          >Switch Units</button>
      </div>
    </div>
    <IngredientItem
      v-for="(ing) in Object.keys(ingredientList)"
      :name="ing"
      :quant="ingredientList[ing][0]"
      :unit="ingredientList[ing][1]"
      :key="ing"
      :isMetric="isMetric"
      ></IngredientItem>
  </div>
</template>

<script>
import IngredientItem from '@/components/IngredientItem'
export default {
  name: "GroceryList",
  components: {IngredientItem},
  data: function() {
    return {
      list: [],
      rawIngredients: [],
      waitList: false,
      isMetric: true,
    }
  },
  computed: {
    ingredientList: function() {
      //TODO redo this
      let outList = {};
      this.rawIngredients.forEach( (ing) => {
        const recipe = ing[0];
        let servings = 1;
        this.list.forEach( (r) => {
          if (r.recipeId === ing[1]) {
            servings = r['servings'];
          }
        })
        if (outList[recipe[1]]) {
          // add to quantity if already there
          // first get current serving size
          outList[recipe[1]][0] += Number(recipe[4])*servings;
        } else {
          // adding list amt and unit if not in list already
          outList[recipe[1]] = [Number(recipe[4])*servings, recipe[5]];
        }
     });
     return outList;
    },
  },
  methods: {
    toggleUnits: function() {
      this.isMetric = !this.isMetric;
    },
    getIngredientList: async function() {
      // TODO needs its own multi-ingredient/multi-recipe API endpoint
      //      should be able to just send batch of recipe IDs, get ingredient
      //      list back with base quants and units
      // TODO move axios calls to api, move state calls to state
      // TODO create mutations+actions in state.js for fetching + storing
      this.waitList = true;
      this.rawIngredients = [];
      this.$state.clearCheckedIngredients();

      await this.list.forEach( (recipe) => {
        const slug = JSON.parse(localStorage.getItem('recipeGraph')).all_recipes[recipe.recipeId].slug;
        this.$api.fetchRecipeIngredients(slug).then( (res) => {
          res.forEach( (i) => {
            this.rawIngredients.push(i);
          });
          this.$state.setRawShoppingList(this.rawIngredients);
        })
      });

      // turn off loading message
      this.waitList = false;
    },
    changeServing: function(delta, id) {
      this.list.forEach( (r) => {
        if (r.recipeId == id && (r.servings + delta) >= 0) {
          r.servings += delta
        }
      });
      this.updateList();
    },
    removeRecipe: function(id) {
      this.$state.removeShoppingItems(id);
      this.$state.removeRecipeGrocery(id);
      this.refreshList();
    },
    updateList: function() {
      // save this component's current List to localStorage, then refresh
      this.$state.setGroceryList(this.list);
      this.list = this.$state.getGroceryList();
    },
    refreshList: function() {
      this.list = this.$state.getGroceryList();
    },
  },
  created: function() {
    this.rawIngredients = this.$state.getRawShoppingList();
    this.refreshList();
  },
}
</script>

<style scoped>
.textContrastFix {
  color: #222;
  font-weight: 500;
}
.darkBg {
  background-color: #999;
}
</style>
