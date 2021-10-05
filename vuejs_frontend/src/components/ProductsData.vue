<template>
   <v-app id="inspire">
      <v-main>
        <v-btn color="error" 
              style="margin-right: 10px;margin-bottom:10px" 
              @click="dropProducts"
              :disabled="getJobState != 'finished' || !Array.isArray(getProductsDataFromDB) || getProductsDataFromDB.length == 0  ? true : false"
              >
          <v-icon left>mdi-database-remove</v-icon>
              CLEAR PRODUCTS DATA
        </v-btn>
        <!-- <v-btn
              color="success"
              style="margin-right: 10px;margin-bottom:10px" 
              @click="downloadCSVFile"
              >
          <v-icon left>mdi-file-download-outline</v-icon>
              Download CSV file
        </v-btn> -->
        <v-menu
          rounded="lg"
          offset-y
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              color="success"
              style="margin-right: 10px;margin-bottom:10px"
              class="white--text"
              v-bind="attrs"
              v-on="on"
              :disabled="!Array.isArray(getProductsDataFromDB) || getProductsDataFromDB.length == 0  ? true : false"
            >
              <v-icon left>mdi-download</v-icon>
              Download Products Data
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              link
            >
              <v-list-item-title @click="downloadCSVFile">
                <v-icon left>mdi-file-delimited</v-icon>
                Download CSV
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-list>
            <v-list-item
              link
            >
              <v-list-item-title @click="downloadJSONFile">
                <v-icon left>mdi-code-json</v-icon>
                Download JSON
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn 
              style="margin-right: 10px;margin-bottom:10px" 
              @click="refreshDataTable"
              >
          <v-icon left>mdi-database-refresh</v-icon>
              Refresh
        </v-btn>
        <v-card>
          <v-card-title v-if="getProductsDataFromDB.length > 0">
            Products Data ({{getProductsDataFromDB.length}} products)
            <v-spacer></v-spacer>
            </v-card-title>
          <v-card-title v-else>
            No products data found
            <v-spacer></v-spacer>
            </v-card-title>
          <v-data-table v-if="Array.isArray(getProductsDataFromDB) && getProductsDataFromDB.length > 0"
            :headers="headers"
            :items="getProductsDataFromDB"
            class="elevation-1"
            :loading="getLoadingProductsData"
            loading-text="Loading... Please wait, this might take sometime"
          >
            <template v-slot:item.url="{ item }">
              <a :href="item.url" target="_blank">{{item.url}}</a>
            </template>
          </v-data-table>
        </v-card>
        <v-snackbar
          ref="dropProductsData"
          elevation="24"
          color="success"
          v-model="dropProductsDataAlert"
          :timeout="dropProductsDataTimeoutMessage"
        >
            <v-icon large>{{dropProductsDataAlertIcon}}</v-icon>
            <b style="font-size:150%; margin-left:5px">{{ dropProductsDataAlertMessage }}</b>
            <template v-slot:action="{ attrs }">
              <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="dropProductsDataAlert = false"
              >
                Close
              </v-btn>
            </template>
        </v-snackbar>
        <v-overlay :value="getLoadingProductsDrop">
          <v-progress-circular
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>
      </v-main>
   </v-app>
</template>


<script>
import {mapActions,mapGetters} from "vuex"

  export default {
    name: 'CreateCrawler',

    data()
    {
      return{
        productsKeys: [],
        headers: [],
        dropProductsDataAlert: false,
        dropProductsDataTimeoutMessage: 5000,
        dropProductsDataAlertIcon: '',
        dropProductsDataAlertMessage: '',

      }
    },

    watch: {
      getFullPath(){
        this.renderProductsDataTable()
        // console.log(this.headers)
      }
    },

    mounted(){
      
    },

    computed: {
      ...mapGetters("Crawler",["getProductsDataFromDB"]),
      ...mapGetters("Crawler",["getLoadingProductsData"]),
      ...mapGetters("Crawler",["getLoadingProductsDrop"]),
      ...mapGetters("Crawler",["getJobState"]),

      getFullPath () {
        return this.$route.path
      },
    },

    methods:{
        ...mapActions('Crawler',['getProductsData']),
        ...mapActions('Crawler',['dropProductsData']),

        removeDuplicates(array) {
          return array.filter((a, b) => array.indexOf(a) === b)
        },

        getProductsDataElementsKeys(){
          try {
            let _productkeys = []
            this.getProductsDataFromDB.forEach(product => {
              _productkeys.push(Object.keys(product))
            });
            let mergeProductsKeys = [].concat.apply([], _productkeys);
            this.productsKeys = this.removeDuplicates(mergeProductsKeys)
          } catch (error) {
            console.error('No Products data')
          }
          
        },

        generateHeaders(){
          try {
            this.productsKeys.forEach(key => {
              let header = {}
              header['text'] = key;
              header['value'] = key;
              header['align'] = 'left'
              this.headers.push(header)
            });
          } catch (error) {
            console.error('No Products data')
          }
          
        },

        renderProductsDataTable(){
          this.getProductsData()  
          this.getProductsDataElementsKeys()
          this.generateHeaders()
        },

        refreshDataTable(){
          location.reload();
        },

        dropProducts(){
          let vm = this
          this.dropProductsData(vm)
        },


        downloadCSVFile(){
          let productsJSON = JSON.stringify(this.getProductsDataFromDB);
          let csv = this.ConvertToCSV(productsJSON)
          let filename = 'products_data_'+this.getProductsDataFromDB.length+'.csv'
          const anchor = document.createElement('a');
          anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
          anchor.target = '_blank';
          anchor.download = filename;
          anchor.click();
        },

        downloadJSONFile(){
          let productsJSON = JSON.stringify(this.getProductsDataFromDB);
          let filename = 'products_data_'+this.getProductsDataFromDB.length+'.json'
          const anchor = document.createElement('a');
          anchor.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(productsJSON);
          anchor.target = '_blank';
          anchor.download = filename;
          anchor.click();
        },

        ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var csv = '';
            array.forEach(product => {
              var arr_line = []
              this.productsKeys.forEach(element => {
                var pr_keys = Object.keys(product)
                if(pr_keys.includes(element)){
                  var data = product[element]
                  data = data != null ? data.toString() : ''
                  if(element != 'url' && element != 'last_update_date')
                  {
                    data = data.replace(/(\r\n|\n|\r)/gm, "");
                    data = data.replace(/[\/\\'":*?<>{}]/g,"")
                  }
                  data = data.includes(',') ? '"'+data+'"' : data
                  data = data.trim();
                  arr_line.push(data)
                }
                else
                  arr_line.push('')
              });
              csv += arr_line.join(',')+ '\r\n'
            });

            csv = this.productsKeys.join(',')+'\r\n'+csv
            
            return csv;
        }
        
    },

    created() {
      this.renderProductsDataTable()
    }
  }
</script>
