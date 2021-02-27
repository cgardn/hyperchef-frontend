const blankStates = {
  'groceryList': [],
  'rawShoppingList': {},
  'shoppingList': []
}

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
      slug: recipe.slug,
      recipeId: recipe.id,
      servings: servings,
    }];
    localStorage.setItem('groceryList', JSON.stringify(newList));
  },
  removeRecipeGrocery: function(id) {
    const curList = JSON.parse(localStorage.getItem('groceryList'));
    const newList = curList.filter( r => r.recipeId !== id);
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
  removeShoppingItems: function(id) {
    const curList = this.getRawShoppingList().filter( i => i[1] !== id);
    this.setRawShoppingList(curList);
  },

  groceryHasRecipe: function(id) {
    // checks if grocery list contains a specified recipe by id
    const list = JSON.parse(localStorage.getItem('groceryList'))
    return list.some(r => r.recipeId === id);
  },
  clearGrocery: function() {
    localStorage.setItem('groceryList', JSON.stringify([]));
  },
  recoverGrocery: function() {
    if (!localStorage.getItem('groceryList')) {
      this.clearGrocery();
    }
  },
  /* Shopping list persistance */
  addCheckedIngredient: function(name) {
    const curList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    localStorage.setItem('shoppingList', JSON.stringify([...curList, name]));
  },
  removeCheckedIngredient: function(name) {
    const curList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    const newList = curList.filter( (i) => i !== name);
    localStorage.setItem('shoppingList', JSON.stringify(newList));
  },
  clearCheckedIngredients: function() {
    this.clearList('shoppingList');
  },

  /* Utility */
  getList: function(listName) {
    if (!localStorage.getItem(listName)) {this.clearList(listName)}
    return JSON.parse(localStorage.getItem(listName)) || blankStates[listName];
  },
  clearList: function(listName) {
    localStorage.setItem(listName, JSON.stringify(blankStates[listName]));
  },
  recoverList: function(listname) {
    // re-add list only if it's missing
    if (!localStorage.getItem(listname)) {
      this.clearList(listname);
    }
  }
}


export default state;
