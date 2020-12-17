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
      <div 
        class="col-md-6"
        v-for="(itag, idx) in Object.keys(itags)"
        :key="idx"
      >
      <h4>{{itag}}</h4>
        <ToggleButton
          v-for="(filter, idy) in itags[itag]"
          :key="idy"
          :active="ingredientTags[filter].state"
          @click="emitToggle(filter)"
          >{{filter}}</ToggleButton>
      </div>
      <!--
      <div class="col">
        <h4>Ingredients</h4>
        <ToggleButton
          v-for="(filter, idx) in Object.keys(ingredients)"
          :key="idx"
          :active="ingredients[filter].state"
          @click="emitToggle(filter)"
          >{{filter}}</ToggleButton>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import ToggleButton from '@/components/ToggleButton'

export default {
  name: "FilterPanel",
  data: function() {
    return {
      itags: {},
      ingredientTags: {},
    }
  },
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
    /*
    ingredientTags: function() {
      return Object.fromEntries(Object.entries(this.filterList).filter(
        i => i[1].type == "ingredientTag")
      )
    },
    */
    ingredients: function() {
      return Object.fromEntries(Object.entries(this.filterList).filter(
        i => i[1].type == "ingredient")
      )
    },
  },
  created: function() {
    // pull out the ingredients by type
    //  we do this here so the "main" data being operated on remains a 
    //    name-keyed hash on the parent view (Home) for faster lookups
    Object.entries(this.filterList).forEach(ing => {
      if (ing[1].itag) {
        if (!this.itags[ing[1].itag]) {
          this.itags[ing[1].itag] = [ing[0]]
        } else {
          this.itags[ing[1].itag].push(ing[0])
        }
        this.ingredientTags[ing[0]] = ing[1]
      }
    });
  },
  methods: {
    emitToggle: function(name) {
      this.$emit('toggleBtn', name);
    },
  },
}
</script>
