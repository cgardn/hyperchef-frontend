<template>
  <div class="container">
    <div class="row" v-if="first">
      <div class="col-4">
        <h6>Name</h6>
      </div>
      <div class="col">
        <h6>Show</h6>
      </div>
      <div class="col">
        <h6>List</h6>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input
          type="checkbox"
          :checked="isChecked"
          v-on:input="emitCheck"
          >
        <label :for="ingData">{{ingData[1]}}</label>
      </div>
      <div class="col mr-3">
        <input type="text" v-model="ingData[2]" size="5">
        <input type="text" v-model="ingData[3]" size="3">
      </div>
      <div class="col">
        <input type="text" v-model="ingData[4]" size="5">
        <input type="text" v-model="ingData[5]" size="3">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeIngredientInput",
  // ingProp = { 
  //   id, name, show_quantity, show_unit, list_quantity, list_unit
  // }
  computed: {
    ingData: function() {return this.ingProp},
    isChecked: function() {return this.checked},
  },
  props: ["ingProp", "checked", "first"],
  methods: {
    emitCheck: function() {
      this.$emit('input', this.ingData)
    },
  },
}
</script>
