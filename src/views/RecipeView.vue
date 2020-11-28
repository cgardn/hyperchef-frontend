<template>
  <div>
    <h2>{{recipe.name}}</h2>
    <div>
      <h4>Equipment you'll need</h4>
      <p
        v-for="(equip, idx) in recipe.equipment"
        :key="idx"
      >{{equip.name}}</p>
    </div>
    <div>
      <h4>Ingredients</h4>
      <table>
      <tr
        v-for="(ingredient, idx) in recipe.ingredients"
        :key="idx"
      >
        <td>{{ingredient.name}}</td>
        <td v-if="isMetric">{{ingredient.units.metric_show[0]}} {{ingredient.units.metric_show[1]}}</td>
        <td v-else>{{ingredient.units.imperial_show[0]}} {{ingredient.units.imperial_show[1]}}</td>
      </tr>
            
      </table>
    </div>

    <button @click="switchUnits()">
      <span v-if="isMetric">Switch to Imperial units</span>
      <span v-else>Switch to Metric units</span>
    </button>

    <div>
      <h4>Steps:</h4>
      <p
        v-for="(step, idx) in recipe.actions"
        :key="idx"
      >
        <b>{{step[0]}}</b>
        <br />
        <span>{{step[1]}}</span>
      </p>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "RecipeView",
  data: function() {
    return {
      isMetric: true,
      recipe: {},
    }
  },
  props: [ "recipeSlug" ],
  methods: {
    switchUnits: function() {
      this.isMetric = !this.isMetric;
    },
  },
  mounted: async function() {
    this.$axios({
      method: 'GET',
      url: `http://192.168.1.203:3000/api/${this.recipeSlug}`,
    }).then( res => {
      if (res.status == 200) {
        this.recipe = res.data;
      }
    })
  },
}
</script>
