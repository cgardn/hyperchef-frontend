
const state = {
  getGroceryList: function() {
    return JSON.parse(localStorage.getItem('groceryList'));
  },
  setGroceryList: function(newList) {
    localStorage.setItem('groceryList', JSON.stringify(newList))
  },
  addRecipeGrocery: function(recipe, servings) {
    const curList = JSON.parse(localStorage.getItem('groceryList'));
    const newList = [...curList, {
      name: recipe.name,
      recipeId: recipe.id,
      servings: servings,
    }];
    localStorage.setItem('groceryList', JSON.stringify(newList));
  },
  removeRecipeGrocery: function(id) {
    const curList = JSON.parse(localStorage.getItem('groceryList'));
    let newList = [];
    curList.forEach( (r) => {
      if (r.recipeId !== id) {newList.push(r)}
    });
    localStorage.setItem('groceryList', JSON.stringify(newList));
  },
  toggleGroceryRecipe: function(recipe, servings) {
    if (!this.groceryHasRecipe(recipe.id)) {
      this.addRecipeGrocery(recipe, servings);
    } else {
      this.removeRecipeGrocery(recipe.id);
    }
  },
  getRawShoppingList: function() {
    return JSON.parse(localStorage.getItem('rawShoppingList')) || [];
  },
  setRawShoppingList: function(list) {
    localStorage.setItem('rawShoppingList', JSON.stringify(list));
  },
  clearRawShoppingList: function() {
    localStorage.setItem('rawShoppingList', JSON.stringify({}))
  },
  groceryHasRecipe: function(id) {
    // checks if grocery list contains a specified recipe by id
    const list = JSON.parse(localStorage.getItem('groceryList'))
    let any = false;
    list.forEach( (r) => {
      if (r.recipeId === id) {any = true}
    })
    return any;
  },
  clearGrocery: function() {
    localStorage.setItem('groceryList', JSON.stringify([]));
  },
  recoverGrocery: function() {
    if (!localStorage.getItem('groceryList')) {
      this.clearGrocery();
    }
  },
}


export default state;
