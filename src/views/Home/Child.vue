<template>
    <div class="child">
        <br>
        <h3>这里是子组件</h3>
        <br>
        <div style="font-size: 18px">childText: {{msg}}</div>
        <br>
        <Button type="primary" style="margin-right: 10px" @click="clickHandler">修改父组件文本</Button>
        <Button type="primary" @click="clickHandler2">修改自己文本</Button>
    </div>
</template>

<script>
  import store from '../../store/index.js'
  export default {
    name: "Child",
    data(){
      return{

      }
    },
    computed:{
      msg(){
        return this.$store.state.childText;
      }
    },
    methods: {
      clickHandler(){
        this.$store.commit("changeTestMsg", "子组件修改父组件后的文本");
      },
      clickHandler2(){
        this.$store.commit("changeChildText", "子组件修改自己后的文本");
      }
    },
    store
  }
</script>

<style scoped>
    .child{
        border:1px solid red;
        height:200px;
        margin:30px;
    }
</style>