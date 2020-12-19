<template>

  <div class="container">
    <div class="row" v-if="!isAuth">
      <div class="col">
        <span class="text-light">Username:</span>
        <input type="text">
        <span class="text-light">Password:</span>
        <input type="password">
      </div>
    </div>

    <div v-else>
      <!-- after login -->
      <span>logged in</span>
      <!-- list of recipe names+ids, with links -->
      <!-- tab to view ingredients, iTags, recipeTypes, equipment, etc -->
      <!-- download it all on successful auth and hold in local memory, don't
        write anything to localStorage -->
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
      authToken: "",
      isAuth: false,
      recipes: {},
      ingredients: [],
      ingredient_tags: [],
      equipment: [],
    }
  },
  methods: {
    login: async function() {
      await this.$axios({
        method: 'POST',
        url: `${this.$backend}/api/${this.apiVersion}/recipes`,
        data: {
          user: this.username,
          password: this.password,
        },
      }).then( res => {
        if (res.status == 200) {
          sessionStorage.setItem('token', res.token);
        }
      });
    },
    logout: function() {
      sessionStorage.removeItem('token');
    },
  },
}
</script>
