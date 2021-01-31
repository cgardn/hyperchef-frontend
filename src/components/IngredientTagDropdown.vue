<template>
  <div @click="toggleDropdown" class="container px-0">
    <div
      class="row parent border"
      :class="{'hover-color': isMobile}"
    >
      <div class="col-8 pl-2">
        <h5 class="py-2 my-auto">
          <span class="close-icon" v-if="isDropped && isMobile">&#8722;</span>
          <span class="open-icon" v-if="!isDropped && isMobile">&#43;</span>
          <span class="pl-2">{{capitalizedTitle}}</span>
        </h5>
      </div>
      <div class="col ml-auto">
        <h6 class="selected-count ml-auto py-2 mt-1 mb-0" v-if="count > 0">{{count}} selected</h6>
      </div>
    </div>
    <div class="row pt-2 px-1" v-if="isDropped || !isMobile" @click.stop>
      <slot class="fade-item"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "IngredientTagDropdown",
  computed: {
    isMobile: function() {
      return this.windowWidth < 768;
    },
    capitalizedTitle: function() {
      return this.title[0].toUpperCase() + this.title.slice(1,)
    },
  },
  props: ['title', 'count'],
  mounted: function() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
  data: function() {
    return {
      isDropped: false,
      windowWidth: window.innerWidth,
    }
  },
  methods: {
    toggleDropdown: function() {
      if (this.isMobile) {
        this.isDropped = !this.isDropped
      }
    },
  },

};
</script>

<style scoped>
.open-icon {
  color: grey;
  position: relative;
  top: -1px;
}
.close-icon {
}
.selected-count {
  font-size: 0.9em;
  color: grey;
  opacity: 0.9;
}
.hover-color:hover {
  background-color: rgba(10,10,10,0.2);
}
.parent {
  cursor: pointer;
}
</style>
