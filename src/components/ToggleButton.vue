<template>
  <button 
    type="button" 
    class="border-0 br-pill mb-2 mx-1 toggleButton"
    :class="{'btn-info': active, 'btn-outline-info': !active}"
    @click="toggleClick"
    >
      <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ToggleButton",
  props: ["active"],
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
</style>
