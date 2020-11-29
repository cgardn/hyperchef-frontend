<template>
  <div class="container">
    <a :href="equipment.affiliate_link" target='_blank'>{{equipment.name}}</a>
  </div>
</template>

<script>
export default {
  name: "EquipmentLink",
  props: ["equipment"],
}
</script>
