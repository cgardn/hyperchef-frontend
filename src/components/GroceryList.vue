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
    <div class="row mb-2" v-for="(recipe, idx) in list" :key="idx">
      <div class="col-3 my-auto">
        <a class="btn btn-light w-100 mr-5" :href="'/#/recipe/' + recipe.name">{{recipe.name}}</a>
      </div>
      <div class="col my-auto">
        <span class="mr-2">Servings:</span>
        <button class="btn btn-light mr-1" @click="changeServing(-1, recipe.recipeId)">-</button>
        <span>{{recipe.servings}}</span>
        <button class="btn btn-light ml-1" @click="changeServing(1, recipe.recipeId)">+</button>
      </div>
      <div class="col-2 my-auto">
        <button class="btn btn-light" @click="removeRecipe(recipe.recipeId)">X</button>
      </div>
    </div>
    <div class="row"><div class="col"><hr /></div></div>
    <div class="row mb-3">
      <div class="col my-auto">
        <h6>Shopping list</h6>
      </div>
      <div class="col my-auto text-left">
        <button
          class="btn btn-light"
          @click="getIngredientList"
          :disabled="waitList"
        >
          {{waitList ? "Generating..." : "Refresh List"}}
        </button>
      </div>
    </div>
    <IngredientItem
      v-for="(ing) in Object.keys(ingredientList)"
      :name="ing"
      :quant="ingredientList[ing][0]"
      :unit="ingredientList[ing][1]"
      :key="ing"
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
