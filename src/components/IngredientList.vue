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
        <div class="col">
          {{formatQuant(ingredient[2]*servingSize, ingredient[3])}}
        </div>
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
        <div class="col my-auto text-right">
          <button
            @click="isMetric = !isMetric"
            class="btn btn-secondary btn-sm"
            >Switch Units</button>
        </div>
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
      unitFactor: {
        'g': .035,
        'mL': .034,
      },
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
    formatQuant: function(amt, unit) {
      let converted = amt * this.unitFactor[unit];
      if (!this.isMetric && unit === 'g') {
        let oz = (converted % 16)
        let lbs = (converted - (oz))/16;
        return `${lbs > 0 ? `${lbs} lbs` : ''} ${oz > 0 ? `${oz.toFixed(2)} oz` : ''}`;
      } else if (!this.isMetric && unit === 'mL') {
        let floz = (converted % 128);
        let gal = (converted - floz)/128;
        return `${gal > 0 ? `${gal} gal` : ''} ${floz > 0 ? `${floz.toFixed(2)} fl. oz` : ''}`;
      } else {
        return `${amt} ${unit}`
      }
    },
  },
}
</script>
