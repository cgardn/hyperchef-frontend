<template>
  <div>
    <div class="row rowStyle">
      <div class="col my-auto py-1 pr-0" :class="{strike : checkState}">
        {{name}}
      </div>
      <div class="col-4 my-auto px-0 py-1" :class="{strike: checkState}">
        {{formattedQuant}} 
      </div>
      <div class="col-2 my-auto px-0 mr-1">
        <button class="btn btn-light" @click="toggleStrike">
          <img :class="{hideCheck : !checkState}" src="@/assets/done-24px.svg" class="imageStyle">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientItem",
  props: ["name", "quant", "unit", "isMetric"],
  data: function() {
    return {
      checkState: false,
      standardUnit: {
        'g': 'oz',
        'mL': 'fl. oz'
      },
      unitFactor: {
        'g': .035,
        'mL': .034,
      },
    }
  },
  computed: {
    formattedQuant: function() {
      let converted = Math.ceil(this.quant * this.unitFactor[this.unit]);
      if (!this.isMetric && this.unit === 'g') {
        let oz = (converted % 16)
        let lbs = (converted - (oz))/16;
        return `${lbs > 0 ? `${lbs} lbs` : ''} ${oz > 0 ? `${oz.toFixed(0)} oz` : ''}`;
      } else if (!this.isMetric && this.unit === 'mL') {
        let floz = (converted % 128);
        let gal = (converted - floz)/128;
        return `${gal > 0 ? `${gal} gal` : ''} ${floz > 0 ? `${floz.toFixed(0)} fl. oz` : ''}`;
      } else {
        return `${this.quant} ${this.unit}`
      }
    },
  },
  created: function() {
    if (this.$state.getList('shoppingList').includes(this.name)) {
      this.checkState = true;
    }
  },
  methods: {
    toggleStrike: function() {
      this.checkState = !this.checkState;
      if (this.checkState) {
        this.$state.addCheckedIngredient(this.name)
      } else {
        this.$state.removeCheckedIngredient(this.name)
      }
    }
  },
}
</script>

<style scoped>
.btn:focus, .btn-light:focus {
  color: none;
  border-color: none;
  box-shadow: none;
}
.hideCheck {
  visibility: hidden;
}
.imageStyle {
  width: 17px;
}
.rowStyle {
  height: 3em;
}
.strike {
  background-color: grey;
  opacity: 0.5;
  text-decoration: line-through;
}
</style>
