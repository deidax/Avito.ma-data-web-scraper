<template>
   <v-app id="inspire">
      <v-main>
        <v-card>
          <v-card-title>
            Crawlers List
            <!-- {{getRunningCrawlerTaskId['task_id']}} -->
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="getCrawlers"
            :search="search"
            class="elevation-1"
            :loading="isLoading"
            loading-text="Loading... Please wait">
            <template v-slot:item.name="{ item }">
              <b>{{item.name}}</b>
            </template>
            <template v-slot:item.start_url="{ item }">
              <a :href="item.start_url" target="_blank">{{item.start_url}}</a>
            </template>
            <template v-slot:item.state="{ item }">
                <span v-if="getCrawlerInfo(item.task_id) != null && crawlerButtonControlSwitch(item.task_id) ">
                  <!-- {{ getJobState }} -->
                  <v-chip
                    class="ma-2"
                    small
                    v-if="getJobState == 'pending'"
                  >
                  <v-icon left small>
                    mdi-cog-sync
                  </v-icon>
                    {{getJobState}}
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    small
                    color="red"
                    text-color="white"
                    v-else-if="getJobState == 'running'"
                  >
                    <span style="margin: 3px">
                      <i  class="fas fa-cog fa-spin" style="color:white"></i>
                    </span>
                      {{getJobState}}
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    small
                    color="green"
                    text-color="white"
                    v-else-if="getJobState == 'finished'"
                  >
                  <v-icon left small>
                    mdi-check-all
                  </v-icon>
                  {{getJobState}}
                  </v-chip>
                </span>
                <span v-else-if="getCrawlerInfo(item.task_id) != null">
                  <!-- {{getCrawlerInfo(item.task_id).state}} -->
                  <v-chip
                    class="ma-2"
                    small
                    v-if="getCrawlerInfo(item.task_id).state == 'pending'"
                  >
                    {{getCrawlerInfo(item.task_id).state}}
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    small
                    color="red"
                    text-color="white"
                    v-else-if="getCrawlerInfo(item.task_id).state == 'running'"
                  >
                    <span style="margin: 3px">
                      <i class="fas fa-cog fa-spin" style="color:white"></i>
                    </span>
                    {{getCrawlerInfo(item.task_id).state}}
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    small
                    color="green"
                    text-color="white"
                    v-else-if="getCrawlerInfo(item.task_id).state == 'finished'"
                  >
                  <v-icon left small>
                    mdi-check-all
                  </v-icon>
                  {{getCrawlerInfo(item.task_id).state}}
                  </v-chip>
                </span>
                <span v-else-if="getOtherErrors.length > 0">
                  <v-chip
                    class="ma-2"
                    small
                    color="black"
                    text-color="white"
                  >
                  <v-icon left small>
                    mdi-restore-alert
                  </v-icon>
                  server error
                  </v-chip>
                </span>
                <span v-else><v-icon small>mdi-check-outline</v-icon></span>
            </template>
            <template v-slot:item.task_id="{ item }">
                <v-chip
                    class="ma-2"
                    small
                    color="orange"
                    text-color="white"
                    v-if="item.task_id == 'New Crawler'"
                  >
                  <v-icon left small>
                    mdi-alert-decagram
                  </v-icon>
                  {{item.task_id}}
                  </v-chip>
                  <span v-else>{{item.task_id}}</span>
            </template>
              <template v-slot:item.btn_run_stop="{ item }">
                <v-btn
                  icon
                  v-if="crawlerButtonControlSwitch(item.task_id) && getJobState != 'finished'"
                  :disabled="getLoadingRunningCrawlerExecution || stoppingCrawler || getOtherErrors.length > 0"
                  v-on:click="exitRunningJob(item.task_id)"
                  color="black">
                  <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  v-else
                  :disabled="getLoadingRunningCrawlerExecution || getJobState != 'finished' || stoppingCrawler || getDeletingCrawlerLoading || getOtherErrors.length > 0"
                  v-on:click="executeCrawler(item.crawlerId)"
                  color="black">
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <!-- <span>{{item.crawlerId}}</span> -->
              </template>
              <template v-slot:item.btn_delete="{ item }">
                <v-btn
                  icon
                  :disabled="getLoadingRunningCrawlerExecution || getJobState != 'finished' || getOtherErrors.length > 0"
                  v-on:click="removeCrawler(item.crawlerId)"
                  color="black">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <!-- Details btn -->
              <template v-slot:item.details_btn="{ item }">
                <v-btn
                  icon
                  v-if="crawlerButtonControlSwitch(item.task_id) && getJobState != 'finished'"
                  :disabled="getLoadingRunningCrawlerExecution || stoppingCrawler || !crawlerDetailsReady || getOtherErrors.length > 0"
                  v-on:click="openCrawlerDetails()"
                  color="black">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-data-table>
        </v-card>
        <v-overlay :value="stoppingCrawler">
          <v-progress-circular
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>

        <v-dialog
          v-model="getDeletingCrawlerLoading"
          hide-overlay
          persistent
          width="300"
        >
          <v-card
            color="primary"
            dark
          >
            <v-card-text>
              Please stand by
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-snackbar
        ref="snackbarDeleteCrawler"
        elevation="24"
        color="success"
        v-model="crawlerAlert"
        :timeout="crawlerAlertTimeoutMessage"
        >
        <v-icon large>{{crawlerAlertIcon}}</v-icon>
        <b style="font-size:150%; margin-left:5px">{{ crawlerAlertMessage }}</b>
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="crawlerAlert = false"
          >
            Close
          </v-btn>
        </template>
    </v-snackbar>
      </v-main>
    <crawler-details 
        v-show="crawlerDetailsReady" 
        :percentage="productsInsertedPercentage" 
        :openDialog="triggerOpenCrawlerDetails" 
        :activeCrawlerDetails="getCrawlerDetails"
        :jobState="getJobState"
        :crawlertimeCounter="timeCounter"
        @update-openDialog="updateDialog"
    ></crawler-details>
   </v-app>
</template>


<script>
import {mapActions,mapGetters, mapState} from "vuex"
import CrawlerDetails from './CrawlerDetails.vue';
  export default {
  components: { CrawlerDetails },

    name: 'CrawlersList',
    props: {
      refreshCrawlerListData: false
    },
    
    data () {
      return {
        search: '',
        inProcess: true,
        startLongPolling:false,
        polling: null,
        stoppingCrawler: false,
        crawlerAlert: false,
        crawlerAlertTimeoutMessage: 5000,
        crawlerAlertMessage: '',
        crawlerAlertIcon: '',
        triggerOpenCrawlerDetails: false,
        totalProductsFound: 0,
        lastCrawler: {},
        lastCrawlerTaskId: null,
        crawlerDetailsReady: false,
        productsInsertedPercentage: 0,
        timeCounter: '',
        timeToPullFreshCrawlerData: 0,
        job_id : null,
        crawlerInProcess:{
          project: 'default',
          job: ''
        },
        headers: [
          {
            text: 'Crawler Name',
            align: 'start',
            value: 'name',
          },
          { text: 'Start URL', value: 'start_url', sortable: false },
          { text: 'Status', value: 'state', sortable: false },
          { text: 'Unique ID', value: 'task_id', sortable: false},
          { text: ' ', value: 'btn_run_stop', sortable: false },
          { text: ' ', value: 'btn_delete', sortable: false },
          { text: ' ', value: 'details_btn', sortable: false },
        ],
        // crawlers_data: getCrawlers
      }
    },

    mounted () {
      this.getJobState
      this.getCrawlersData();
    },

    watch: {
      getFullPath () {
        this.getCrawlersData()
      },

      refreshCrawlerListData(){
        // this.getCrawlersData()
        location.reload();
      },  

      getJobState(newVal, oldVal){
          // this.computeTimeToPullCrawlerData(this.getCrawlerDetails.number_of_products_found)
          console.log("TIME TO PULL---> "+this.timeToPullFreshCrawlerData)
          this.pollingFreshCrawlersInfo()
      },

      getLastCrawlerTaskId(newVal, oldVal){
          console.log("OLD ID: "+oldVal)
          console.log("NEW ID: "+newVal)
          if(oldVal != undefined){
            console.log("-->READY")
            this.crawlerDetailsReady = true
            
          }
      },
      
      getCrawlerProductsInserted(newVal, oldVal){
        this.productsInsertedPercentage = this.calculatePercentage(newVal, this.getCrawlerDetails.number_of_products_found)
      }

    },

    computed: {
      ...mapGetters("Auth",["isAuth"]),
      ...mapGetters("Crawler",["getCrawlers"]),
      ...mapGetters("Crawler",["isLoading"]),
      ...mapGetters("Crawler",["getLoadingRunningCrawlerExecution"]),
      ...mapGetters("Crawler",["getRunningCrawler"]),
      ...mapGetters("Crawler",["getRunningCrawlerTaskId"]),
      ...mapGetters("Crawler",["getJob"]),
      ...mapGetters("Crawler",["getFinishedJobs"]),
      ...mapGetters("Crawler",["getJobState"]),
      ...mapGetters("Crawler",["getDeletingCrawlerLoading"]),
      ...mapGetters("Crawler",["getCrawlerDetails"]),
      ...mapState("Crawler",["crawler_details"]),
      ...mapState("Crawler",["running_crawler_task_id"]),
      ...mapGetters("Crawler",["getOtherErrors"]),
      

      getFullPath () {
        return this.$route.path
      },

      getLastCrawlerTaskId(){
        return this.crawler_details.task_id
      },

      getCrawlerProductsInserted(){
        try {
          return this.getCrawlerDetails.products_inserted
        } catch (error) {}
      }

      

      
    },
    
    methods:{
        ...mapActions('Crawler',['getAllCrawlers']),
        ...mapActions('Crawler',['runCrawler']),
        ...mapActions('Crawler',['getJobs']),
        ...mapActions('Crawler',['cancelRunningJob']),
        ...mapActions('Crawler',['getRuningJobs']),
        ...mapActions('Crawler',['deleteCrawler']),
        ...mapActions('Crawler',['getCrawlerDetailsApi']),
        

        updateDialog(openDialog){
          this.triggerOpenCrawlerDetails = openDialog
        },

        getCrawlersData(){
          this.getAllCrawlers(this.crawlerInProcess)
        },

        


        executeCrawler(id){
          let playload = {'id': id, 'form': this.crawlerInProcess}
          console.log(playload)
          this.runCrawler(playload)
          this.startLongPolling=true
          this.crawlerAlert = true
          this.crawlerAlertMessage = "Crawler started"
          this.crawlerAlertIcon = 'mdi-spider'
          // this.pollingFreshCrawlersInfo()
        },

        exitRunningJob(taskId){
          this.crawlerInProcess['job'] = taskId
          this.stoppingCrawler = true
          this.cancelRunningJob(this.crawlerInProcess)
          this.inProcess = false
          this.timeCounter = ''
          
          this.getAllCrawlers(this.crawlerInProcess)
        },

        removeCrawler(crawlerId){
          let playload = {}
          playload['crawler_id'] = crawlerId
          playload['crawlerInProcess'] = this.crawlerInProcess
          playload['vm'] = this
          this.deleteCrawler(playload)
        },

        getCrawlerInfo (task_id){
          let jobs = this.getJob
          let finished_jobs = this.getFinishedJobs
          let crawler = null
          if(jobs.length > 0){
              crawler = jobs.find(o => o.id === task_id);
              if(crawler == null && finished_jobs.length > 0){
                  crawler = finished_jobs.find(o => o.id === task_id);
              }
          }
          else if(finished_jobs.length > 0){
              crawler = finished_jobs.find(o => o.id === task_id);
          }

          return crawler
        },

        crawlerButtonControlSwitch(task_id){
          let isActive = this.getCrawlerInfo(task_id) ? this.getCrawlerInfo(task_id).isActive : false
          
          return isActive
        },

        openCrawlerDetails(){
          this.triggerOpenCrawlerDetails = true
          console.log("TIME ES --->")
          console.log(this.getCrawlerDetails.estimatred_count_down_date)
          this.timeCountDown(this.getCrawlerDetails.estimatred_count_down_date)
        },

        computeTimeToPullCrawlerData(number_of_products_found){
            let number = number_of_products_found.toString().length;
            console.log('nbr : '+number)
            if (this.getJobState == 'pending') {
              return 1000
            }
            else if ( number == 1 || number == 2) {
              return 2000
            }
            else if ( number == 3){
              return 6000
            }
            else if ( number == 4){
              return 30000
            }
            else if ( number == 5){
              return 50000
            }
            else if ( number == 6){
              return 100000
            }
            return 200000
        },

        calculatePercentage(value, total){
          return Math.ceil((value/total) * 100)
        },

        pollingFreshCrawlersInfo(){
          // console.log(this.activateLongPolling)
            var interval = setInterval(
              function () { 
                this.getAllCrawlers(this.crawlerInProcess)

                this.getCrawlerDetailsApi()
                  if(this.getLastCrawlerTaskId == this.getJob[0].id){
                    this.crawlerDetailsReady = true
                  }
                  else{
                    this.crawlerDetailsReady = false
                  }
                  
             
                if(this.getJobState == 'finished' || !this.isAuth){
                  console.log("STOP POLLING!!")
                  clearInterval(interval);
                  if(this.isAuth){
                    let n_audio = new Audio('https://freesound.org/data/previews/320/320655_5260872-lq.mp3');
                    n_audio.play();
                  }
                  this.stoppingCrawler = false
                  this.crawlerDetailsReady = false
                  this.crawlerAlert = true
                  this.crawlerAlertMessage = "Crawler finished"
                  this.crawlerAlertIcon = 'mdi-spider'
                  // clearInterval(this.$store.getters['Crawler/getPollingInterval'])
                }
              }
              .bind(this), this.computeTimeToPullCrawlerData(this.getCrawlerDetails.number_of_products_found))
            // this.polling = interval
        },

        timeCountDown(time){
        // try {
          let countDownDate = new Date(time).getTime();
          

            // Run myfunc every second
            let myfunc = setInterval(function() {

            let now = new Date().getTime();
            let timeleft = countDownDate - now;

            // Calculating the days, hours, minutes and seconds left
            let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
            let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
                
            this.timeCounter = days+":"+hours+":"+minutes+":"+seconds
            console.log('TIME--------->')
            console.log(this.timeCounter)
            // Display the message when countdown is over
            if (timeleft < 0 || this.getJobState == 'finished') {
              this.timeCounter = ''
              clearInterval(myfunc);
                  console.log("TIME UP")
              }
            }
            .bind(this), 1000);
        // }
          // catch (error) {}
        },

    },

    // beforeDestroy () {
    //   clearInterval(this.polling)
    // },

    created () {
      this.getCrawlerDetailsApi()
      // let _lastCrawler = this.getCrawlerDetails.task_id
      // // this.lastCrawlerTaskId = _lastCrawler['task_id']
      //   console.log("crawlerDetailsTaskId===>")
      //   console.log(_lastCrawler)
      if(this.getJobState != 'finished'){
        
        this.pollingFreshCrawlersInfo()
      }

      
    }
    
  }
</script>