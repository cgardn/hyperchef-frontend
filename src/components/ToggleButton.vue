<template>
  <button 
    type="button" 
    class="btn"
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
.btn-outline-info:hover {
  background-color: #fff;
  color: #17a2b8;
}
</style>
