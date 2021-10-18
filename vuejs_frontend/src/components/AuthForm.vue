<template>
   <!-- <v-app id="inspire"> -->
            <v-form @submit.prevent="loginUser" id="auth-form">
               <v-alert
               v-if="getAuthErrors != null"
               dense
               outlined
               type="error"
            >
               <strong>Oops!..Something is wrong:</strong>
               <ul v-if="getAuthErrors.non_field_errors != null">
                  <li v-for="(error,index) in getAuthErrors.non_field_errors" :key="index">{{error}}</li>
               </ul>
               <ul v-else>
                  <li>Please enter a correct username and password</li>
               </ul>
            </v-alert>

            <v-text-field
                  outlined
                  append-icon="mdi-account-tie"
                  v-model="form.username"
                  name="Username"
                  label="Username"
                  type="text"
               ></v-text-field>
               <v-text-field
                  outlined
                  id="password"
                  append-icon="mdi-lock"
                  v-model="form.password"
                  name="password"
                  label="Password"
                  type="password"
               ></v-text-field>


               <v-btn x-large class="col-md-12 col-lg-12 mx-auto my-12" type="submit" color="primary" form="auth-form" :loading="isLoading">Login</v-btn>
          </v-form>
   <!-- </v-app> -->
</template>


<script>
import {mapActions,mapGetters} from "vuex"

  export default {
    name: 'AuthForm',

    data()
    {
      return{
        form:{
          username:'',
          password:''
        },
      }
    },

    computed: {
      ...mapGetters("Auth",["isLoading"]),
      ...mapGetters("Auth", ["getAuthErrors"]),
    },

    methods:{
      ...mapActions('Auth',['login']),

        loginUser(){
          this.login(this.form)
        },

        
        
    },
  }
</script>
