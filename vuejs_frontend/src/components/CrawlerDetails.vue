<template>
  <v-row justify="center">
    <v-dialog
      v-model="openDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeDialog()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Process details</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-toolbar-items>
            <v-btn
              dark
              text
              @click="closeDialog"
            >
              Save
            </v-btn>
          </v-toolbar-items> -->
        </v-toolbar>
        <v-list
          three-line
          subheader
        >
          <!-- <v-subheader>Loading Products Data From Avito</v-subheader> -->
          <v-list-item>
            <v-list-item-content>
            <v-list-item-title v-if="activeCrawlerDetails.number_of_products_found != 0 && jobState != 'finished'"><i>Loading Products Data From Avito</i></v-list-item-title>
              <v-list-item-title v-if="activeCrawlerDetails.number_of_products_found != 0 && jobState != 'finished'">
                <v-progress-linear
                  v-model="percentage"
                  striped
                  color="light-blue"
                  height="20"
                >
                  <strong>{{ isNaN(percentage) ? 'Loading...' : percentage+'%'}}</strong>
                </v-progress-linear>
              </v-list-item-title>
              <v-list-item-title v-if="activeCrawlerDetails.number_of_products_found == 0 && jobState != 'finished'">
                <v-progress-linear
                  indeterminate
                  color="cyan"
                ></v-progress-linear>
              </v-list-item-title>
              <v-list-item-title v-if="jobState == 'finished'">
                <v-alert type="success" v-if="(activeCrawlerDetails.products_inserted  + 1) == activeCrawlerDetails.number_of_products_found && activeCrawlerDetails.number_of_products_found != 0">
                  <h1>Done !</h1>
                  <h2>{{activeCrawlerDetails.products_inserted  + 1}} / {{activeCrawlerDetails.number_of_products_found}} Products inserted in DB</h2>
                </v-alert>
                <v-alert type="info" v-if="(activeCrawlerDetails.products_inserted  + 1) != activeCrawlerDetails.number_of_products_found && activeCrawlerDetails.number_of_products_found != 0">
                  <h1>Info !</h1>
                  <h2>{{activeCrawlerDetails.products_inserted  + 1}} / {{activeCrawlerDetails.number_of_products_found}} Products inserted in DB</h2>
                </v-alert>
                <v-alert type="info" v-if="activeCrawlerDetails.number_of_products_found == 0">
                  <h1>Done !</h1>
                  <h2>{{activeCrawlerDetails.products_inserted  + 1}} Products inserted in DB</h2>
                </v-alert>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content v-if="jobState != 'finished'">
              <div class="text-center" v-if="activeCrawlerDetails.number_of_products_found != 0">
                <v-chip
                  class="ma-2"
                  color="success"
                  outlined
                  large
                >
                  <v-icon left>
                    mdi-radar
                  </v-icon>
                  <b style="margin-right: 5px">{{ activeCrawlerDetails.number_of_products_found }}</b> products found 
                </v-chip>


                <v-chip
                  class="ma-2"
                  color="deep-purple accent-4"
                  outlined
                  large
                >
                  <v-icon left>
                    mdi-alarm
                  </v-icon>
                  Estimated time to finish 
                  <b v-if="crawlertimeCounter == ''">...</b>
                  <b style="margin-left: 3px" v-else>{{ crawlertimeCounter }}</b>
                </v-chip>

              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Logs</v-subheader>
          <v-list-item>
            <v-textarea
              filled
              readonly
              rows="25"
              id="consolelogs"
              label="~avito-analyzer-server/crawlerlogs$"
              :value="getCrawlerLogfile"
            ></v-textarea>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>

import {mapActions, mapGetters} from "vuex"
  export default {
    name: 'CrawlerDetails',
    props:{
        openDialog: Boolean,
        percentage: 0,
        jobState: '',
        activeCrawlerDetails: {},
        crawlertimeCounter: ''
        
    },
    data () {
      return {
        notifications: false,
        sound: true,
        widgets: false,

        openDialogSwitch: false,
      }
    },
    
    watch:{
      openDialog(oldVal, newVal){
        console.log("OLD VAL:"+oldVal)
        console.log("NEW VAL:"+newVal)
        this.readCrawlerLogFile()
      }
    },

    computed: {
      ...mapGetters("Crawler",["getCrawlerLogfile"]),
    },

    methods: {
      ...mapActions('Crawler',['getLogfile']),

      closeDialog(){
        let openDialogSwitch = this.openDialog
        openDialogSwitch = false
        this.$emit('update-openDialog', openDialogSwitch)
      },

      crawlerLogfile(){
        let form = {}
        form ['task_id'] = (this.activeCrawlerDetails.task_id).toString()
        this.getLogfile(form)
      },

      readCrawlerLogFile(){

        let readLog = setInterval(function() {
        
        console.log("READING LOG FILE")
        this.crawlerLogfile()
        
        // Display the message when countdown is over
        console.log("Reading logs")
        console.log("JOBSTATE----> "+this.jobState)
        if (this.jobState == 'finished' || !this.openDialog) {
            clearInterval(readLog);
            console.log("Log file finished")
          }
        }
        .bind(this), 5000);
      }


    },
    

  }
</script>
<style scoped>

</style>