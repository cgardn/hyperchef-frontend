<template>
  <div>
    <div class="row rowStyle">
      <div class="col my-auto" :class="{strike : checkState}">
        {{name}}
      </div>
      <div class="col-2 my-auto" :class="{strike: checkState}">
        {{quant}} {{unit}}
      </div>
      <div class="col-2 my-auto">
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
  props: ["name", "quant", "unit"],
  data: function() {
    return {
      checkState: false,
    }
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
  opacity: 50%;
  text-decoration: line-through;
}
</style>
