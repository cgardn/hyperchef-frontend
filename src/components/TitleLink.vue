<template>
  <h1>
    <a href="/">
    {{text}}
    </a>
  </h1>
</template>

<script>
export default {
  name: "TitleLink",
  props: ["text"],
}
</script>

<style scoped>
h1 {
  margin: auto;
  text-align: center;
}
a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}
</style>
