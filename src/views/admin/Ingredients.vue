<template>
  <div class="container bg-light py-3">
    <div class="row">
      <div class="col pb-3">
        <button @click="getIngredient('new')">New Ingredient</button>
      </div>
    </div>
    <div class="row">
      <div class="col" v-if="ingredientView">
        <button @click="back">Back</button>
        <IngredientForm
          :ingredientId="currentIngredient"
        ></IngredientForm>
      </div>

      <div v-else class="col border"
        v-for="(ing, idx) in ingredientList" :key="idx">
        <a @click="getIngredient(ing[0])">
          <span>{{ing[1]}}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import IngredientForm from '@/views/admin/IngredientForm'
export default {
  name: "Ingredients",
  components: { IngredientForm },
  data: function() {
    return {
      ingredientView: false,
      ingredientList: [],
      currentIngredient: '',
    }
  },
  created: async function() {
    await this.$axios.get(
      `${this.$backend}/api/${this.$apiVersion}/admin/ingredients`,
      {
        headers: {
          authorization: sessionStorage.getItem('token'),
        },
      }
    ).then( res => {
      if (res.status == 200) {
        this.ingredientList = res.data;
      }
    });
  },
  methods: {
    back: function() {
      this.ingredientView = false
    },
    getIngredient: function(id) {
      this.ingredientView = true;
      this.currentIngredient = id;
    },
  },
};
</script>
