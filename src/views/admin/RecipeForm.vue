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
      <h6>New Ingredients</h6>
      <RecipeIngredientInput 
        v-for="(ing, idx) in ingredients" 
        :key="idx"
        :first="idx == 0"
        :ingProp="ing"
        :checked="formDataIncludes(ing)"
        v-on:input="updateFormDataIngredients"
      />
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
import RecipeIngredientInput from '@/components/admin/RecipeIngredientInput'
export default {
  name: "RecipeForm",
  props: ["recipeId"],
  components: { RecipeIngredientInput },
  created: async function() {
    if (this.recipeId == 'new') {
      this.formData = this.blankForm;
    } else {
      // Get recipe data, and ingredients and rTypes for checkboxes
      this.$axios.get(
       `${this.$backend}/api/${this.$apiVersion}/admin/recipes/${this.recipeId}`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.formData = res.data.recipe;
          this.ingredients = res.data.ingredients.sort(this.sortIngredients);
          this.rTypes = res.data.rTypes.sort(this.sortFunction);

          if (this.formData.recipe.action_array === null) {
            this.formData.recipe.action_array = ['','']
          }
        }
      });
    }
      // now get equipment for the checkbox sections
      this.$axios.get(
       `${this.$backend}/api/${this.$apiVersion}/admin/equipment/`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.equipment = res.data.sort(this.sortFunction);
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
    updateFormDataIngredients: function(value) {
      if (this.formData.ingredients.some(i => i[0] == value[0])) {
        this.formData.ingredients = this.formData.ingredients.filter( i =>  i[0] !== value[0])
      } else {
        this.formData.ingredients.push(value)
      }
    },
    formDataIncludes: function(obj) {
      return this.formData.ingredients.some(i => i[0] == obj[0])
    },
    sortIngredients: function(a,b) {
      return (a[1] > b[1]) ? 1 : -1;
    },
    sortFunction: function(a,b) {
      return (a[1] > b[1]) ? 1 : -1;
    },
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
          this.isSubmitting = false;
        }
      }).catch( err => {
        console.log(err)
        this.submitStatus = "Failed"
        this.isSubmitting = false;
      });
    },
  },
}
</script>
