<template>
  <div @click="toggleDropdown">
    <h4 class="parent border py-2">{{capitalizedTitle}}</h4>
    <div class="child" v-if="isDropped" @click.stop>
        <slot class="fade-item"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientTagDropdown",
  computed: {
    capitalizedTitle: function() {
      return this.title[0].toUpperCase() + this.title.slice(1,)
    },
  },
  props: ['title', 'tagList'],
  data: function() {
    return {
      isDropped: false,
    }
  },
  methods: {
    toggleDropdown: function() {
      this.isDropped = !this.isDropped
    },
  },

};
</script>

<style scoped>
.parent:hover {
  background-color: rgba(10,10,10,0.2);
}
.parent {
  cursor: pointer;
}
.child:hover {
  background-color: rgba(0,0,0,0);
}
.child {
  cursor: text;
}
</style>
