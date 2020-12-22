<template>
  <div class="container ">
    <span @click="showForm = !showForm">{{data.name}}</span>
    <div v-if="showForm" class="outlined">
      <hr />

      <div v-for="(key, idx) in Object.keys(data)" :key="idx">
        <div v-if="key !== 'tags' && key !== 'units'">
          <span>{{key}} : </span>
          <input v-model="data[key]">
        </div>
        <div v-else-if="key == 'units'">
          <h6>Units:</h6>
          <div v-for="(key, idz) in Object.keys(data['units'])" :key="idz">
            <span>{{key}}</span>
            <input v-model="data['units'][key][0]">
            <input v-model="data['units'][key][1]">
          </div>
        </div>
        <div v-else>
          <h6>Ingredient Tags:</h6>
          <span v-for="(tagId, idy) in Object.keys(iTags)" :key="idy">
            <input
              type="checkbox"
              :id="Number(tagId)"
              :value="tagId"
              v-model="data.tags"
            >
            <label :for="tagId">{{iTags[tagId]['name']}}</label>
          </span>
        </div>
      </div>
      <button @click="submit">Submit</button>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientForm",
  props: ["data", "id"],
  data: function() {
    return {
      showForm: false,
      iTags: JSON.parse(sessionStorage.getItem('adminData'))['ingredient_tags'],
    }
  },
  methods: {
    submit: async function() {
      this.$axios.patch(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredients/${this.id}`,
        this.data,
        {
          headers: {
            authorization: sessionStorage.getItem('token')
          }
        }
    )},
  },
}
</script>

<style scoped>
.outlined {
  border: 2px thin black;
}
</style>
