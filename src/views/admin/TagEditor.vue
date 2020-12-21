<template>
  <div class="container">
    <span>ID: {{id}} </span>
    <span>Name: </span><input type="text" v-model="data">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TagEditor",
  props: ["id", "data"],
}
</script>
