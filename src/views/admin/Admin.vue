<template>

  <div class="container">
    <div class="row spacer"></div>
    <div class="row" v-if="!isAuth">
      <div class="col">
        <span class="text-light">Username:</span>
        <input type="text" v-model="username">
        <span class="text-light">Password:</span>
        <input type="password" v-model="password">
        <button @click="login">Login</button>
      </div>
    </div>

    <div v-else>
      <!-- after login -->
      <div class="card">
        <button @click="downloadData" class="btn btn-info">Get Data</button>
        <div class="row">
          <div class="col">
            <button @click="allRecipes">Recipe List</button>
          </div>
          <div class="col">
            <button @click="newRecipe">New Recipe</button>
          </div>
          <div class="col">
            <button @click="allIngredients">Ingredients</button>
          </div>
          <div class="col">
            <button @click="allIngredientTags">Ingredient Tags</button>
          </div>
          <div class="col">
            <button @click="allEquipment">Equipment</button>
          </div>
        </div>
      </div>
      <div class="text-light" v-if="!haveData">
        No Data
      </div>
      <div class="text-light" v-else>
        Data loaded
      </div>
      <div v-if="isLoading">
        <span class="text-light">Waiting for data from server</span>
      </div>

      <!-- recipe list -->
      <div class="card" v-if="currentComponent=='recipeList'">
        <div v-for="(recipeId, idx) in Object.keys(currentData)" :key="idx">
          <a @click="getRecipe(recipeId)">
            {{currentData[recipeId]['name']}}
          </a>
          <br />
        </div>
      </div>

      <!-- single recipe form -->
      <div class="card" v-if="currentComponent=='singleRecipe'">
        <div v-for="(attr, idx) in Object.keys(currentData)" :key="idx">
          <div v-if="attr == 'actions'">
            Actions: <br />
            <div v-for="(step, idy) in Object.keys(currentData[attr])" :key="idy">
              {{step}} : {{currentData[attr][step]}}
            </div>
          </div>
          <div v-else>
          {{attr}} : {{currentData[attr]}}
          </div>
        </div>
      </div>

      <!-- new recipe form -->
      <div class="card" v-if="currentComponent=='newRecipe'">
        <div 
          class="row"
          v-for="(field, idx) in Object.keys(newRecipeTemplate)"
          :key="idx"
        >
          <div class="col">
            {{field}}
            <input v-model="newRecipeForm[field]" type="text">
          </div>
        </div>
      </div>

      <!-- ingredient list -->
      <div class="card" v-if="currentComponent=='ingredientList'">
        <div class="row" v-for="(ing, idx) in currentData" :key="idx">
          <div class="col">
            <IngredientForm :data="ing"></IngredientForm>
          </div>
        </div>
      </div>

      <!-- ingredient tags -->
      <div class="card" v-if="currentComponent=='ingredientTagList'">
        <div v-if="adminLoading">
          <span>Submitting changes...</span>
          <span>{{this.adminMsg}}</span>
        </div>
        <div class="row"
          v-for="(iTag, idx) in Object.keys(currentData)"
          :key="idx">
          <div class="col">
            <span>ID: {{iTag}} </span>
            <span>Name: </span>
            <input type="text" v-model="currentData[iTag]['name']">
            <button @click="updateIngredientTag(iTag, currentData[iTag]['name'])">
              Submit
            </button>
          </div>
        </div>
      </div>

      <!-- equipment -->
      <div class="card" v-if="currentComponent=='equipmentList'">
        <div class="row" v-for="(eq, idx) in currentData" :key="idx">
          <div class="col">
            {{eq}}
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
// Yes I know this is a giant ugly all-in-one component
// cut me some slack i was in a hurry
import IngredientForm from '@/views/admin/IngredientForm'

export default {
  name: "Admin",
  components: {
    IngredientForm,
  },
  data: function() {
    return {
      username: "",
      password: "",
      adminLoading: false,
      adminMsg: "",
      isLoading: false,
      isAuth: false,
      currentComponent: "",
      currentData: {},
      newRecipeForm: {
        name: "",
        origin: "",
        author: "",
        cook_time: "",
        prep_time: "",
      },
      recipes: {},
      recipe_types: [],
      ingredients: [],
      ingredient_tags: [],
      equipment: [],
    }
  },
  computed: {
    newRecipeTemplate: function() {
      let blankRecipe;
      if (sessionStorage.getItem('adminData')) {
        blankRecipe = JSON.parse(sessionStorage.getItem('adminData')).recipes[1];
      }
      Object.keys(blankRecipe).forEach(k => {
        blankRecipe[k] = "";
      });
      return blankRecipe;
    },
    haveData: function() {
      return sessionStorage.getItem('adminData');
    },
  },
  beforeUnmount: function() {
    sessionStorage.removeItem('adminData');
    sessionStorage.removeItem('token');
  },
  methods: {
    updateIngredientTag: async function(id, name) {

      let formData = new FormData();
      formData.append('name', name);

      this.adminLoading = true;
      await this.$axios.patch(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredient_tags/${id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        },
      ).then( res => {
        this.adminLoading = false;
        if (res.status == 200) {
          this.adminMsg = "Success";
        } else {
          this.adminMsg = "Failed";
        }

      });
    },
    downloadData: async function() {
      this.isLoading = true;
      await this.$axios.get(
        `${this.$backend}/api/${this.$apiVersion}/admin/recipes`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          }
        },
      ).then( res => {
        if (res.status == 200) {
          sessionStorage.setItem('adminData', JSON.stringify(res.data));
          this.isLoading = false;
        }
      });
    },
    allRecipes: async function() {
      this.currentComponent="recipeList";
      this.currentData=JSON.parse(sessionStorage.getItem('adminData')).recipes;
    },
    newRecipe: function() {
      this.currentComponent="newRecipe";
    },
    allIngredients: function() {
      this.currentComponent="ingredientList";
      this.currentData=JSON.parse(sessionStorage.getItem('adminData')).ingredients;
    },
    allIngredientTags: function() {
      this.currentComponent="ingredientTagList";
      this.currentData=JSON.parse(sessionStorage.getItem('adminData')).ingredient_tags;
    },
    allEquipment: function() {
      this.currentComponent="equipmentList";
      this.currentData=JSON.parse(sessionStorage.getItem('adminData')).equipment;
    },
    getRecipe: function(id) {
      this.currentComponent="singleRecipe";
      const recipes = JSON.parse(sessionStorage.getItem('adminData')).recipes
      this.currentData=recipes[id];
    },
    login: async function() {
      let formData = new FormData();
      formData.append('user', this.username);
      formData.append('password', this.password);
      await this.$axios.post(
        `${this.$backend}/api/${this.$apiVersion}/auth`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      ).then( res => {
        if (res.status == 200) {
          this.isAuth = true;
          sessionStorage.setItem('token', res.data.token);
        }
      });
    },
    logout: function() {
      sessionStorage.removeItem('token');
    },
  },
  mounted: async function() {
    // if no token, default back to login form
    if (!sessionStorage.getItem('token')) return;

    // otherwise, check for validity of token
    //  invalid or expired tokens will return errors
    await this.$axios.get(
      `${this.$backend}/api/${this.$apiVersion}/auth/check`,
      {
        headers: {
          authorization: sessionStorage.getItem('token'),
        }
      }
    ).then( res => {
      if (res.status == 200) {
        this.isAuth = true;
      }
    });
  },
}
</script>

<style scoped>
.spacer {
  height: 100px;
}
</style>
