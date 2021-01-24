<template>
  <div class="container bg-light py-3">
    <div class="row">
      <div class="col">
        <input type="text" v-model="newTag">
        <button @click="newIngredientTag(newTag)">Create New Tag</button>
      </div>
    </div>
    <hr />
    <div class="row" v-for="tag in tagList" :key="tag[0]">
      <div class="col">
        <input type="text" v-model="tag[1]">
        <button @click="updateTag(tag[0], tag[1])">Update</button>
        <button @click="deleteTag(tag[0])">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientTags",
  created: async function() {
    this.$axios.get(
      `${this.$backend}/api/${this.$apiVersion}/admin/ingredient_tags`,
      {
        headers: {
          authorization: sessionStorage.getItem('token'),
        },
      }
    ).then( res => {
      if (res.status == 200) {
        this.tagList = res.data.sort( (a,b) => {
          return (a[1] > b[1]) ? 1 : -1;
        });
      }
    });
  },
  data: function() {
    return {
      newTag: "",
      tagList: [],
    }
  },
  methods: {
    newIngredientTag: function(newName) {
      this.$axios.post(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredient_tags/`,
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
    updateTag: function(tagId, newName) {
      this.$axios.patch(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredient_tags/${tagId}`,
        {
          id: tagId,
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
    deleteTag: function(tagId) {
      this.$axios.delete(
        `${this.$backend}/api/${this.$apiVersion}/admin/ingredient_tags/${tagId}`,
        {
          id: tagId,
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
