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
      <div class="card px-3 py-3">
        <div class="row">
          <div class="col text-center" v-for="tab in components" :key="tab">
            <button @click="currentComponent = tab">{{tab}}</button>
          </div>
        </div>
      </div>

      <!-- tab container -->
      <component :is="currentComponent"></component>

    </div>

  </div>
</template>

<script>
import Recipes from '@/views/admin/Recipes'
import RecipeTypes from '@/views/admin/RecipeTypes'
import Ingredients from '@/views/admin/Ingredients'
import IngredientTags from '@/views/admin/IngredientTags'
import Equipment from '@/views/admin/Equipment'

export default {
  name: "Admin",
  components: {
    Recipes,
    RecipeTypes,
    Ingredients,
    IngredientTags,
    Equipment,
  },
  data: function() {
    return {
      components: [
        "Recipes",
        "RecipeTypes",
        "Ingredients",
        "IngredientTags",
        "Equipment",
      ],
      currentComponent: "",
      username: "",
      password: "",
      isAuth: false,
    }
  },
  beforeUnmount: function() {
    sessionStorage.removeItem('adminData');
    sessionStorage.removeItem('token');
  },
  methods: {
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
    }).catch(err => {
      console.log(err)
      this.isAuth = false;
    });
  },
}
</script>

<style scoped>
.spacer {
  height: 100px;
}
</style>
