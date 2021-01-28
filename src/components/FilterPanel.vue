<template>
  <div class="container">
    <div class="row">
      <div class="col">
        {{visibleCount}} of {{allCount}} recipes selected
      </div>
    </div>
    <div class="row bg-light pt-1 pb-3 mt-3 custom-overflow">
      <div class="col-md-6 mb-3">
        <h4>Meals</h4>
        <ToggleButton
          v-for="(filter, idx) in Object.keys(recipeTypes)"
          :key="idx"
          :active="recipeTypes[filter].state"
          @click="emitToggle(filter)"
          >{{filter}}</ToggleButton>
      </div>
      <div 
        class="col-md-6 mb-3"
        v-for="(itag, idx) in Object.keys(itags)"
        :key="idx"
      >
      <h4>{{itag}}</h4>
        <ToggleButton
          v-for="(filter, idy) in itags[itag]"
          :key="idy"
          :active="ingredients[filter].state"
          @click="emitToggle(filter)"
          >{{filter}}</ToggleButton>
      </div>
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
    }
  },
  components: {
    ToggleButton,
  },
  props: ["filterList", "visibleCount", "allCount"],
  computed: {
    recipeTypes: function() {
      return Object.fromEntries(Object.entries(this.filterList).filter(
        i => i[1].type == "recipeType")
      )
    },
    ingredients: function() {
      return Object.fromEntries(Object.entries(this.filterList).filter(
        i => !i[1].type)
      )
    },
  },
  created: function() {
    // pull out the ingredients by type
    //  we do this here instead of on the backend, so that the "main" data
    //  being operated on in the parent Home view remains a name-keyed Object 
    //  for faster lookups. This FilterPanel just displays the buttons and
    //  emits a name to the parent when a button is clicked. The state of all
    //  the buttons is received as a prop
    
    Object.entries(this.filterList).forEach(ing => {
      // ing[0] is String: name of ingredient
      // ing[1] is Object: {itags: Array of String tag names
      //                    state: Bool filter toggle state}
      // maybe I dont need to do this in created() as a separate thing,
      //   maybe a computed property would be enough?

      // look at each entry in the filterList prop (i.e. an ingredient)
      // add the ingredient to each itag list on this.itags, for each on that
      //   ingredients own list of applied tags

      // skip recipe types, they don't have lists of ingredients
      if (ing[1].type && ing[1].type == 'recipeType')
        return
      // create array on this.itags if it doesn't exist yet
      ing[1].itags.forEach(iTag => {
        if (!this.itags[iTag])
          this.itags[iTag] = [ing[0]]
        else
          this.itags[iTag].push(ing[0])
      });
    });
  },
  methods: {
    emitToggle: function(name) {
      this.$emit('toggleBtn', name);
    },
  },
}
</script>

<style scoped>
.custom-overflow {
  height: 74vh;
  overflow-y: scroll;
}
h4 {
  text-transform: capitalize;
}
</style>
