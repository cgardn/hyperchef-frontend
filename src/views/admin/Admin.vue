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
        <span class="text-light">List of recipes</span>
        <div v-for="(recipe, idx) in Object.keys(currentData)" :key="idx">
          <a @click="getRecipe(recipe)">
            {{currentData[recipe][0]}} : {{currentData[recipe][1]}}
          </a>
          <br />
        </div>
      </div>

      <!-- new recipe form -->
      <div class="card" v-if="currentComponent=='newRecipe'">
        <div 
          class="row"
          v-for="(field, idx) in Object.keys(newRecipeForm)"
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
        <div class="row" v-for="(eq, idx) in currentData" :key="idx">
          <div class="col">
            {{eq}}
          </div>
        </div>
      </div>

      <!-- ingredient tags -->
      <div class="card" v-if="currentComponent=='ingredientTagList'">
        <div class="row" v-for="(eq, idx) in currentData" :key="idx">
          <div class="col">
            {{eq}}
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
export default {
  name: "Admin",
  data: function() {
    return {
      username: "",
      password: "",
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
    haveData: function() {
      return sessionStorage.getItem('adminData');
    },
  },
  beforeUnmount: function() {
    sessionStorage.removeItem('adminData');
    sessionStorage.removeItem('token');
  },
  methods: {
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
      console.log(`get recipe ${id}`);
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
