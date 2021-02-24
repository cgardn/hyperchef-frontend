
const state = {
  getGroceryList: function() {
    return JSON.parse(localStorage.getItem('groceryList'));
  },
  setGroceryList: function(newList) {
    localStorage.setItem('groceryList', JSON.stringify(newList))
  },
  toggleGroceryRecipe: function(recipe, servings) {
    // adds recipe if it's not already there, otherwise removes it
    const curList = JSON.parse(localStorage.getItem('groceryList'));

    if (!curList.includes( (r) => {r.id === recipe.id})) {
      const newList = curList.push({
        name: recipe.name,
        id: recipe.id,
        servings: servings,
      });
      localStorage.setItem('groceryList', JSON.stringify(newList));
    } else {
      const newList = curList.filter( (r) => {r.id !== recipe.id});
      localStorage.setItem('groceryList', JSON.stringify(newList));
    }
  },
  groceryHasRecipe: function(id) {
    // checks if grocery list contains a specified recipe by id
    const list = JSON.parse(localStorage.getItem('groceryList'))
    return list.includes( (r) => {
      r.id === id;
    })
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
