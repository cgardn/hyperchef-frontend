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
    <div class="row" v-for="(recipe, idx) in list" :key="idx">
      <div class="col-2">
        {{recipe.name}}
      </div>
      <div class="col">
        <span class="mr-2">Servings:</span>
        <button class="mr-2" @click="changeServing(-1, recipe.id)">-</button>
        <span>{{recipe.servings}}</span>
        <button class="ml-2" @click="changeServing(1, recipe.id)">+</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroceryList",
  data: function() {
    return {
      list: [],
    }
  },
  methods: {
    changeServing: function(delta, id) {

      this.list.forEach( (r) => {
        if (r.id == id && (r.servings + delta) >= 0) {
          r.servings += delta
        }
      });
      this.updateList();
    },
    updateList: function() {
      // save this component's current List to localStorage, then refresh
      localStorage.setItem('groceryList', JSON.stringify(this.list));
    },
    refreshList: function() {
      this.list = JSON.parse(localStorage.getItem('groceryList'));
    },
    clearList: function() {
      localStorage.setItem('groceryList', []);
    },
  },
  created: function() {
    // TODO removeme, only for initial layout and testing
    if (!localStorage.getItem('groceryList')) {
      localStorage.setItem('groceryList', JSON.stringify([
        {name: "soup", servings: 2, id: 0},
        {name: "bread", servings: 2, id: 1}
      ]));
    }
    this.refreshList();
  },
}
</script>
