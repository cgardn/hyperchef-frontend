<template>
  <div class="container">

    <!-- hero image -->
    <div class="row">
      <div class="col-12" align="center">
        <img class="img-fluid mt-5" src="@/assets/arcadetitle.png" />
      </div>
    </div>

    <!-- subheader -->
    <div class="row my-3">
      <div class="col text-center">
        <h2>Level up your cooking</h2>
      </div>
    </div>

    <!-- recipe list -->
    <div class="row">
      <div 
        v-if="loadingRecipesSpinner"
        class="col-2 mt-5 mx-auto text-light"
        align="center"
      >
        <h2>Loading...</h2>
      </div>
      <PaginatedResults
        v-else
        :isFiltersVisible="isFilterPanelVisible"
        :isGroceryListVisible="isGroceryListVisible"
        :recipeBatch="visibleRecipes"
        :recipeCount="Object.keys(all_recipes).length"
      >
      <!-- filterbutton slot for layout reasons -->
        <template v-slot:filterButtons>
          <div>
            <!-- filter open/close button -->
            <button
              class="btn btn-height"
              :class="{
                'btn-info': isFilterPanelVisible, 
                'btn-light': !isFilterPanelVisible,
              }"
              @click="toggleFilterPanel()"
            >
              <img src="../assets/filter_alt-24px.svg">
              <span
                class="filterBadge"
                v-if="selectedFilters.length > 0"
              >
               {{selectedFilters.length}}</span>
            </button>

            <!-- clear filters button -->
            <button
              v-if="selectedFilters.length > 0 && isFilterPanelVisible"
              class="btn bg-light btn-height ml-4"
              @click="clearSelectedFilters">
              <span>Clear {{selectedFilters.length}} filters</span>
            </button>
          </div>
        </template>

        <template v-slot:groceryListButton>
          <div v-if="!isFilterPanelVisible" class="col-4">
            <button
              class="btn btn-height"
              :class="{
                'btn-info': isGroceryListVisible, 
                'btn-light': !isGroceryListVisible,
              }"
              @click="toggleGroceryList()"
            >
            <img src="../assets/baseline_receipt_long_black_18dp.png">
            </button>
          </div>
        </template>
        <template v-slot:groceryList>
          <GroceryList></GroceryList>
        </template>

        <template v-slot:filterPanel>
          <FilterPanel
            :filterList="all_filters"
            :visibleCount="visibleRecipes.length"
            :allCount="Object.keys(all_recipes).length"
            @toggleBtn="rotateFilter"
            @clearBtn="clearSelectedFilters"
            ></FilterPanel>
        </template>
      </PaginatedResults>
    </div>
  </div>
</template>

<script>
import PaginatedResults from '@/components/PaginatedResults'
import FilterPanel from '@/components/FilterPanel'
import GroceryList from '@/components/GroceryList'

export default {
  name: "Home",
  components: {
    PaginatedResults,
    FilterPanel,
    GroceryList,
  },
  data: function() {
    return {
      all_filters: {},
      all_recipes: {},
      sorted_recipe_ids: {},
      selectedFilters: [],
      excludedFilters: [],
      visibleRecipes: [],
      query: "",
      isFilterPanelVisible: false,
      isGroceryListVisible: false,
      loadingRecipesSpinner: false,
    }
  },
  computed: {
    staleRecipes: function() {
      return localStorage.getItem('all_recipes') == null;
    },
  },
  methods: {
    getSelectedFilters: function() {
      //this.selectedFilters = Object.keys(this.all_filters).filter(tag => this.all_filters[tag].state === true);
      this.selectedFilters = Object.keys(this.all_filters).filter(tag => this.all_filters[tag].state === 'in');
      this.excludedFilters = Object.keys(this.all_filters).filter(tag => this.all_filters[tag].state === 'out');
    },
    clearSelectedFilters: function() {
      this.selectedFilters.forEach(tag => {
        this.all_filters[tag].state = false;
        //this.all_filters[tag].state = 'out';
      });
      this.selectedFilters = [];
      this.parseData();
    },
    getVisibleRecipes: function() {
      // start with all recipe ids
      let master = Object.keys(this.all_recipes).map(i => Number(i));
      // separate accumulation array (for stacking unions)
      this.visibleRecipes = [];
      // for each selected 'in' filter, intersect that tag's recipes with 
      //   master recipe list and union the result with the accumulation array
      this.selectedFilters.forEach(tag => {
        this.visibleRecipes = this.unionArrays(this.visibleRecipes, this.intersectArrays(master, this.sorted_recipe_ids[tag]));
      });

      // after all inclusions, remove any recipes that contain something from
      //   the exclusion list. If there's no inclusions, use the master list
      this.excludedFilters.forEach(tag => {
        if (this.selectedFilters.length <= 0) {
          this.visibleRecipes = this.diffArrays(master, this.sorted_recipe_ids[tag]);
        } else {
          this.visibleRecipes = this.diffArrays(this.visibleRecipes, this.sorted_recipe_ids[tag]);
        }
      });

      // when all sorting done, map numerical ids to actual recipe data
      this.visibleRecipes = this.visibleRecipes.map(id => this.all_recipes[id]);
    },
    unionArrays: function(arr1, arr2) {
      // returns the union of the two arrays
      return [...new Set([...arr1, ...arr2])]
    },
    intersectArrays: function(arr1, arr2) {
      // intersection of two arrays
      return arr1.filter(x => arr2.includes(x))
    },
    diffArrays: function(arr1, arr2) {
      // difference of two arrays
      // arr1 must be the array with the stuff you want to keep
      // arr2 is the list of things you don't want in arr1
      // difference should be the last operation, because
      //   exclusion always overrides inclusion (you can't include something 
      //   if it's already gone, you won't know to include it)
      return arr1.filter(x => !arr2.includes(x));
    },
    toggleFilter: function(fName) {
      this.all_filters[fName].state = !this.all_filters[fName].state;
      this.getSelectedFilters();
      this.getVisibleRecipes();
    },
    rotateFilter: function(fName) {
      let curState = this.all_filters[fName].state;
      let rotation = {'off': 'in', 'in': 'out', 'out': 'off'}
      this.all_filters[fName].state = rotation[curState]

      this.getSelectedFilters();
      this.getVisibleRecipes();
    },
    toggleFilterPanel: function() {
      this.isFilterPanelVisible = !this.isFilterPanelVisible;
      this.isGroceryListVisible = false;
    },
    toggleGroceryList: function() {
      this.isGroceryListVisible = !this.isGroceryListVisible;
      this.isFilterPanelVisible = false;
    },
    getRecipes: async function() {
      this.loadingRecipesSpinner = true;
      await this.$axios({
        method: 'GET',
        url: `${this.$backend}/api/${this.$apiVersion}/recipes`,
      }).then( res => {
        if (res.status == 200) {
          localStorage.setItem('recipeGraph', JSON.stringify(res.data));
          this.parseData();
        }
      });
      this.loadingRecipesSpinner = false;
    },
    parseData: function() {
      let data = JSON.parse(localStorage.getItem("recipeGraph"));
      this.all_recipes = data.all_recipes;
      this.all_filters = data.all_filters;
      Object.keys(this.all_filters).forEach( tag => {
        this.all_filters[tag].state = 'off';
      });
      this.sorted_recipe_ids = data.sorted_recipe_ids;
      this.visibleRecipes = Object.keys(this.all_recipes).map(id => this.all_recipes[id]);
    },
  },
  mounted: async function() {
    this.getRecipes();
  },
}
</script>

<style scoped>
.filterBadge {
  position: absolute;
  top: -10px;
  left: 53px;
  padding: 1px 8px;
  border-radius: 50%;
  background: red;
  color: white;
}
.btn-height {
  height: 45px;
}
.filterButton {
  font-size: 2em;
}
.cancelIcon {
  color: red;
}
img {
}
form {
  flex: 1 100%;
  text-align: center;
  margin: auto;
  margin-top: 15%;
}

form > * {
  font-size: 1.8em;
}

form > input {
  height: 2em;
  border: none;
}

button {
  text-align: center;
  margin: auto;
}

</style>
