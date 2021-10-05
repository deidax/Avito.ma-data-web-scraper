<template>
  <v-row justify="center">
    <v-dialog
      v-model="openCreateForm"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Create New Crawler</span>
        </v-card-title>
        <v-card-text>
          <v-form class="ccf" @submit.prevent="createNewCrawler" id="create-crawler-form">
          <v-alert
            dense
            outlined
            type="error" 
            v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </v-alert>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Crawler Name*"
                  v-model="form.name"
                  name="name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Crawler Start URL*"
                  v-model="form.start_url"
                  hint="This's the Avito url where the crawler will start loading products data from"
                  name="start_url"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <h3>Select data to look for</h3>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="3">
                <v-checkbox
                  value="seller_data"
                  v-model="options"
                  label="Seller Data"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  value="price"
                  v-model="options"
                  label="Price"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  value="description"
                  v-model="options"
                  label="Description"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  value="subject"
                  v-model="options"
                  label="Subject"
                ></v-checkbox>
              </v-col>

              <v-col cols="3">
                <v-checkbox
                  value="phone"
                  v-model="options"
                  label="Phone numbers"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  value="city"
                  v-model="options"
                  label="Cities"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  value="number_of_product_images"
                  v-model="options"
                  label="Images count"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  value="extra_data"
                  v-model="options"
                  label="Extra data"
                ></v-checkbox>
              </v-col>

                     
            </v-row>
          </v-container>
          </v-form>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn
            color="blue darken-1"
            text
            @click="closeDialog()"
          >
            Close
          </v-btn>
          <v-btn
            type="submit" 
            :loading="isLoading" 
            form="create-crawler-form"
            color="blue darken-1"
            text
          >
            <!-- @click="closeDialog()" -->
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import {mapActions,mapGetters} from "vuex"
  export default {
    name: "CreateCrawler",
    
    props: {
      openCreateForm: Boolean,
    },

    data: () => ({
      form:{
          name: '',
          start_url: '',
      },
      options:[],
      errors: []
    }),

    computed: {
      ...mapGetters("Crawler",["isLoading"]),
    },

    methods: {
      ...mapActions('Crawler',['createCrawler']),
      ...mapActions('Crawler',['getAllCrawlers']),

      checkForm(){
        if (this.form.start_url && this.form.name && this.form.name.length > 3 && this.options.length > 0 && this.checkifValidStartURL(this.form.start_url)) {
          return true;
        }

        this.errors = [];

        if (!this.form.name) {
          this.errors.push('Crawler Name required.');
        }
        if (this.form.name.length <= 3 && this.form.name) {
          this.errors.push('Crawler Name should be longer than 3 characters.');
        }
        if (!this.form.start_url) {
          this.errors.push('Crawler Start Url required.');
        }
        if (this.options.length == 0) {
          this.errors.push('Select data to look for.');
        }
        if(!this.checkifValidStartURL(this.form.start_url)){
          this.errors.push('Choose only start urls from Avito.com that have 1 or multiple products.');
        }
      },


      createNewCrawler(){
        if(this.checkForm()){
          let options = this.options.toString()
          this.form['options'] = options
          let playload = {}
          playload['form'] = this.form
          playload['vm'] = this
          this.createCrawler(playload).then(this.closeDialog())
          this.$emit('update-crawlersList')
        }
        
      },

      closeDialog(){
        this.errors = []
        let openForm = this.openCreateForm
        openForm = false
        this.$emit('update-openCreateForm', openForm)
      },

      checkifValidStartURL(formUrl){
        try {
          let url = new URL('', formUrl)
          return url.hostname == "www.avito.ma"
        } catch{
          this.errors.push('Invalid URL. choose a Start Url from Avito.com.')
        }
        
      }

  }
}
</script>