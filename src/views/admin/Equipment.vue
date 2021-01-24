<template>
  <div class="container bg-light py-3">
    <div class="row">
      <div class="col">
        <input type="text" v-model="newEquip">
        <button @click="newEquipment(newEquip)">Create New Tag</button>
      </div>
    </div>
    <hr />
    <div class="row" v-for="equipment in equipList" :key="equipment[0]">
      <div class="col">
        <input type="text" v-model="equipment[1]">
        <button @click="updateEquipment(equipment[0], equipment[1])">
          Update
        </button>
        <button @click="deleteEquipment(equipment[0])">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Equipment",
  created: async function() {
    this.$axios.get(
      `${this.$backend}/api/${this.$apiVersion}/admin/equipment`,
      {
        headers: {
          authorization: sessionStorage.getItem('token'),
        },
      }
    ).then( res => {
      if (res.status == 200) {
        this.equipList = res.data.sort( (a,b) => {
          return (a[1] > b[1]) ? 1 : -1;
        });
      }
    });
  },
  data: function() {
    return {
      newEquip: "",
      equipList: [],
    }
  },
  methods: {
    newEquipment: function(newName) {
      this.$axios.post(
        `${this.$backend}/api/${this.$apiVersion}/admin/equipment/`,
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
    updateEquipment: function(itemId, newName) {
      this.$axios.patch(
        `${this.$backend}/api/${this.$apiVersion}/admin/equipment/${itemId}`,
        {
          id: itemId,
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
    deleteEquipment: function(id) {
      this.$axios.delete(
        `${this.$backend}/api/${this.$apiVersion}/admin/equipment/${id}`,
        {
          id: id,
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
