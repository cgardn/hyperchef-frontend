import axios from 'axios'
//import state from './state.js'

const backend = process.env.VUE_APP_BACKEND_URL
const apiVersion = process.env.VUE_APP_API_VERSION

const api = {
  fetchRecipeIngredients: async function(slug) {
    return axios({
      method: 'GET',
      url: `${backend}/api/${apiVersion}/recipes/${slug}`,
    }).then( res => {
      if (res.statusText === "OK") {
        let outIng = [];
        res.data.ingredients.forEach( (ing) => {
          outIng.push([ing, res.data.recipe.id]);
        });
        return outIng;
      }
    }).catch( (err) => { 
      console.log(err)});
  },
}

export default api;
