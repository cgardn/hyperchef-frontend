<template>

  <div class="card">
    <div>
      <span>ID: {{this.formData.recipe.id}}</span>
    </div>
    <div>
      <span>Name:</span>
      <input type="text" v-model="formData.recipe['name']">
    </div>
    <div>
      <span>Author: </span>
      <input type="text" v-model="formData.recipe['author']">
    </div>
    <div>
      <span>Origin: </span>
      <input type="text" v-model="formData.recipe['origin']">
    </div>
    <div>
      <span>Prep Time: </span>
      <input type="text" v-model="formData.recipe['prep_time']">
    </div>
    <div>
      <span>Cook Time: </span>
      <input type="text" v-model="formData.recipe['cook_time']">
    </div>
    <div>
      <span>Difficulty: (1-10) </span>
      <input type="text" v-model="formData.recipe['difficulty']">
    </div>
    <div>
      <h5>Actions</h5>
      <div v-for="(action, idx) in formData.recipe['action_array']" :key="idx">
        <span>{{Number(idx)+1}}</span>
        <br />
        <input type="text" v-model="action[0]">
        <br />
        <textarea v-model="action[1]" cols="50" rows="5"></textarea>
      </div>
      <button @click="addAction">Add Action</button>
      <button @click="removeAction">Remove Action</button>
    </div>
    <div>
      <h6>Recipe Types</h6>
      <span v-for="(type, idx) in rTypes" :key="idx">
        <input
          type="checkbox"
          :id="Number(type[0])"
          :value="type[0]"
          v-model="formData.rTypes"
        >
          <label :for="type">{{type[1]}}</label>
      </span>
    </div>
    <div>
      <h6>Equipment</h6>
      <span v-for="(type, idx) in equipment" :key="idx">
        <input
          type="checkbox"
          :id="Number(type[0])"
          :value="type[0]"
          v-model="formData.equipment"
        >
          <label :for="type">{{type[1]}}</label>
      </span>
    </div>
    <div>
      <h6>Ingredients</h6>
      <span v-for="(type, idx) in ingredients" :key="idx">
        <input
          type="checkbox"
          :id="Number(type[0])"
          :value="type[0]"
          v-model="formData.ingredients"
        >
          <label :for="type">{{type[1]}}</label>
      </span>
    </div>
    <div class="row">
      <div class="col">
        <button @click="submit" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Submit</span>
          <span v-else>Waiting...</span>
        </button>
        <button
          v-if="this.recipeId != 'new'"
          @click="deleteRecipe"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Delete</span>
          <span v-else>Waiting...</span>
        </button>
        <span>{{submitStatus}}</span>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "RecipeForm",
  props: ["recipeId"],
  created: async function() {
    if (this.recipeId == 'new') {
      this.formData = this.blankForm;
    } else {
      // Get recipe data
      this.$axios.get(
       `${this.$backend}/api/${this.$apiVersion}/admin/recipes/${this.recipeId}`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.formData = res.data;
          if (this.formData.recipe.action_array === null) {
            this.formData.recipe.action_array = ['','']
          }
        }
      });
    }
      // now get ingredient, equipment, and recipe type ids and names,
      //   for the checkbox sections
      // ingredients
      this.$axios.get(
       `${this.$backend}/api/${this.$apiVersion}/admin/ingredients/`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.ingredients = res.data;
        }
      });
      // equipment
      this.$axios.get(
       `${this.$backend}/api/${this.$apiVersion}/admin/equipment/`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.equipment = res.data;
        }
      });
      // recipe types
      this.$axios.get(
       `${this.$backend}/api/${this.$apiVersion}/admin/recipe_types/`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.rTypes = res.data;
        }
      });

    },
  data: function() {
    return {
      submitStatus: "",
      isSubmitting: false,
      formData: {
        recipe: {},
        equipment: [],
        ingredients: [],
        rTypes: [],
      },
      ingredients: [],
      rTypes: [],
      equipment: [],
      blankForm: {
        recipe: {
          id: '',
          name: "",
          author: "",
          origin: "",
          prep_time: "",
          cook_time: "",
          action_array: [],
        },
        ingredients: [],
        rTypes: [],
        equipment: [],
      },
    }
  },
  methods: {
    addAction: function() {
      this.formData.recipe.action_array.push( ['',''] );
      // not ideal, but the reactivity on formData is being weird
      this.$forceUpdate();
    },
    removeAction: function() {
      this.formData.recipe.action_array.pop()
    },
    submit: function() {
      if (this.recipeId == 'new')
        this.sendCreate()
      else
        this.sendUpdate()
    },
    sendCreate: async function() {
      this.isSubmitting = true;
      this.formData.recipe.action_array = JSON.stringify(this.formData.recipe.action_array)
      this.$axios.post(
        `${this.$backend}/api/${this.$apiVersion}/admin/recipes/`,
        this.formData,
        {
          headers: {
            authorization: sessionStorage.getItem('token')
          }
        }
      ).then( res => {
        if (res.status == 200) {
          this.isSubmitting = false;
          this.submitStatus = "Success"
          this.formData.recipe.action_array = JSON.parse(this.formData.recipe.action_array)
        }
      }).catch(err => {
        this.isSubmitting = false;
        this.submitStatus = "Failed"
        this.formData.recipe.action_array = JSON.parse(this.formData.recipe.action_array)
        console.log(err);
      });
    },
    sendUpdate: async function() {
      this.isSubmitting = true;
      this.formData.recipe.action_array = JSON.stringify(this.formData.recipe.action_array)
      this.$axios.patch(
        `${this.$backend}/api/${this.$apiVersion}/admin/recipes/${this.recipeId}`,
        this.formData,
        {
          headers: {
            authorization: sessionStorage.getItem('token')
          }
        }
      ).then( res => {
        if (res.status == 200) {
          this.isSubmitting = false;
          this.submitStatus = "Success"
          this.formData.recipe.action_array = JSON.parse(this.formData.recipe.action_array)
        }
      }).catch(err => {
        this.isSubmitting = false;
        this.submitStatus = "Failed"
        this.formData.recipe.action_array = JSON.parse(this.formData.recipe.action_array)
        console.log(err);
      });
      // dirty hack to get the action steps through the strong params,
      //   easier (faster) than changing the whole data model on the 
      //   backend
      /*
      let fixedActions = []
      Object.keys(this.formData.actions).forEach(key => {
        fixedActions.push({
          title: this.formData.actions[key][0],
          body: this.formData.actions[key][1]
        })
      })
      const fixedData = Object.keys(this.formData).reduce( (obj, key) => {
        if (key == 'actions')
          obj[key] = fixedActions
        else
          obj[key] = this.formData[key]
        return obj
      }, {})

      */
    },
    deleteRecipe: async function() {
      this.isSubmitting = true;
      this.$axios.delete(
        `${this.$backend}/api/${this.$apiVersion}/admin/recipes/${this.recipeId}`,
        {
          headers: {
            authorization: sessionStorage.getItem('token')
          }
        }
      ).then( res => {
        if (res.status == 200) {
          this.$router.push('/admin')
          this.submitStatus = "Success"
        } else {
          this.submitStatus = "Failed"
        }
        this.isSubmitting = false;
      })
    },
  },
}
</script>
