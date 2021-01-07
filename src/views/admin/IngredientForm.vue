<template>
  <div class="card">
    <div>
      <span>ID: {{formData.ing.id}}</span>
    </div>
    <div>
      <span>Name:</span>
      <input type="text" v-model="formData.ing.name">
    </div>
    <div>
      <span>Calories Per Gram: </span>
      <input type="text" v-model="formData.ing.caloriespergram">
    </div>
    <div>
      <h5>Units</h5>
      <div v-for="(unit, idx) in Object.keys(formData.ing.units)" :key="idx">
        <span>{{unit}}</span>
        <input type="text" v-model="formData.ing.units[unit][0]">
        <input type="text" v-model="formData.ing.units[unit][1]">
      </div>
    </div>
    <div>
      <h5>Tags</h5>
      <span v-for="(tag, idx) in iTags" :key="idx">
        <input
          type="checkbox"
          :id="Number(tag[0])"
          :value="tag[0]"
          v-model="formData.iTags"
        >
          <label :for="tag">{{tag[1]}}</label>
      </span>
    </div>
    <div class="row">
      <div class="col">
        <button @click="submit" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Submit</span>
          <span v-else>Waiting...</span>
        </button>
        <button
          v-if="this.ingredientId != 'new'"
          @click="deleteIngredient"
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
  name: "IngredientForm",
  props: ["ingredientId"],
  mounted: async function() {
    if (!this.ingredientId != 'new') {
      // ingredient info
      this.$axios.get(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredients/${this.ingredientId}`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.formData = res.data;
        }
      }).catch(err => {
        console.log(err);
      });
    }
      // ingredient tags
      this.$axios.get(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredient_tags`,
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then(res => {
        if (res.status == 200) {
          this.iTags = res.data;
        }
      }).catch(err => {
        console.log(err);
      });
  },
  data: function() {
    return {
      showForm: false,
      iTags: [],
      submitStatus: "",
      isSubmitting: false,
      formData: {
        ing: {
          id: '',
          caloriespergram: '',
          name: "",
          units: {
            imperial_list: ['',''],
            imperial_show: ['',''],
            metric_list: ['',''],
            metric_show: ['',''],
          },
        },
        iTags: [],
      },
    }
  },
  methods: {
    submit: function() {
      if (this.ingredientId == 'new') {
        this.sendCreate()
      } else {
        this.sendUpdate()
      }
    },
    sendCreate: async function()  {
      this.formData.ing.units = JSON.stringify(this.formData.ing.units)
      this.isSubmitting = true;
      this.$axios.post(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredients`,
        this.formData,
        {
          headers: {
            authorization: sessionStorage.getItem('token')
          }
        }
      ).then( () => {
        this.isSubmitting = false;
        this.submitStatus = "Success"
        this.formData.ing.units = JSON.parse(this.formData.ing.units)
      }).catch(err => {
        this.isSubmitting = false;
        this.submitStatus = "Failed"
        this.formData.ing.units = JSON.parse(this.formData.ing.units)
        console.log(err);
      });
    },
    sendUpdate: async function() {
      this.formData.ing.units = JSON.stringify(this.formData.ing.units)
      this.isSubmitting = true;
      this.$axios.patch(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredients/${this.ingredientId}`,
        this.formData,
        {
          headers: {
            authorization: sessionStorage.getItem('token')
          }
        }
      ).then( () => {
        this.formData.ing.units = JSON.parse(this.formData.ing.units)
        this.isSubmitting = false
        this.submitStatus = "Success"
      }).catch(err => {
        console.log(err)
        this.formData.ing.units = JSON.parse(this.formData.ing.units)
        this.isSubmitting = false
        this.submitStatus = "Failed"
      });
    },
    deleteIngredient: async function() {
      this.isSubmitting = true;
      this.$axios.delete(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredients/${this.recipeId}`,
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

<style scoped>
.outlined {
  border: 2px thin black;
}
</style>
