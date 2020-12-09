<template>
  <div class="container">
    <div class="row bg-light pt-1 pb-3 my-3">
      <div class="col-md-6">
        <h4>Meals</h4>
        <ToggleButton
          v-for="(filter, idx) in Object.keys(recipeTypes)"
          :key="idx"
          :active="recipeTypes[filter].state"
          @click="emitToggle(filter)"
          >{{filter}}</ToggleButton>
      </div>
      <div class="col-md-6">
        <h4>Ingredient Tags</h4>
        <ToggleButton
          v-for="(filter, idx) in Object.keys(ingredientTags)"
          :key="idx"
          :active="ingredientTags[filter].state"
          @click="emitToggle(filter)"
          >{{filter}}</ToggleButton>
      </div>
      <div class="col">
        <h4>Ingredients</h4>
        <ToggleButton
          v-for="(filter, idx) in Object.keys(ingredients)"
          :key="idx"
          :active="ingredients[filter].state"
          @click="emitToggle(filter)"
          >{{filter}}</ToggleButton>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button @click="emitClearFilters">Reset Filters</button>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleButton from '@/components/ToggleButton'

export default {
  name: "FilterPanel",
  components: {
    ToggleButton,
  },
  props: ["filterList"],
  computed: {
    recipeTypes: function() {
      return Object.fromEntries(Object.entries(this.filterList).filter(
        i => i[1].type == "recipeType")
      )
    },
    ingredientTags: function() {
      return Object.fromEntries(Object.entries(this.filterList).filter(
        i => i[1].type == "ingredientTag")
      )
    },
    ingredients: function() {
      return Object.fromEntries(Object.entries(this.filterList).filter(
        i => i[1].type == "ingredient")
      )
    },
  },
  methods: {
    emitClearFilters: function() {
      this.$emit('clearBtn');
    },
    emitToggle: function(name) {
      this.$emit('toggleBtn', name);
    },
  },
}
</script>
