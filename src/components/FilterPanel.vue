<template>
  <div class="container">
    <div class="row bg-light pt-1 pb-3 my-3">
      <div class="col-md-6">
        <h4>Meals</h4>
        <ToggleButton
          v-for="(filter, idx) in recipeFilters"
          :key="idx"
          :active="filter.state"
          @click="emitToggle(filter.name)"
          >{{filter.name}}</ToggleButton>
      </div>
      <div class="col-md-6">
        <h4>Ingredients</h4>
        <ToggleButton
          v-for="(filter, idx) in ingredientFilters"
          :key="idx"
          :active="filter.state"
          @click="emitToggle(filter.name)"
          >{{filter.name}}</ToggleButton>
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
    recipeFilters: function() {
      return this.filterList.filter(i => i.type === 'recipe');
    },
    ingredientFilters: function() {
      return this.filterList.filter(i => i.type === 'ingredient');
    },
  },
  methods: {
    emitToggle: function(name) {
      this.$emit('toggleBtn', name);
    },
  },
}
</script>
