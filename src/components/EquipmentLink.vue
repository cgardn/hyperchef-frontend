<template>
  <div class="container">
    <a v-if="equipment.affiliate_link" :href="equipment.affiliate_link" target='_blank'>{{equipment.name}}</a>
    <span v-else>
      {{equipment.name}}
    </span>
  </div>
</template>

<script>
export default {
  name: "EquipmentLink",
  props: ["equipment"],
}
</script>
