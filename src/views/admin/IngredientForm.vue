<template>
  <div class="container ">
    <span @click="showForm = !showForm">{{data.name}}</span>
    <div v-if="showForm" class="outlined">
      <hr />
      <div v-for="(key, idx) in Object.keys(data)" :key="idx">
        <span v-if="key == 'units'">
          <h6>Units:</h6>
          <span v-for="(unit, idz) in Object.keys(data[key])" :key="idz">
            {{unit}} : {{data[key][unit][0]}} {{data[key][unit][1]}}
            <br />
          </span>
        </span>
        <span v-else-if="key == 'tags'">
          <h6>Ingredient Tags:</h6>
          <span v-for="(tag, idy) in data[key]" :key="idy">
            {{iTags[tag]['name']}}
          </span>
        </span>
        <div v-else>
          <span>{{key}} : </span>
          <input v-model="data[key]">
        </div>
      </div>
      <button @click="submit">Submit</button>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientForm",
  props: ["data"],
  data: function() {
    return {
      showForm: false,
      iTags: JSON.parse(sessionStorage.getItem('adminData'))['ingredient_tags']
    }
  },
  methods: {
    submit: async function() {
      console.log("new ingredient data: ", this.data);
    },
  },
}
</script>

<style scoped>
.outlined {
  border: 2px thin black;
}
</style>
