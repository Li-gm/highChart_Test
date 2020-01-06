<template>
    <div>
        <div class="clearfix" style="width: 200px;height: 200px;border:1px solid #ddd;float: left">
            <p>这是一个神奇的盒子！！！！</p>
        </div>
        <div class="clearfix" style="width: 200px;height: 200px;float: left">
            <ol>
                <li>数列1</li>
                <li>数列1</li>
                <li>数列1</li>
                <li>数列1</li>
                <li>数列1</li>
            </ol>
        </div>
        <div class="clearfix" style="width: 200px;height: 200px">
           <p>
               这是第一个盒子
           </p>
        </div>
        <div class="clearfix" style="width: 200px;height: 200px">
            这是第er个盒子
        </div>
    </div>
</template>

<script>
  export default {
    name: "clearFix"
  }
</script>

<style scoped>
    /*清除浮动*/
    .clearfix:after {
        display: block;
        clear: both;
        height: 0;
        visibility: hidden;
        content: " ";
    }
</style>