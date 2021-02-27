<template>
  <div>
    <div class="card bg-grey px-2 py-2">
      <h4>Ingredients</h4>
      <div 
        class="row"
        v-for="(ingredient, idx) in ingredients"
        :key="idx"
      >
        <div class="col-8">{{ingredient[1]}}</div>
        <div class="col" v-if="isMetric">
          {{ingredient[2]*servingSize}}
          {{ingredient[3]}}
        </div>
        <!-- hidden until conversion map implemented
        <div class="col" v-else>
          {{ingredient.units.imperial_show[0]*servingSize}}
          {{ingredient.units.imperial_show[1]}}
        </div>
        -->
      </div>
          
      <div class="row mt-2">
        <!-- serving sizes -->
        <div class="col my-auto">
          <button 
            @click="changeServings(-1)"
            class="btn btn-secondary btn-sm mr-2"
            :disabled="servingSize <= 1"
            >
            <span>-1</span>
          </button>
          <span>{{servingSize}}</span>
          <button 
            @click="changeServings(+1)"
            class="btn btn-secondary btn-sm ml-2"
            >
            <span>+1</span>
          </button>
        </div>

        <!-- TODO units button hidden until conversion map implemented  
        <div class="col" align=right width="100%">
          <button 
            class="btn btn-secondary"
            @click="toggleUnits()">
            <span>Units</span>
          </button>
        </div>
        -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientList",
  props: ["ingredients"],
  data: function() {
    return {
      isMetric: true,
      servingSize: 1,
    }
  },
  methods: {
    toggleUnits: function() {
      this.isMetric = !this.isMetric;
    },
    changeServings: function(amt) {
      this.servingSize += amt;
      this.$emit("changeServings", this.servingSize);
    },
  },
}
</script>
