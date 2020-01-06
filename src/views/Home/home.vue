<template>
    <div style="">
        <div class="banner">
            <swiper :options="swiperOption" ref="mySwiper">
                <!-- slides -->
                <swiper-slide>
                    <img class="bg1" src="../../assets/picture1.jpg" alt="">
                </swiper-slide>
                <swiper-slide>
                    <img class="bg1" src="../../assets/picture2.jpg" alt="">
                </swiper-slide>
                <swiper-slide>
                    <img class="bg1" src="../../assets/picture3.jpeg" alt="">
                </swiper-slide>
                <swiper-slide>
                    <img class="bg1" src="../../assets/picture4.jpeg" alt="">
                </swiper-slide>
                <!-- Optional controls -->
                <div class="swiper-pagination"  slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
                <!--<div class="swiper-scrollbar" slot="scrollbar"></div>-->
            </swiper>
        </div>
        <div style="text-align: center;margin-top: 30px">
            <Button type="primary" size="large" @click="vuexText">跳转</Button>
        </div>
        <Row style="margin: 10px 100px">
            <!--v-for="(items,index) in travels" :key="index"-->
            <Col span="24" v-show="showForm" v-for="(items,index) in travels" :key="index" style="border: 1px solid #ddd;margin-bottom: 10px">
                <!--<span>shiyou{{index + 1}}</span>-->
                <!--<i class="" style="font-size: .4rem;color:#D82530;" v-if="index !== 0" @click="delect(index)">1111</i>-->
                <Col span="24" style="background: #4181ba;color: #fff;font-size: 16px;padding:5px 0 5px 10px">
                    <span>{{index + 1}}、input</span>
                    <div style="position: absolute;right: 10px;top: 0px;">
                        <Icon type="ios-trash" size="20" @click="deleteList(index)"/>
                    </div>
                </Col>
                <Col span="24">
                    <span>输入框1：</span>
                    <Input v-model="items.address" placeholder="Enter something..." style="width: 300px" />
                </Col>
                <Col span="24">
                    <span>输入框2：</span>
                    <Input v-model="items.startDate" placeholder="Enter something..." style="width: 300px" />
                </Col>
            </Col>
            <Col span="24">
                <Button type="primary" @click="addList">+ add</Button>
            </Col>
            <Col span="24" style="text-align: center;margin-top: 20px">
                <Button type="primary" @click="submitInfo">Submit</Button>
            </Col>
        </Row>
    </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: "home",
    components: {
      swiper,
      swiperSlide
    },
    data(){
      return{
        swiperOption: {
          slidesPerView: 1, //一个窗口存放几个图
          slidesPerGroup: 1,// 一次滚动几个图
          //loopFillGroupWithBlank: true,// 空白填充
          loop: true,
          autoplay: {
            disableOnInteraction: false,
            delay: 2000
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          scrollbar: {
            el: '.swiper-scrollbar',
          },
        },
        travels: [],
        showForm:false,
      }
    },
    methods:{
      vuexText(){
        this.$router.push({path:'/vuexDome'})
      },
      addList(){
        this.showForm = true;
        this.travels.push({
          address: '',
          startDate: '',
        });
      },
      deleteList(val){
        this.travels.splice(val, 1);
      },
      submitInfo(){
        console.log(this.travels);
      }
    },
    created(){

    },
    mounted(){

    }
  }
</script>

<style scoped>
    .banner{
        width: 550px;
        height: 500px;
        margin:0 auto
    }
    .bg1{
        width: 100%;
        height: 500px;
    }
</style>
