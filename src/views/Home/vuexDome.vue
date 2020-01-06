<template>
    <div class="parent">
        <br>
        <h3>这里是父组件</h3>
        <br>
        <Button type="primary" style="margin-right: 10px" @click="clickHandler">修改自己文本</Button>
        <Button type="warning" @click="clickHandler2">修改子组件文本</Button>
        <br>
        <br>
        <div style="font-size: 18px">Test: {{msg}}</div>
        <div>
            <child></child>
        </div>
        <div style="text-align: center;margin-top: 100px">
            <Button type="primary" size="large" @click="vuexText">跳转</Button>
        </div>
    </div>
</template>

<script>
  import store from '../../store/index.js'
  import Child from './Child.vue'
  export default {
    name: "vuexDome",
    components:{
      'child': Child
    },
    data(){
      return{

      }
    },
    methods:{
      clickHandler(){
        this.$store.commit('changeTestMsg', '父组件修改自己后的文本')
      },
      clickHandler2(){
        this.$store.commit('changeChildText', '父组件修改子组件后的文本')
      },
      vuexText(){
        this.$router.push({path:'/HighCharts'})
      }
    },
    computed: {
      msg(){
        return this.$store.state.testMsg;
      }
    },
    store,
  }
</script>

<style scoped>
    .parent{
        border:1px solid #00BBFF;
        height: 400px;
        width: 400px;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        margin-top: 30px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>