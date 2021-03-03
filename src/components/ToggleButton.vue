<template>
  <button 
    type="button" 
    class="border-0 br-pill mb-2 mx-1 toggleButton"
    :class="{
      'btn-info': included, 
      'btn-exclude': excluded,
      'btn-outline-info': neutral,
    }"
    @click="toggleClick"
    >
      <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ToggleButton",
  props: ["active", "state"],
  computed: {
    included: function() {
      return this.state === 'in'
    },
    excluded: function() {
      return this.state === 'out'
    },
    neutral: function() {
      return this.state === 'off'
    },
  },
  methods: {
    toggleClick: function() {
      this.$emit("click");
    }
  },
}
</script>

<style scoped>
.br-pill {
  border-radius: 15px;
}
.btn-outline-info:hover {
  background-color: #fff;
  color: #17a2b8;
}
.btn-exclude {
  background-color: red;
  color: #eee;
}
</style>
