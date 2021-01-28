<template>
  <div class="container bg-light py-3">
    <div class="row">
      <div class="col">
        <input type="text" v-model="newType">
        <button @click="newRecipeType(newType)">Create New Type</button>
      </div>
    </div>
    <hr />
    <div class="row" v-for="type in typeList" :key="type[0]">
      <div class="col">
        <input type="text" v-model="type[1]">
        <button @click="updateType(type[0], type[1])">Update</button>
        <button @click="deleteType(type[0])">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeTypes",
  created: async function() {
    this.$axios.get(
      `${this.$backend}/api/${this.$apiVersion}/admin/recipe_types`,
      {
        headers: {
          authorization: sessionStorage.getItem('token'),
        },
      }
    ).then( res => {
      if (res.status == 200) {
        this.typeList = res.data.sort( (a,b) => {
          return (a[1] > b[1]) ? 1 : -1;
        });
      }
    });
  },
  data: function() {
    return {
      newType: "",
      typeList: [],
    }
  },
  methods: {
    newRecipeType: function(newName) {
      this.$axios.post(
        `${this.$backend}/api/${this.$apiVersion}/admin/recipe_types/`,
        {
          name: newName,
        },
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then( res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      });
    },
    updateType: function(typeId, newName) {
      this.$axios.patch(
        `${this.$backend}/api/${this.$apiVersion}/admin/recipe_types/${typeId}`,
        {
          id: typeId,
          name: newName,
        },
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then( res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      });
    },
    deleteType: function(typeId) {
      this.$axios.delete(
        `${this.$backend}/api/${this.$apiVersion}/admin/recipe_types/${typeId}`,
        {
          id: typeId,
        },
        {
          headers: {
            authorization: sessionStorage.getItem('token'),
          },
        }
      ).then( res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      });
    }
  },
}
</script>
