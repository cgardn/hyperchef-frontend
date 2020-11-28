import Vue from 'vue'
import Router from 'vue-router'

// Page components
import Home from './views/Home.vue';
import RecipeView from './views/RecipeView.vue';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/recipe/:recipeSlug',
      component: RecipeView,
      props: true,
    },
  ]
});

export default router;
