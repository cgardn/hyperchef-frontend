<template>
  <div class="container">
    <div class="card bg-grey px-2 py-2">
      <h4>Ingredients</h4>
      <div 
        class="row"
        v-for="(ingredient, idx) in ingredients"
        :key="idx"
      >
        <div class="col-8">{{ingredient.name}}</div>
        <div class="col" align="right" v-if="isMetric">{{ingredient.units.metric_show[0]}} {{ingredient.units.metric_show[1]}}</div>
        <div class="col" align="right" v-else>{{ingredient.units.imperial_show[0]}} {{ingredient.units.imperial_show[1]}}</div>
        <div class="col-1"></div>
      </div>
          
      <div class="row ml-auto justify-content-end">
        <div class="col" width="100%">
          <button @click="toMetric()">
            <span>Metric</span>
          </button>
        </div>
        <div class="col pl-0 pr-3">
          <button @click="toImperial()">
            <span>Imperial</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientList.vue",
  props: ["ingredients"],
  data: function() {
    return {
      isMetric: true,
    }
  },
  methods: {
    toMetric: function() {
      this.isMetric = true;
    },
    toImperial: function() {
      this.isMetric = false;
    },
  },
}
</script>
