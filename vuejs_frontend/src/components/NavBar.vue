<template>
<div>
      <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-toolbar-title>Project PFE</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        text
        :href="kibana_href">
        <v-icon left>mdi-monitor-dashboard</v-icon>
        Kibana
      </v-btn>
      <v-btn
        text
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path">
        <v-badge
          v-if="item.id == 2 && getJobState != 'finished'"
          dot
          left
          :bordered="false"
          color="red"
          overlap
        >
          <v-icon left dark>{{ item.icon }}</v-icon>
        </v-badge>
        <v-icon left dark v-else>{{ item.icon }}</v-icon>
        <span class="mr-2" v-if="item.id == 1 && getProductsDataFromDB.length > 0">
          <v-badge
            color="green"
            left
            :content="getProductsDataFromDB.length > 999 ? '+1k': getProductsDataFromDB.length"
          >
          {{ item.title }}
          </v-badge>
        </span>
        <span class="mr-2" v-else-if="item.id == 1">
          {{ item.title }}
        </span>
        <span class="mr-2" v-else>
          {{ item.title }}
        </span>
      </v-btn>
      <v-chip
        class="ma-2"
        color="green"
        text-color="white"
        v-if="getUser != null"
      >
        <v-icon left dark>mdi-account-tie</v-icon>
        {{ getUser.username }}
      </v-chip>
      <v-chip
        class="ma-2"
        :color="getOtherErrors.length > 0 ? 'black' : 'green'"
        text-color="white"
      >
        <v-icon left dark>{{ getOtherErrors.length > 0 ? 'mdi-server-off' : 'mdi-server' }}</v-icon>
        {{ getOtherErrors.length > 0 ? 'Server Error' : 'Server Running' }}
      </v-chip>
      <v-btn
        text
        @click="logout()">
        <span class="mr-2">Logout</span>
        <v-icon left dark>mdi-logout</v-icon>
      </v-btn>
      
    </v-app-bar>
    <v-overlay :value="isLogoutLoading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    
</div>
</template>

<script>
import {mapActions,mapGetters} from "vuex"

export default {
  name: "NavBar",
  data(){
    return {
      appTitle: 'PFE Project',
      kibana_href: "http://"+location.hostname+":5601/",
      sidebar: false,
      menuItems: [
          { title: 'Products Data', path: '/products_data', icon: 'mdi-database', id: 1 },
          { title: 'Crawlers', path: '/crawlers_list', icon: 'mdi-spider', id: 2 },
     ],
    }
  },

  watch: {
    getJobState(oldVal, newVal){
      console.log("OLD VAL C: "+oldVal)
      console.log("NEW VAL C: "+newVal)
      this.readDBCount()

    }
  },

  methods: {
    ...mapActions('Auth',['logout']),
    ...mapActions('Crawler',['getProductsData']),

    readDBCount(){
      let productsCount = setInterval(function() {
        console.log("Products Count")
        this.getProductsData()
        
        // Display the message when countdown is over
        
        if (this.getJobState == 'finished') {
            clearInterval(productsCount);
            console.log("Products Count finished")
          }
        }
        .bind(this), 5000);
    }

    
  },
  computed: {
    ...mapGetters("Auth", ["getUser"]),
    ...mapGetters("Auth", ["isLogoutLoading"]),
    ...mapGetters("Crawler",["getJobState"]),
    ...mapGetters("Crawler",["getOtherErrors"]),
    ...mapGetters("Crawler",["getProductsDataFromDB"]),
    

  }

};

</script>
