<template>

  <div class="card">
    <div v-for="(attr, idx) in Object.keys(formData)" :key="idx">
      <div v-if="attr == 'actions'">
        <h4>Actions</h4>
        <div v-for="(step, idy) in Object.keys(formData[attr])" :key="idy">
          <span>{{Number(step)+1}}</span>
          <br />
          <input type="text" v-model="formData[attr][step][0]">
          <br />
          <textarea v-model="formData[attr][step][1]" cols="50" rows="5"></textarea>
        </div>
        <button @click="addAction">Add Action</button>
      </div>
      <div v-else-if="!dontEdit.includes(attr)">
        <span>{{attr}} </span>
        <input type="text" v-model="formData[attr]">
      </div>
      <div v-else>
        <span>{{attr}} : {{formData[attr]}}</span>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "RecipeForm",
  props: ["recipe", "new"],
  computed: {
    formData: function() {
      return (this.new ? this.blankForm : this.recipe);
    },
  },
  data: function() {
    return {
      blankForm: {
        slug: "",
        name: "",
        origin: "",
        author: "",
        actions: [],
        views: "",
        saves: "",
        card_image_path: "",
        cook_time: "",
        prep_time: "",
        difficulty: "",
        time_score: "",
        ingredient_score: "",
        ingredientTags: [],
        types: [],
      },
      dontEdit: ["slug", "views", "saves", "time_score", "ingredient_score",
        "ingredientTags"],
    }
  },
  methods: {
    addAction: function() {
      // get length of actions, add another object keyed to step number, 
      //   set to ['',''] -> (that's [header,body] of action)
      let next = Object.keys(this.formData.actions).length + 1;
      this.formData.actions[next] = ['','']
    },
  },
}
</script>
