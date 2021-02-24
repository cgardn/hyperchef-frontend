<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: "App",
  mounted: function() {
    this.$state.recoverGrocery();
  },
}
</script>

<style lang="scss">
@import "./styles/custom-bootstrap";
body {
  background: $theme-bg;
}
</style>
