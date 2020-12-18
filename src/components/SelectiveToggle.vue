<template>
  <div>
    <span>
      <span id="label">
        {{this.name}}
      </span>
      <button id="exclude" @click="excludeClick()">&#128473;</button>
      <button id="include" @click="includeClick()"><b>&#10003;</b></button>
    </span>
  </div>
</template>

<script>
export default {
  name: "SelectiveToggle",
  props: ["name"],
  methods: {
    excludeClick: function() {
    },
    includeClick: function() {
    },
    emitState: function(newState) {
      this.$emit('setSelectiveState', this.name, newState);
    },
    
  },
}
</script>

<style scoped>
#label {
  margin-right: 5px;
}
button {
  border: 1px solid grey;
  padding-bottom: 3px;
}
#exclude {
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
}
#include {
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  border-left-width: 0;
  padding-right: 8px;
}
</style>
