<template>
  <div class="container">
    <div class="row pt-0 pb-3 mt-3 px-0 bg-light">
      <div 
        class="col-12 col-md-4"
        v-for="(itag, idx) in Object.keys(itags)"
        :key="idx"
      >
        <IngredientTagDropdown :title="itag" :count="countSelected(itag)">
          <ToggleButton
            v-for="(filter, idy) in itags[itag]"
            :key="idy"
            :active="tags[filter].state"
            @click="emitToggle(filter)"
            >{{filter}}</ToggleButton>
        </IngredientTagDropdown>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleButton from '@/components/ToggleButton'
import IngredientTagDropdown from '@/components/IngredientTagDropdown'

export default {
  name: "FilterPanel",
  data: function() {
    return {
      itags: {},
    }
  },
  components: {
    ToggleButton,
    IngredientTagDropdown,
  },
  props: ["filterList", "visibleCount", "allCount"],
  computed: {
    tags: function() {
      return this.filterList;
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
      // merge in recipeTypes as an itag named "meals," and then remove the 
      //  one-off dropdown called 'meals' and it should all Just Work.
      // then: should be able to count active filters generically for each iTag


      // ing[0] is String: name of ingredient
      // ing[1] is Object: {itags: Array of String tag names
      //                    state: Bool filter toggle state}
      // maybe I dont need to do this in created() as a separate thing,
      //   maybe a computed property would be enough?

      // look at each entry in the filterList prop (i.e. an ingredient)
      // add the ingredient to each itag list on this.itags, for each on that
      //   ingredients own list of applied tags

      // recipeTypes have no list of ingredients, must be handled separately
      if (ing[1].type && ing[1].type == 'recipeType') {
        if (!this.itags['meals'])
          this.itags['meals'] = [ing[0]]
        else
          this.itags['meals'].push(ing[0])
      } else {
        // create array of iTags on this.itags if it doesn't exist yet
        ing[1].itags.forEach(iTag => {
          if (!this.itags[iTag])
            this.itags[iTag] = [ing[0]]
          else
            this.itags[iTag].push(ing[0])
        });
      }
    });
  },
  methods: {
    countSelected: function(itag) {
      let count = 0;
      for (let i = 0; i < this.itags[itag].length; i++) {
        if (this.tags[this.itags[itag][i]].state == true) {
          count += 1;
        }
      }
      return count;
    },
    emitToggle: function(name) {
      this.$emit('toggleBtn', name);
    },
  },
}
</script>

<style scoped>
.custom-overflow {
  overflow-y: scroll;
}
h4 {
  text-transform: capitalize;
}
</style>
