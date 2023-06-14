<template>
<div>
  <nav-bar/>
  <iframe src="http://127.0.0.1:5601/app/kibana#/dashboard/add2d9f0-2ccc-11ec-b086-170905fe3061?embed=true&embed=true&_a=(description:'',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(),gridData:(h:18,i:'8da22e89-b640-410b-bb8c-1e04d3a56f6e',w:13,x:0,y:0),id:f9b0abf0-2a78-11ec-b086-170905fe3061,panelIndex:'8da22e89-b640-410b-bb8c-1e04d3a56f6e',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:6,i:'7f26c883-c479-4fd7-aae0-d834dfe6d648',w:35,x:13,y:0),id:'67ac82c0-2a72-11ec-b086-170905fe3061',panelIndex:'7f26c883-c479-4fd7-aae0-d834dfe6d648',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'5fb8d11e-52d3-46d9-8c68-76068ef4a613',w:35,x:13,y:6),id:b03533e0-2d90-11ec-b086-170905fe3061,panelIndex:'5fb8d11e-52d3-46d9-8c68-76068ef4a613',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:16,i:d6073acb-e2b1-4bce-8b3f-8b281ad88787,w:13,x:0,y:18),id:'05917bd0-2cc6-11ec-b086-170905fe3061',panelIndex:d6073acb-e2b1-4bce-8b3f-8b281ad88787,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:13,i:'7c909eed-ca5f-43c3-9157-c28ee37be2c0',w:18,x:13,y:21),id:'5ef0c070-2a71-11ec-b086-170905fe3061',panelIndex:'7c909eed-ca5f-43c3-9157-c28ee37be2c0',type:visualization,version:'7.7.0'),(embeddableConfig:(legendOpen:!f,vis:(legendOpen:!t)),gridData:(h:13,i:b1e97db8-dae5-4d7d-b9c5-29d22340920c,w:17,x:31,y:21),id:c698ac30-2a74-11ec-b086-170905fe3061,panelIndex:b1e97db8-dae5-4d7d-b9c5-29d22340920c,type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'785e7454-7751-49fb-9c13-a2d8531e0470',w:23,x:0,y:34),id:c12acd70-2cc5-11ec-b086-170905fe3061,panelIndex:'785e7454-7751-49fb-9c13-a2d8531e0470',type:visualization,version:'7.7.0'),(embeddableConfig:(),gridData:(h:15,i:'73060513-b575-4bb9-9271-94f0c0c09f91',w:25,x:23,y:34),id:cf5ef2a0-2a71-11ec-b086-170905fe3061,panelIndex:'73060513-b575-4bb9-9271-94f0c0c09f91',type:visualization,version:'7.7.0')),query:(language:kuery,query:''),timeRestore:!f,title:Dashboard,viewMode:view)&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))" height="100%" width="100%" style="position: absolute"></iframe>
</div>
</template>

<script>
import NavBar from '../components/NavBar.vue'

  export default {
    name: 'Dashboard',

    components: {
      NavBar,
    },
  }
</script>
<style scoped>
body{
  overflow: hidden;
}
</style>
