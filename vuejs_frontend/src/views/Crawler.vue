<template>
  <v-container>
  <nav-bar/>
  <span style="display: none">{{displayOtherServerErrors}}</span>
  <create-crawler 
    :openCreateForm="triggerOpenCreateForm"
    :refreshCrawlerListData="refreshCrawlers" 
    @update-openCreateForm="updateCreateForm"
    @update-crawlersList="refreshCrawlerList"/>
  <crawlers-list 
    v-show="crawlersList"
    :refreshCrawlerListData="refreshCrawlers"
  />
  <products-data
    v-show="productsData"
  />
  <v-fab-transition>
        <v-btn
          :disabled="getOtherErrors.length > 0 ? true : false"
          color="blue"
          fixed
          fab
          large
          dark
          bottom
          right
          class="v-btn--create"
          v-on:click="triggerOpenCreateForm = true"
        >
          <v-icon>mdi-pen</v-icon>
        </v-btn>
    </v-fab-transition>
  <!-- Server errors -->
      <v-snackbar
        v-model="snackbar"
        color="red"
        :vertical="true"
      >
      <v-icon>mdi-alert</v-icon>
      <strong style="margin-left: 5px">Oops!...Something is wrong</strong>
        <ul>
          <li v-for="(error, index) in getOtherErrors" :key="index">{{error}}</li>
        </ul>
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
</v-container>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import CreateCrawler from '../components/CreateCrawler.vue'
import CrawlersList from '../components/CrawlersList.vue'
import ProductsData from '../components/ProductsData.vue'
import {mapActions,mapGetters} from "vuex"

  export default {
    name: 'Crawler',

    data: () => ({
      snackbar: false,
      triggerOpenCreateForm: false,
      refreshCrawlers: false,
    }),
    
    components: {
        NavBar,
        CreateCrawler,
        CrawlersList,
        ProductsData   
    },
    computed: {
      ...mapGetters("Crawler",["getOtherErrors"]),

      displayOtherServerErrors(){
        if(this.getOtherErrors == null || this.getOtherErrors.length == 0)
          return this.snackbar = false
        return this.snackbar = true
      },


      productsData() {
        if(this.$route.name == "products_data") {
          return true
        }
        return false
      },
      crawlersList() {
        if(this.$route.name == "crawlers_list") {
          return true
        }
        return false
      }
    },

    methods: {
      updateCreateForm(openCreateForm){
        this.triggerOpenCreateForm = openCreateForm
      },

      refreshCrawlerList(){
          this.refreshCrawlers = true
      },
    }
    

  }
</script>
